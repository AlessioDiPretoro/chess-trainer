import { Chess, type Square } from "chess.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { getDifficulty, getVoiceEnabled, recordGame, setVoiceEnabled } from "../db/db";
import { countDeviations, playerStartIndex } from "../engine/deviations";
import { describeGameEnd, type GameEndInfo } from "../engine/gameEnd";
import { reviewGame } from "../engine/gameReview";
import { buildMoveComment } from "../engine/moveExplanation";
import { playOpponentMove } from "../engine/opponent";
import { speakText, stopSpeaking } from "../engine/speech";
import { playGameEndSound } from "../engine/sound";
import { engineDepthFor, StockfishEngine } from "../engine/stockfish";
import type { Course } from "../types/course";
import type { GameReviewResult } from "../types/gameReview";
import { Board } from "./Board";
import { BoardControls } from "./BoardControls";
import { GameEndBanner } from "./GameEndBanner";
import { GameReviewPanel } from "./GameReviewPanel";
import { MoveList } from "./MoveList";
import { PromotionPicker, type PromotionPiece } from "./PromotionPicker";

type Props = {
  course: Course;
  onExit: () => void;
};

type Banner = { kind: "good" | "warn"; text: string } | null;
type PendingPromotion = { from: Square; to: Square } | null;

const EVAL_DROP_THRESHOLD_CP = 60;

function yourTurnLabel(color: "white" | "black"): string {
  return `Il tuo turno (${color === "white" ? "bianco" : "nero"})`;
}

