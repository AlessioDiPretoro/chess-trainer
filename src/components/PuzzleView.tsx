import { Chess, type Square } from "chess.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { primaryTheme, themeLabel } from "../data/puzzleThemes";
import { getSolvedPuzzleCount, getSolvedPuzzleIds, markPuzzleSolved } from "../db/db";
import { buildMoveComment, classifyQuality, signedScore } from "../engine/moveExplanation";
import { StockfishEngine } from "../engine/stockfish";
import { speakText, stopSpeaking } from "../engine/speech";
import type { Puzzle } from "../types/puzzle";
import { Board } from "./Board";
import { MoveList } from "./MoveList";
import { PromotionPicker, type PromotionPiece } from "./PromotionPicker";

type Props = {
  onExit: () => void;
};

type RatingFilter = "all" | "easy" | "medium" | "hard";

const RATING_RANGES: Record<RatingFilter, [number, number]> = {
  all: [0, 9999],
  easy: [0, 1299],
  medium: [1300, 1899],
  hard: [1900, 9999],
};

function uciParts(uci: string) {
  return { from: uci.slice(0, 2) as Square, to: uci.slice(2, 4) as Square, promotion: uci.slice(4, 5) || undefined };
}

export function PuzzleView({ onExit }: Props) {
  const [allPuzzles, setAllPuzzles] = useState<Puzzle[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [solvedCount, setSolvedCount] = useState(0);

  const [current, setCurrent] = useState<Puzzle | null>(null);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [moveIndex, setMoveIndex] = useState(0);
  const [status, setStatus] = useState<"playing" | "solved">("playing");
  const [feedback, setFeedback] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabledState] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);

  const engineRef = useRef<StockfishEngine | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- puzzleKey forza un nuovo Chess() a ogni nuovo puzzle
  const chess = useMemo(() => new Chess(current?.fen), [puzzleKey]);
  const [fen, setFen] = useState(chess.fen());

  useEffect(() => {
    const engine = new StockfishEngine();
    engineRef.current = engine;
    return () => engine.terminate();
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}puzzles.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Puzzle[]) => setAllPuzzles(data))
      .catch((error) => {
        console.error("Errore nel caricamento dei puzzle:", error);
        setLoadError("Non è stato possibile caricare i puzzle. Controlla la connessione e riprova.");
      });
    getSolvedPuzzleIds().then(setSolvedIds);
    getSolvedPuzzleCount().then(setSolvedCount);
  }, []);

  function pickNext(pool: Puzzle[], solved: Set<string>) {
    const [min, max] = RATING_RANGES[ratingFilter];
    const inRange = pool.filter((p) => p.rating >= min && p.rating <= max);
    const unsolved = inRange.filter((p) => !solved.has(p.id));
    const source = unsolved.length > 0 ? unsolved : inRange;
    if (source.length === 0) {
      setCurrent(null);
      return;
    }
    const next = source[Math.floor(Math.random() * source.length)];
    setCurrent(next);
    setPuzzleKey((k) => k + 1);
    setMoveIndex(0);
    setStatus("playing");
    setFeedback("");
    setPendingPromotion(null);
  }

  useEffect(() => {
    if (allPuzzles) pickNext(allPuzzles, solvedIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPuzzles, ratingFilter]);

  useEffect(() => {
    setFen(chess.fen());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzleKey]);

  const solverColor: "w" | "b" = current ? (new Chess(current.fen).turn() as "w" | "b") : "w";
  const orientation: "white" | "black" = solverColor === "w" ? "white" : "black";

  const history = chess.history({ verbose: true });
  const lastMove = history[history.length - 1];

  const theme = current ? primaryTheme(current.themes) : null;

  useEffect(() => {
    if (voiceEnabled && feedback) speakText(feedback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback, voiceEnabled]);

  async function onWrongMove(
    fenBeforeMove: string,
    playedMove: { san: string; from: Square; to: Square; piece: string; captured?: string },
    fenAfterWrong: string,
    correctUci: string
  ) {
    setFeedback("");
    setFeedbackLoading(true);
    try {
      const correctClone = new Chess(fenBeforeMove);
      const correctParts = uciParts(correctUci);
      const correctMove = correctClone.move(correctParts);
      const bestMoveSan = correctMove?.san ?? null;
      const engine = engineRef.current;
      const themeNote = theme ? ` Tema del puzzle: ${themeLabel(theme)}.` : "";

      if (!engine) {
        setFeedback(`Non è la mossa di questo puzzle.${bestMoveSan ? ` La soluzione prevista è ${bestMoveSan}.` : ""}${themeNote}`);
        return;
      }

      const moverColor = new Chess(fenBeforeMove).turn();
      const depth = 14;
      const before = await engine.analyze(fenBeforeMove, depth);
      const after = await engine.analyze(fenAfterWrong, depth);
      const bestEval = signedScore(before.scoreCp, before.scoreMate);
      const ownEval = -signedScore(after.scoreCp, after.scoreMate);
      const centipawnLoss = Math.max(0, Math.round(bestEval - ownEval));
      const quality = classifyQuality(centipawnLoss);

      let detail: string;
      if (quality === "mistake" || quality === "blunder") {
        detail = buildMoveComment({
          fenBeforeMove,
          fenAfterMove: fenAfterWrong,
          moveSan: playedMove.san,
          moveFrom: playedMove.from,
          moveTo: playedMove.to,
          movePiece: playedMove.piece,
          moveCaptured: playedMove.captured,
          moverColor,
          quality,
          centipawnLoss,
          bestMoveSan,
          opponentBestMoveUci: after.bestMove,
        });
      } else {
        detail = `Il motore non la giudica un errore grave, ma il puzzle richiede un'altra continuazione${bestMoveSan ? ` (la soluzione prevista è ${bestMoveSan})` : ""}.`;
      }

      setFeedback(`Non è la mossa di questo puzzle. ${detail}${themeNote}`);
    } catch (error) {
      console.error("Errore nell'analisi della mossa sbagliata:", error);
      setFeedback("Non è la mossa di questo puzzle. Riprova.");
    } finally {
      setFeedbackLoading(false);
    }
  }

  async function finishSolved() {
    setStatus("solved");
    setFeedback("Puzzle risolto!");
    if (current) {
      await markPuzzleSolved(current.id);
      setSolvedIds((prev) => new Set(prev).add(current.id));
      setSolvedCount((c) => c + 1);
    }
  }

  async function playOpponentReplyThen(nextMoveIndex: number) {
    if (!current) return;
    if (nextMoveIndex >= current.moves.length) {
      await finishSolved();
      return;
    }
    // la risposta dell'avversario è forzata dal puzzle: la applichiamo noi dopo una breve pausa
    setTimeout(() => {
      const reply = current.moves[nextMoveIndex];
      chess.move(uciParts(reply));
      setFen(chess.fen());
      setMoveIndex(nextMoveIndex + 1);
    }, 400);
  }

  function attemptMove(from: string, to: string, promotion?: string) {
    if (!current) return false;
    const fenBeforeMove = chess.fen();
    const move = chess.move({ from, to, promotion });
    if (!move) return false;

    const expectedUci = current.moves[moveIndex];
    const expected = uciParts(expectedUci);
    const isCorrect = move.from === expected.from && move.to === expected.to && (move.promotion ?? "") === (expected.promotion ?? "");

    if (!isCorrect) {
      const fenAfterWrong = chess.fen();
      chess.undo();
      setFen(chess.fen());
      void onWrongMove(fenBeforeMove, move, fenAfterWrong, expectedUci);
      return false;
    }

    setFeedback("");
    setFen(chess.fen());
    void playOpponentReplyThen(moveIndex + 1);
    return true;
  }

  function onPieceDrop({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }): boolean {
    if (!targetSquare || !current || status !== "playing" || feedbackLoading || pendingPromotion) return false;

    const candidates = chess.moves({ square: sourceSquare as Square, verbose: true }).filter((m) => m.to === targetSquare);
    if (candidates.length === 0) return false;

    if (candidates[0].promotion) {
      setPendingPromotion({ from: sourceSquare as Square, to: targetSquare as Square });
      return false;
    }

    return attemptMove(sourceSquare, targetSquare);
  }

  function resolvePromotion(piece: PromotionPiece) {
    if (!pendingPromotion) return;
    const { from, to } = pendingPromotion;
    setPendingPromotion(null);
    attemptMove(from, to, piece);
  }

  function showSolution() {
    if (!current || status !== "playing") return;
    for (let i = moveIndex; i < current.moves.length; i++) {
      chess.move(uciParts(current.moves[i]));
    }
    setFen(chess.fen());
    setMoveIndex(current.moves.length);
    void finishSolved();
  }

  function nextPuzzle() {
    stopSpeaking();
    if (allPuzzles) pickNext(allPuzzles, solvedIds);
  }

  function toggleVoice() {
    setVoiceEnabledState((enabled) => {
      const next = !enabled;
      if (!next) stopSpeaking();
      return next;
    });
  }

  return (
    <div className="app-shell">
      <div className="top-bar">
        <button className="nav-back" onClick={onExit}>
          ← Home
        </button>
        <h2>Problemi</h2>
      </div>

      <div className="board-layout">
        <div className="board-column">
          <Board
            fen={fen}
            onPieceDrop={onPieceDrop}
            orientation={orientation}
            lastMoveFrom={lastMove?.from}
            lastMoveTo={lastMove?.to}
          />
          <div className="board-controls">
            <button className="btn" onClick={toggleVoice} title="Voce" aria-label="Voce">
              {voiceEnabled ? "🔊" : "🔇"}
            </button>
            <div className="board-controls-right">
              <button className="btn" onClick={showSolution} disabled={status !== "playing"}>
                Mostra soluzione
              </button>
              <button className="btn btn-primary" onClick={nextPuzzle} disabled={!allPuzzles}>
                Prossimo puzzle
              </button>
            </div>
          </div>
        </div>

        <div className="side-panel">
          <div className="card">
            <div className="difficulty-row">
              <span className="difficulty-label">Difficoltà</span>
              <select
                className="btn"
                style={{ flex: 1 }}
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value as RatingFilter)}
              >
                <option value="all">Tutte</option>
                <option value="easy">Facile (sotto 1300)</option>
                <option value="medium">Media (1300-1900)</option>
                <option value="hard">Difficile (oltre 1900)</option>
              </select>
            </div>
            <p className="meta">{solvedCount} puzzle risolti in totale</p>
          </div>

          {loadError && (
            <div className="card deviation-banner">
              <p>{loadError}</p>
            </div>
          )}

          {!allPuzzles && !loadError && <p className="status-line">Caricamento puzzle…</p>}

          {current && (
            <div className="card explanation-card">
              {theme && <span className="pattern-tag">tema: {themeLabel(theme)}</span>}
              <h3>
                Trova la mossa migliore ({current.rating} Elo) — {solverColor === "w" ? "muove il Bianco" : "muove il Nero"}
              </h3>
              <p className="status-line">
                Questo è un puzzle reale (database puzzle di Lichess). C'è solo una continuazione corretta: se sbagli,
                l'istruttore ti spiega perché e puoi riprovare.
              </p>
            </div>
          )}

          {pendingPromotion && (
            <PromotionPicker onChoose={resolvePromotion} onCancel={() => setPendingPromotion(null)} />
          )}

          {feedbackLoading && <p className="status-line">Analizzo la mossa…</p>}

          {feedback && !feedbackLoading && (
            <div className={`card deviation-banner ${status === "solved" ? "good" : ""}`}>
              <p>{feedback}</p>
            </div>
          )}

          {status === "solved" && (
            <div className="card explanation-card">
              <h3>Puzzle risolto!</h3>
              <div className="btn-row">
                <button className="btn btn-primary" onClick={nextPuzzle}>
                  Prossimo puzzle
                </button>
              </div>
            </div>
          )}

          <div className="card">
            <h3>Mosse</h3>
            <MoveList moves={chess.history()} />
          </div>
        </div>
      </div>
    </div>
  );
}
