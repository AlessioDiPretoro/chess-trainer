import { Chess, type Square } from "chess.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { lookupOpeningName, suggestKnownMoves, suggestStyleIdeas } from "../data/openingNames";
import { getDifficulty, recordGame } from "../db/db";
import { reviewGame } from "../engine/gameReview";
import { engineDepthFor, StockfishEngine } from "../engine/stockfish";
import type { GameReviewResult } from "../types/gameReview";
import { Board } from "./Board";
import { GameReviewPanel } from "./GameReviewPanel";
import { MoveList } from "./MoveList";
import { PromotionPicker, type PromotionPiece } from "./PromotionPicker";

type Props = {
  onExit: () => void;
};

type PendingPromotion = { from: Square; to: Square } | null;

const INSTRUCTOR_GAME_ID = "instructor-game";

export function InstructorGameView({ onExit }: Props) {
  const [gameKey, setGameKey] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- gameKey intentionally forces a fresh Chess() on "new game"
  const chess = useMemo(() => new Chess(), [gameKey]);
  const engineRef = useRef<StockfishEngine | null>(null);
  const lastMatchedNameRef = useRef<string | null>(null);
  const exitedAnnouncedRef = useRef(false);

  const [fen, setFen] = useState(chess.fen());
  const [status, setStatus] = useState("Il tuo turno (bianco)");
  const [comment, setComment] = useState("Fai la tua prima mossa: l'istruttore commenterà che apertura stai giocando.");
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficultyState] = useState(5);
  const [thinking, setThinking] = useState(false);
  const [ready, setReady] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion>(null);
  const [hoveredSan, setHoveredSan] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewResult, setReviewResult] = useState<GameReviewResult | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [reviewProgress, setReviewProgress] = useState<{ done: number; total: number } | null>(null);

  useEffect(() => {
    const engine = new StockfishEngine();
    engineRef.current = engine;
    setReady(false);
    lastMatchedNameRef.current = null;
    exitedAnnouncedRef.current = false;

    getDifficulty()
      .then((level) => {
        setDifficultyState(level);
        return engine.setSkillLevel(level);
      })
      .catch((error) => {
        console.error("Errore nell'avvio del motore:", error);
      })
      .finally(() => setReady(true));

    return () => engine.terminate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameKey]);

  function updateStatusText() {
    if (chess.isCheckmate()) {
      setStatus(chess.turn() === "w" ? "Scacco matto: hai perso" : "Scacco matto: hai vinto!");
    } else if (chess.isDraw()) {
      setStatus("Patta");
    } else if (chess.isCheck()) {
      setStatus(chess.turn() === "w" ? "Sei sotto scacco" : "Hai dato scacco");
    } else {
      setStatus(chess.turn() === "w" ? "Il tuo turno (bianco)" : "L'avversario sta pensando…");
    }
  }

  function updateCommentary() {
    const match = lookupOpeningName(chess.history());
    if (match) {
      setComment(match.name);
      lastMatchedNameRef.current = match.name;
      exitedAnnouncedRef.current = false;
    } else if (!exitedAnnouncedRef.current) {
      setComment(
        lastMatchedNameRef.current
          ? `Siamo usciti dalla teoria conosciuta (ultimo schema riconosciuto: ${lastMatchedNameRef.current}).`
          : "Nessuno schema noto riconosciuto per questa mossa."
      );
      exitedAnnouncedRef.current = true;
    }
    // se non c'è match e l'uscita dalla teoria è già stata annunciata, restiamo in silenzio
  }

  async function finishGameOver() {
    const loser = chess.isCheckmate() ? chess.turn() : null;
    const result: "win" | "loss" | "draw" = loser === "w" ? "loss" : loser === "b" ? "win" : "draw";
    setGameOver(true);
    await recordGame({
      courseId: INSTRUCTOR_GAME_ID,
      difficulty,
      result,
      movesSan: chess.history(),
      deviations: 0,
      playedAt: Date.now(),
    });
  }

  async function continueWithOpponentMove() {
    setThinking(true);
    const engine = engineRef.current;
    try {
      if (engine) {
        // Preferisce restare in uno schema noto quando può: altrimenti l'avversario,
        // giocando sempre e solo la mossa "oggettivamente migliore" del motore, rischia
        // di portare la partita fuori da qualunque schema riconoscibile prima ancora che
        // tu possa finire di disegnarlo.
        const legalMoves = chess.moves();
        const namedOptions = suggestKnownMoves(chess.history(), legalMoves);
        const fallbackOptions = namedOptions.length === 0 ? suggestStyleIdeas(legalMoves) : [];
        const pool = namedOptions.length > 0 ? namedOptions : fallbackOptions;
        let move;
        if (pool.length > 0) {
          const san = pool[Math.floor(Math.random() * pool.length)].san;
          move = chess.move(san);
        } else {
          const { bestMove } = await engine.getBestMove(chess.fen(), engineDepthFor(difficulty));
          move = chess.move({
            from: bestMove.slice(0, 2),
            to: bestMove.slice(2, 4),
            promotion: bestMove.slice(4, 5) || undefined,
          });
        }

        if (!move) {
          throw new Error("Mossa dell'avversario non applicabile");
        }
        setFen(chess.fen());
        updateStatusText();
        updateCommentary();
      }
    } catch (error) {
      console.error("Errore nella mossa dell'avversario:", error);
      setComment("Il motore non ha risposto correttamente. Puoi provare ad annullare l'ultima mossa o iniziare una nuova partita.");
    } finally {
      setThinking(false);
    }
    if (chess.isGameOver()) {
      await finishGameOver();
    }
  }

  function afterPlayerMove() {
    setFen(chess.fen());
    updateStatusText();
    updateCommentary();

    if (chess.isGameOver()) {
      void finishGameOver();
    } else {
      void continueWithOpponentMove();
    }
  }

  function onPieceDrop({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string;
    targetSquare: string | null;
  }): boolean {
    if (!targetSquare || !ready || gameOver || thinking || pendingPromotion) return false;

    const candidates = chess
      .moves({ square: sourceSquare as Square, verbose: true })
      .filter((m) => m.to === targetSquare);
    if (candidates.length === 0) return false;

    if (candidates[0].promotion) {
      setPendingPromotion({ from: sourceSquare as Square, to: targetSquare as Square });
      return false;
    }

    const move = chess.move({ from: sourceSquare, to: targetSquare });
    if (!move) return false;
    afterPlayerMove();
    return true;
  }

  function playSuggestedMove(san: string) {
    if (!ready || gameOver || thinking) return;
    const move = chess.move(san);
    if (!move) return;
    afterPlayerMove();
  }

  function resolvePromotion(piece: PromotionPiece) {
    if (!pendingPromotion) return;
    const move = chess.move({ from: pendingPromotion.from, to: pendingPromotion.to, promotion: piece });
    setPendingPromotion(null);
    if (!move) return;
    afterPlayerMove();
  }

  function undoLastRound() {
    if (thinking || chess.history().length === 0) return;
    const toUndo = chess.turn() === "w" ? 2 : 1;
    for (let i = 0; i < toUndo && chess.history().length > 0; i++) {
      chess.undo();
    }
    setFen(chess.fen());
    setGameOver(false);
    setPendingPromotion(null);
    setReviewResult(null);
    exitedAnnouncedRef.current = false;
    updateStatusText();
    updateCommentary();
  }

  const canSuggest = ready && !gameOver && !thinking && !pendingPromotion && chess.turn() === "w";
  const allSuggestions = canSuggest ? suggestKnownMoves(chess.history(), chess.moves()) : [];
  const allStyleIdeas = canSuggest && allSuggestions.length === 0 ? suggestStyleIdeas(chess.moves()) : [];

  const query = searchQuery.trim().toLowerCase();
  const matchesQuery = (s: { san: string; resultingName: string }) =>
    !query || s.san.toLowerCase().includes(query) || s.resultingName.toLowerCase().includes(query);
  const suggestions = allSuggestions.filter(matchesQuery);
  const styleIdeas = allStyleIdeas.filter(matchesQuery);

  const hoveredMove = hoveredSan
    ? chess.moves({ verbose: true }).find((m) => m.san === hoveredSan)
    : undefined;

  function newGame() {
    setGameKey((k) => k + 1);
    setStatus("Il tuo turno (bianco)");
    setComment("Fai la tua prima mossa: l'istruttore commenterà che apertura stai giocando.");
    setGameOver(false);
    setPendingPromotion(null);
    setHoveredSan(null);
    setReviewResult(null);
    setReviewing(false);
  }

  async function startReview() {
    const engine = engineRef.current;
    if (!engine || reviewing) return;
    setReviewing(true);
    setReviewProgress(null);
    try {
      const result = await reviewGame(chess.history(), "white", engine, (done, total) =>
        setReviewProgress({ done, total })
      );
      setReviewResult(result);
    } catch (error) {
      console.error("Errore nella revisione della partita:", error);
    } finally {
      setReviewing(false);
      setReviewProgress(null);
    }
  }

  return (
    <div className="app-shell">
      <div className="top-bar">
        <button className="nav-back" onClick={onExit}>
          ← Home
        </button>
        <h2>Partita con istruttore</h2>
      </div>

      <div className="board-layout">
        <Board
          fen={fen}
          onPieceDrop={onPieceDrop}
          orientation="white"
          arrowFrom={hoveredMove?.from}
          arrowTo={hoveredMove?.to}
        />

        <div className="side-panel">
          <div className="card explanation-card instructor-card">
            <h3>Istruttore</h3>
            <p>{comment}</p>
          </div>

          {(allSuggestions.length > 0 || allStyleIdeas.length > 0) && (
            <div className="card">
              <input
                type="text"
                className="btn"
                style={{ width: "100%", textAlign: "left" }}
                placeholder="Cerca per mossa o nome schema (es. sicilia, e4...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {allSuggestions.length > 0 && (
            <div className="card">
              <h3>Mosse verso schemi noti</h3>
              <p className="status-line">Non solo la migliore: ecco dove porta ciascuna di queste mosse.</p>
              {suggestions.length === 0 ? (
                <p className="status-line">Nessun risultato per "{searchQuery}".</p>
              ) : (
                <div className="lesson-list lesson-list--scrollable">
                  {suggestions.map((s) => (
                    <div className="lesson-row" key={s.san}>
                      <span>
                        {s.san} — {s.continuesCurrent ? "continua: " : "porta a: "}
                        {s.resultingName}
                      </span>
                      <button
                        className="btn"
                        onClick={() => playSuggestedMove(s.san)}
                        onMouseEnter={() => setHoveredSan(s.san)}
                        onMouseLeave={() => setHoveredSan(null)}
                      >
                        Gioca
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {allSuggestions.length === 0 && allStyleIdeas.length > 0 && (
            <div className="card">
              <h3>Idee di stile</h3>
              <p className="status-line">
                Da qui non c'è più una linea precisa salvata, ma queste mosse ricordano lo stile di altri schemi noti.
              </p>
              {styleIdeas.length === 0 ? (
                <p className="status-line">Nessun risultato per "{searchQuery}".</p>
              ) : (
                <div className="lesson-list lesson-list--scrollable">
                  {styleIdeas.map((s) => (
                    <div className="lesson-row" key={s.san}>
                      <span>
                        {s.san} — ricorda lo stile di: {s.resultingName}
                      </span>
                      <button
                        className="btn"
                        onClick={() => playSuggestedMove(s.san)}
                        onMouseEnter={() => setHoveredSan(s.san)}
                        onMouseLeave={() => setHoveredSan(null)}
                      >
                        Gioca
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="card">
            <p className="status-line">{status}</p>
            <p className="meta">Livello {difficulty}/20</p>
            <div className="btn-row">
              <button className="btn" onClick={undoLastRound} disabled={thinking || chess.history().length === 0}>
                Annulla ultima mossa
              </button>
              <button className="btn" onClick={newGame}>
                Nuova partita
              </button>
            </div>
          </div>

          {pendingPromotion && (
            <PromotionPicker onChoose={resolvePromotion} onCancel={() => setPendingPromotion(null)} />
          )}

          {gameOver && !reviewResult && (
            <div className="card explanation-card">
              <h3>Partita finita</h3>
              <p>Puoi iniziarne un'altra quando vuoi, anche con un'apertura diversa.</p>
              <div className="btn-row">
                <button className="btn btn-primary" onClick={startReview} disabled={reviewing}>
                  {reviewing
                    ? reviewProgress
                      ? `Analisi in corso… (${reviewProgress.done}/${reviewProgress.total})`
                      : "Analisi in corso…"
                    : "Rivedi la partita"}
                </button>
              </div>
            </div>
          )}

          {reviewResult && <GameReviewPanel result={reviewResult} />}

          <div className="card">
            <h3>Mosse</h3>
            <MoveList moves={chess.history()} />
          </div>
        </div>
      </div>
    </div>
  );
}