export function PracticeView({ course, onExit }: Props) {
  const playerLetter = course.playerColor === "white" ? "w" : "b";

  const [gameKey, setGameKey] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- gameKey intentionally forces a fresh Chess() on "new game"
  const chess = useMemo(() => new Chess(), [gameKey]);
  const engineRef = useRef<StockfishEngine | null>(null);

  const [fen, setFen] = useState(chess.fen());
  const [status, setStatus] = useState(yourTurnLabel(course.playerColor));
  const [banner, setBanner] = useState<Banner>(null);
  const [deviations, setDeviations] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [endInfo, setEndInfo] = useState<GameEndInfo | null>(null);
  const [difficulty, setDifficultyState] = useState(5);
  const [thinking, setThinking] = useState(false);
  const [ready, setReady] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion>(null);
  const [reviewResult, setReviewResult] = useState<GameReviewResult | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [reviewProgress, setReviewProgress] = useState<{ done: number; total: number } | null>(null);
  const [redoStack, setRedoStack] = useState<string[][]>([]);
  const [reviewMoveIndex, setReviewMoveIndex] = useState(-1);
  const [hint, setHint] = useState<{ san: string; comment: string; from: string; to: string } | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabledState] = useState(false);

  useEffect(() => {
    getVoiceEnabled().then(setVoiceEnabledState);
    return () => stopSpeaking();
  }, []);

  function toggleVoice() {
    setVoiceEnabledState((enabled) => {
      const next = !enabled;
      void setVoiceEnabled(next);
      if (!next) stopSpeaking();
      return next;
    });
  }

  function updateStatusText() {
    if (chess.isCheckmate()) {
      setStatus(chess.turn() === playerLetter ? "Scacco matto: hai perso" : "Scacco matto: hai vinto!");
    } else if (chess.isDraw()) {
      setStatus("Patta");
    } else if (chess.isCheck()) {
      setStatus(chess.turn() === playerLetter ? "Sei sotto scacco" : "Hai dato scacco");
    } else {
      setStatus(chess.turn() === playerLetter ? yourTurnLabel(course.playerColor) : "L'avversario sta pensando…");
    }
  }

  useEffect(() => {
    const engine = new StockfishEngine();
    engineRef.current = engine;
    setReady(false);

    (async () => {
      try {
        const level = await getDifficulty();
        setDifficultyState(level);
        if (chess.turn() !== playerLetter && !chess.isGameOver()) {
          await playOpponentMove(chess, course.book, level, engine);
          setFen(chess.fen());
          updateStatusText();
        }
      } catch (error) {
        console.error("Errore nell'avvio della partita:", error);
        setBanner({ kind: "warn", text: "Il motore non si è avviato correttamente. Prova a iniziare una nuova partita." });
      }
      setReady(true);
    })();

    return () => engine.terminate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameKey]);

  function refreshDeviations() {
    setDeviations(countDeviations(chess.history(), course.plan, course.playerColor));
  }

  async function finishGameOver() {
    const info = describeGameEnd(chess, playerLetter);
    setGameOver(true);
    setEndInfo(info);
    playGameEndSound(info.outcome);
    await recordGame({
      courseId: course.id,
      difficulty,
      result: info.outcome,
      movesSan: chess.history(),
      deviations: countDeviations(chess.history(), course.plan, course.playerColor),
      playedAt: Date.now(),
    });
  }

  async function continueWithOpponentMove() {
    setThinking(true);
    const engine = engineRef.current;
    try {
      if (engine) {
        await playOpponentMove(chess, course.book, difficulty, engine);
        setFen(chess.fen());
        updateStatusText();
      }
    } catch (error) {
      console.error("Errore nella mossa dell'avversario:", error);
      setBanner({ kind: "warn", text: "Il motore non ha risposto correttamente. Puoi provare ad annullare l'ultima mossa o iniziare una nuova partita." });
    } finally {
      setThinking(false);
    }
    if (chess.isGameOver()) {
      await finishGameOver();
    }
  }

  /**
   * Valuta quanto ha perso (in centipawn, dal punto di vista del giocatore) la mossa
   * appena giocata rispetto alla miglior mossa disponibile nella posizione precedente.
   * Restituisce null se il motore non ha una valutazione numerica utilizzabile (es. matto).
   */
  async function evalDrop(fenBeforeMove: string, fenAfterMove: string): Promise<number | null> {
    const engine = engineRef.current;
    if (!engine) return null;
    const depth = engineDepthFor(difficulty);
    const before = await engine.analyze(fenBeforeMove, depth);
    const after = await engine.analyze(fenAfterMove, depth);
    const sign = playerLetter === "w" ? 1 : -1;
    const evalBeforePlayer = before.scoreMate !== undefined ? undefined : before.scoreCp !== undefined ? sign * before.scoreCp : undefined;
    const evalAfterPlayer = after.scoreMate !== undefined ? undefined : after.scoreCp !== undefined ? -sign * after.scoreCp : undefined;
    if (evalBeforePlayer === undefined || evalAfterPlayer === undefined) return null;
    return evalBeforePlayer - evalAfterPlayer;
  }

  async function reviewDeviation(
    fenBeforeMove: string,
    fenAfterMove: string,
    playedSan: string,
    recommendedSan: string,
    recommendedExplanation: string
  ) {
    const drop = await evalDrop(fenBeforeMove, fenAfterMove);
    if (drop !== null && drop > EVAL_DROP_THRESHOLD_CP) {
      setBanner({
        kind: "warn",
        text: `Hai giocato ${playedSan} invece di ${recommendedSan} (idea: ${recommendedExplanation}). La valutazione è peggiorata di circa ${(drop / 100).toFixed(1)} pedoni: una mossa più precisa c'era.`,
      });
      return;
    }
    setBanner({
      kind: "good",
      text: `Hai deviato dal piano (${playedSan} invece di ${recommendedSan}), ma la posizione resta a posto. L'idea del piano era: ${recommendedExplanation}`,
    });
  }

  async function reviewPlanMove(fenBeforeMove: string, fenAfterMove: string, playedSan: string, explanation: string) {
    const drop = await evalDrop(fenBeforeMove, fenAfterMove);
    if (drop !== null && drop > EVAL_DROP_THRESHOLD_CP) {
      setBanner({
        kind: "warn",
        text: `Hai giocato la mossa standard del piano (${playedSan}), ma in questa posizione specifica non era la scelta migliore — probabilmente perché l'avversario si è allontanato dalla teoria. La valutazione è peggiorata di circa ${(drop / 100).toFixed(1)} pedoni.`,
      });
      return;
    }
    setBanner({ kind: "good", text: `✓ Hai seguito il piano: ${explanation}` });
  }

  function afterPlayerMove(move: { san: string }, fenBeforeMove: string) {
    // catturata subito: se la risposta dell'avversario arriva dal libro (sincrona), può
    // mutare `chess` prima che la valutazione "prima/dopo" sia completata, quindi non va
    // letta più tardi con chess.fen() ma passata esplicitamente qui.
    const fenAfterMove = chess.fen();
    setFen(fenAfterMove);
    updateStatusText();
    setBanner(null);
    setRedoStack([]);
    setHint(null);
    refreshDeviations();

    const start = playerStartIndex(course.playerColor);
    const planIndex = Math.floor((chess.history().length - 1 - start) / 2);
    const planStep = planIndex >= 0 && planIndex < course.plan.length ? course.plan[planIndex] : undefined;

    if (planStep && planStep.san !== move.san) {
      void reviewDeviation(fenBeforeMove, fenAfterMove, move.san, planStep.san, planStep.explanation);
    } else if (planStep) {
      void reviewPlanMove(fenBeforeMove, fenAfterMove, move.san, planStep.explanation);
    }

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

    const fenBeforeMove = chess.fen();
    const move = chess.move({ from: sourceSquare, to: targetSquare });
    if (!move) return false;
    afterPlayerMove(move, fenBeforeMove);
    return true;
  }

  function resolvePromotion(piece: PromotionPiece) {
    if (!pendingPromotion) return;
    const fenBeforeMove = chess.fen();
    const move = chess.move({ from: pendingPromotion.from, to: pendingPromotion.to, promotion: piece });
    setPendingPromotion(null);
    if (!move) return;
    afterPlayerMove(move, fenBeforeMove);
  }

  function undoLastRound() {
    if (thinking || chess.history().length === 0) return;
    const toUndo = chess.turn() === playerLetter ? 2 : 1;
    const undone: string[] = [];
    for (let i = 0; i < toUndo && chess.history().length > 0; i++) {
      const move = chess.undo();
      if (move) undone.unshift(move.san);
    }
    if (undone.length > 0) {
      setRedoStack((stack) => [...stack, undone]);
    }
    setFen(chess.fen());
    setGameOver(false);
    setEndInfo(null);
    setBanner(null);
    setPendingPromotion(null);
    setReviewResult(null);
    setReviewMoveIndex(-1);
    setHint(null);
    refreshDeviations();
    updateStatusText();
  }

  function redoLastRound() {
    if (thinking || redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    for (const san of next) {
      chess.move(san);
    }
    setRedoStack((stack) => stack.slice(0, -1));
    setFen(chess.fen());
    setBanner(null);
    setHint(null);
    refreshDeviations();
    updateStatusText();
    if (chess.isGameOver()) {
      setGameOver(true);
      setEndInfo(describeGameEnd(chess, playerLetter));
    }
  }

  function newGame() {
    setGameKey((k) => k + 1);
    setStatus(yourTurnLabel(course.playerColor));
    setBanner(null);
    setDeviations(0);
    setGameOver(false);
    setEndInfo(null);
    setPendingPromotion(null);
    setReviewResult(null);
    setReviewMoveIndex(-1);
    setReviewing(false);
    setRedoStack([]);
    setHint(null);
  }

  async function showHint() {
    const engine = engineRef.current;
    if (!engine || !ready || gameOver || thinking || pendingPromotion || hintLoading) return;
    setHintLoading(true);
    try {
      const fenBeforeMove = chess.fen();
      const moverColor = chess.turn();
      const { bestMove } = await engine.getBestMove(fenBeforeMove, engineDepthFor(difficulty));
      const clone = new Chess(fenBeforeMove);
      const applied = clone.move({
        from: bestMove.slice(0, 2),
        to: bestMove.slice(2, 4),
        promotion: bestMove.slice(4, 5) || undefined,
      });
      if (!applied) return;
      const comment = buildMoveComment({
        fenBeforeMove,
        fenAfterMove: clone.fen(),
        moveSan: applied.san,
        moveFrom: applied.from,
        moveTo: applied.to,
        movePiece: applied.piece,
        moveCaptured: applied.captured,
        moverColor,
        quality: "best",
        centipawnLoss: 0,
        bestMoveSan: null,
      });
      setHint({ san: applied.san, comment, from: applied.from, to: applied.to });
    } catch (error) {
      console.error("Errore nel calcolo del suggerimento:", error);
    } finally {
      setHintLoading(false);
    }
  }

  async function startReview() {
    const engine = engineRef.current;
    if (!engine || reviewing) return;
    setReviewing(true);
    setReviewProgress(null);
    try {
      const result = await reviewGame(chess.history(), course.playerColor, engine, (done, total) =>
        setReviewProgress({ done, total })
      );
      setReviewResult(result);
      setReviewMoveIndex(result.moves.length - 1);
    } catch (error) {
      console.error("Errore nella revisione della partita:", error);
    } finally {
      setReviewing(false);
      setReviewProgress(null);
    }
  }

  const lastMoveHistory = chess.history({ verbose: true });
  const lastMove = lastMoveHistory[lastMoveHistory.length - 1];

  const inReview = reviewResult !== null;
  const reviewMove = inReview && reviewMoveIndex >= 0 ? reviewResult.moves[reviewMoveIndex] : null;
  const boardFen = inReview ? (reviewMove ? reviewMove.fenAfter : reviewResult.initialFen) : fen;

  useEffect(() => {
    if (voiceEnabled && !inReview && banner) speakText(banner.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banner, voiceEnabled, inReview]);

  useEffect(() => {
    if (voiceEnabled && inReview && reviewMove) speakText(reviewMove.comment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewMove, voiceEnabled, inReview]);

  return (
    <div className="app-shell">
      <div className="top-bar">
        <button className="nav-back" onClick={onExit}>
          ← Home
        </button>
        <h2>{course.name} · Partita libera</h2>
      </div>

      <div className="board-layout">
        <div className="board-column">
          {gameOver && !reviewResult && endInfo && <GameEndBanner endInfo={endInfo} />}
          <Board
            fen={boardFen}
            onPieceDrop={onPieceDrop}
            orientation={course.playerColor}
            arrowFrom={!inReview ? hint?.from : undefined}
            arrowTo={!inReview ? hint?.to : undefined}
            lastMoveFrom={reviewMove ? reviewMove.from : lastMove?.from}
            lastMoveTo={reviewMove ? reviewMove.to : lastMove?.to}
          />
          <BoardControls
            onUndo={inReview ? () => setReviewMoveIndex((i) => Math.max(-1, i - 1)) : undoLastRound}
            onRedo={inReview ? () => setReviewMoveIndex((i) => Math.min(reviewResult.moves.length - 1, i + 1)) : redoLastRound}
            canUndo={inReview ? reviewMoveIndex > -1 : !thinking && chess.history().length > 0}
            canRedo={inReview ? reviewMoveIndex < reviewResult.moves.length - 1 : !thinking && redoStack.length > 0}
            onRematch={newGame}
            onExit={onExit}
            onHint={inReview ? undefined : showHint}
            hintDisabled={!ready || gameOver || thinking || !!pendingPromotion || hintLoading}
            onToggleVoice={toggleVoice}
            voiceEnabled={voiceEnabled}
          />
        </div>

        <div className="side-panel">
          {!inReview && (
            <div className="card">
              <p className="status-line">{status}</p>
              <p className="meta">
                Livello {difficulty}/20 · {deviations} deviazion{deviations === 1 ? "e" : "i"} dal piano
              </p>
            </div>
          )}

          {pendingPromotion && (
            <PromotionPicker onChoose={resolvePromotion} onCancel={() => setPendingPromotion(null)} />
          )}

          {hintLoading && <p className="status-line">Calcolo il suggerimento…</p>}

          {hint && !inReview && (
            <div className="card tactical-idea">
              <h3>Suggerimento: {hint.san}</h3>
              <p>{hint.comment}</p>
            </div>
          )}

          {banner && !inReview && (
            <div className={`card deviation-banner ${banner.kind === "good" ? "good" : ""}`}>
              <p>{banner.text}</p>
            </div>
          )}

          {gameOver && !reviewResult && (
            <div className="card explanation-card">
              <h3>Partita finita</h3>
              <p>Risultato salvato nello storico. Puoi iniziarne un'altra quando vuoi.</p>
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

          {reviewResult && (
            <GameReviewPanel result={reviewResult} currentIndex={reviewMoveIndex} onSelectIndex={setReviewMoveIndex} />
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
