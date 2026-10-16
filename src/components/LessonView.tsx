import { Chess } from "chess.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { getDifficulty, markLessonCompleted } from "../db/db";
import { playScriptedOpponentMove } from "../engine/opponent";
import { applyPlannedMove } from "../engine/planSafety";
import { StockfishEngine } from "../engine/stockfish";
import type { Course } from "../types/course";
import { Board } from "./Board";
import { MoveList } from "./MoveList";

type Props = {
  course: Course;
  lessonIndex: number;
  onExit: () => void;
  onNextLesson: () => void;
};

export function LessonView({ course, lessonIndex, onExit, onNextLesson }: Props) {
  const lesson = course.lessons[lessonIndex];
  // eslint-disable-next-line react-hooks/exhaustive-deps -- lessonIndex intentionally forces a fresh Chess() per lesson
  const chess = useMemo(() => new Chess(), [lessonIndex]);
  const engineRef = useRef<StockfishEngine | null>(null);

  const [fen, setFen] = useState(chess.fen());
  const [pointer, setPointer] = useState(0);
  const [ready, setReady] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loadError, setLoadError] = useState("");

  const playerTurnLetter = course.playerColor === "white" ? "w" : "b";

  useEffect(() => {
    const engine = new StockfishEngine();
    engineRef.current = engine;
    let cancelled = false;

    setReady(false);
    setCompleted(false);
    setPointer(0);
    setFeedback("");
    setLoadError("");

    async function playOpponentIfNeeded() {
      if (chess.turn() !== playerTurnLetter && !chess.isGameOver()) {
        await playScriptedOpponentMove(chess, course.book, engine);
      }
    }

    (async () => {
      try {
        const difficulty = await getDifficulty();
        await playOpponentIfNeeded();
        const catchUpUntil = lesson.stepIndices[0];
        for (let i = 0; i < catchUpUntil && !chess.isGameOver(); i++) {
          await applyPlannedMove(chess, course.plan[i].san, engine, difficulty);
          await playOpponentIfNeeded();
        }
      } catch (error) {
        console.error("Errore nel ricostruire la posizione della lezione:", error);
        if (!cancelled) {
          setLoadError(
            "Non è stato possibile ricostruire perfettamente la posizione di questa lezione. Puoi continuare da dove si è fermata la partita, oppure tornare alla home e riprovare."
          );
        }
      } finally {
        if (!cancelled) {
          setFen(chess.fen());
          setReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
      engine.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonIndex]);

  const stepPlanIndex = lesson.stepIndices[pointer];
  const currentStep = course.plan[stepPlanIndex];
  const isLastStep = pointer === lesson.stepIndices.length - 1;

  const verboseMoves = ready ? chess.moves({ verbose: true }) : [];
  const target = verboseMoves.find((m) => m.san === currentStep?.san);

  const idea = currentStep?.patternTag
    ? course.tacticalIdeas.find((t) => t.patternTag === currentStep.patternTag)
    : undefined;

  async function advanceAfterCorrectMove() {
    setFeedback("");
    setFen(chess.fen());

    if (isLastStep) {
      await markLessonCompleted(course.id, lessonIndex);
      setCompleted(true);
      return;
    }

    setPointer((p) => p + 1);
    const engine = engineRef.current;
    if (engine && chess.turn() !== playerTurnLetter && !chess.isGameOver()) {
      try {
        await playScriptedOpponentMove(chess, course.book, engine);
        setFen(chess.fen());
      } catch (error) {
        console.error("Errore nella mossa dell'avversario:", error);
        setLoadError("Il motore non ha risposto correttamente. Puoi continuare o tornare alla home e riprovare.");
      }
    }
  }

  function onPieceDrop({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string;
    targetSquare: string | null;
  }): boolean {
    if (!targetSquare || !ready || completed) return false;
    let move;
    try {
      move = chess.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    } catch {
      return false;
    }
    if (!move) return false;

    if (move.san !== currentStep.san) {
      chess.undo();
      setFeedback("Non è la mossa del piano. Riprova, oppure guarda il suggerimento sulla scacchiera.");
      return false;
    }

    void advanceAfterCorrectMove();
    return true;
  }

  function showHint() {
    if (!ready || completed) return;
    if (!chess.moves().includes(currentStep.san)) {
      setFeedback(
        "La mossa prevista dal piano non è più disponibile in questa posizione (la partita si è allontanata dalla linea principale). Torna alla home e riprova, oppure prosegui liberamente nella partita libera."
      );
      return;
    }
    const move = chess.move(currentStep.san);
    if (!move) return;
    void advanceAfterCorrectMove();
  }

  return (
    <div className="app-shell">
      <div className="top-bar">
        <button className="nav-back" onClick={onExit}>
          ← Home
        </button>
        <h2>
          {course.name} · {lesson.title}
        </h2>
      </div>

      <div className="board-layout">
        <Board
          fen={fen}
          onPieceDrop={onPieceDrop}
          orientation={course.playerColor}
          arrowFrom={target?.from}
          arrowTo={target?.to}
        />

        <div className="side-panel">
          {!completed && currentStep && (
            <div className="card explanation-card">
              {currentStep.patternTag && <span className="pattern-tag">tema: {currentStep.patternTag}</span>}
              <h3>
                Mossa consigliata: {currentStep.san} (step {pointer + 1}/{lesson.stepIndices.length})
              </h3>
              <p>{currentStep.explanation}</p>
              {feedback && <p className="status-line">{feedback}</p>}
              <div className="btn-row">
                <button className="btn" onClick={showHint}>
                  Mostra la mossa
                </button>
              </div>
            </div>
          )}

          {idea && (
            <div className="card tactical-idea">
              <h3>{idea.title}</h3>
              <p>{idea.description}</p>
            </div>
          )}

          {completed && (
            <div className="card explanation-card">
              <h3>Lezione completata!</h3>
              <p>Hai seguito tutto il piano di questa lezione. Continua con la prossima o torna alla home.</p>
              <div className="btn-row">
                <button className="btn btn-primary" onClick={onNextLesson}>
                  Prossima lezione
                </button>
                <button className="btn" onClick={onExit}>
                  Torna alla home
                </button>
              </div>
            </div>
          )}

          {!ready && <p className="status-line">Preparazione della posizione…</p>}

          {loadError && (
            <div className="card deviation-banner">
              <p>{loadError}</p>
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
