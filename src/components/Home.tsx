import { useEffect, useState } from "react";
import { courses } from "../data/courses";
import {
  getCourseProgress,
  getDifficulty,
  getRecentGames,
  setDifficulty,
  type CourseProgress,
  type GameRecord,
} from "../db/db";
import { eloFor } from "../engine/stockfish";

function difficultyLabel(level: number): string {
  if (level <= 5) return "Principiante";
  if (level <= 10) return "Intermedio";
  if (level <= 15) return "Avanzato";
  return "Esperto";
}

type Props = {
  onStartLesson: (courseId: string, lessonIndex: number) => void;
  onStartPractice: (courseId: string) => void;
  onStartInstructor: () => void;
  onStartPuzzles: () => void;
};

export function Home({ onStartLesson, onStartPractice, onStartInstructor, onStartPuzzles }: Props) {
  const [difficulty, setDifficultyState] = useState(5);
  const [progress, setProgress] = useState<Record<string, CourseProgress>>({});
  const [games, setGames] = useState<Record<string, GameRecord[]>>({});

  useEffect(() => {
    getDifficulty().then(setDifficultyState);
    Promise.all(courses.map((course) => getCourseProgress(course.id))).then((results) => {
      const map: Record<string, CourseProgress> = {};
      results.forEach((result) => {
        map[result.courseId] = result;
      });
      setProgress(map);
    });
    Promise.all(courses.map((course) => getRecentGames(course.id, 5))).then((results) => {
      const map: Record<string, GameRecord[]> = {};
      courses.forEach((course, index) => {
        map[course.id] = results[index];
      });
      setGames(map);
    });
  }, []);

  async function handleDifficultyChange(value: number) {
    setDifficultyState(value);
    await setDifficulty(value);
  }

  return (
    <div className="app-shell">
      <div className="top-bar">
        <div className="brand">
          <span className="pawn">♟</span>
          <h1>Chess Trainer</h1>
        </div>
      </div>

      <div className="card course-card">
        <h2>Partita con istruttore</h2>
        <p>
          Gioca liberamente con qualsiasi apertura (sei sempre il Bianco): a ogni mossa, tua e dell'avversario,
          l'istruttore ti dice che schema di gioco si sta formando sulla scacchiera, dalle aperture più famose (Bird,
          Larsen, Italiana, Siciliana...) fino ai corsi approfonditi qui sotto.
        </p>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={onStartInstructor}>
            Inizia
          </button>
        </div>
      </div>

      <div className="card course-card">
        <h2>Problemi</h2>
        <p>
          Migliaia di puzzle tattici reali (dal database di Lichess): risolvi ogni posizione trovando l'unica mossa
          corretta. Se sbagli, l'istruttore ti spiega perché e puoi riprovare finché non trovi la soluzione giusta.
        </p>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={onStartPuzzles}>
            Inizia
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Livello avversario</h2>
        <div className="difficulty-row">
          <input
            type="range"
            min={0}
            max={20}
            value={difficulty}
            onChange={(e) => handleDifficultyChange(Number(e.target.value))}
          />
          <span className="difficulty-label">
            {difficultyLabel(difficulty)} ({difficulty}/20{difficulty < 20 ? ` · ~${eloFor(difficulty)} Elo` : ""})
          </span>
        </div>
        <p className="status-line">
          L'avversario resta nelle risposte più comuni per questo livello durante l'apertura, poi gioca con il motore
          regolato sulla stessa forza.
        </p>
      </div>

      {courses.map((course) => {
        const courseProgress = progress[course.id];
        const lessonsDone = (courseProgress?.lastLessonCompleted ?? -1) + 1;
        const pct = Math.round((lessonsDone / course.lessons.length) * 100);
        return (
          <div className="card course-card" key={course.id}>
            <span className="pattern-tag">
              giochi con il {course.playerColor === "white" ? "Bianco" : "Nero"}
            </span>
            <h2>{course.name}</h2>
            <p>{course.description}</p>
            <div className="progress-bar">
              <span style={{ width: `${pct}%` }} />
            </div>
            <p className="meta">
              {lessonsDone}/{course.lessons.length} lezioni completate
            </p>

            <div className="lesson-list">
              {course.lessons.map((lesson, index) => {
                const done = index <= (courseProgress?.lastLessonCompleted ?? -1);
                const locked = index > lessonsDone;
                return (
                  <div className={`lesson-row ${done ? "completed" : ""}`} key={lesson.title}>
                    <span>
                      {index + 1}. {lesson.title}
                    </span>
                    <button
                      className="btn"
                      disabled={locked}
                      onClick={() => onStartLesson(course.id, index)}
                    >
                      {done ? "Ripeti" : "Inizia"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="btn-row">
              <button className="btn btn-primary" onClick={() => onStartPractice(course.id)}>
                Partita libera contro l'IA
              </button>
            </div>

            {(games[course.id]?.length ?? 0) > 0 && (
              <div className="history-list">
                {games[course.id].map((game) => (
                  <div className="game-row" key={game.id}>
                    <span className={`result-${game.result}`}>
                      {game.result === "win" ? "Vittoria" : game.result === "loss" ? "Sconfitta" : "Patta"}
                    </span>
                    <span>{new Date(game.playedAt).toLocaleDateString()}</span>
                    <span>{game.deviations} deviazioni</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
