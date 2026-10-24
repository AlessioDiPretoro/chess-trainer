import Dexie, { type EntityTable } from "dexie";

export type AppSettings = {
  id: "app";
  /** Livello di difficoltà dell'avversario, 0-20 (mappato sulla Skill Level di Stockfish). */
  difficulty: number;
  /** Se true, i commenti dell'istruttore vengono letti ad alta voce. */
  voiceEnabled?: boolean;
};

export type CourseProgress = {
  courseId: string;
  /** Indice (0-based) dell'ultima mini-lezione completata, -1 se nessuna. */
  lastLessonCompleted: number;
};

export type GameRecord = {
  id?: number;
  courseId: string;
  difficulty: number;
  result: "win" | "loss" | "draw";
  movesSan: string[];
  deviations: number;
  playedAt: number;
};

export type PuzzleProgress = {
  puzzleId: string;
  solvedAt: number;
};

class ChessTrainerDB extends Dexie {
  settings!: EntityTable<AppSettings, "id">;
  courseProgress!: EntityTable<CourseProgress, "courseId">;
  games!: EntityTable<GameRecord, "id">;
  puzzleProgress!: EntityTable<PuzzleProgress, "puzzleId">;

  constructor() {
    super("chess-trainer");
    this.version(1).stores({
      settings: "id",
      courseProgress: "courseId",
      games: "++id, courseId, playedAt",
    });
    this.version(2).stores({
      puzzleProgress: "puzzleId",
    });
  }
}

export const db = new ChessTrainerDB();

export async function getDifficulty(): Promise<number> {
  const settings = await db.settings.get("app");
  return settings?.difficulty ?? 5;
}

export async function setDifficulty(difficulty: number): Promise<void> {
  await db.settings.put({ id: "app", difficulty });
}

export async function getVoiceEnabled(): Promise<boolean> {
  const settings = await db.settings.get("app");
  return settings?.voiceEnabled ?? false;
}

export async function setVoiceEnabled(voiceEnabled: boolean): Promise<void> {
  const current = await db.settings.get("app");
  await db.settings.put({ id: "app", difficulty: current?.difficulty ?? 5, voiceEnabled });
}

export async function getCourseProgress(courseId: string): Promise<CourseProgress> {
  const progress = await db.courseProgress.get(courseId);
  return progress ?? { courseId, lastLessonCompleted: -1 };
}

export async function markLessonCompleted(courseId: string, lessonIndex: number): Promise<void> {
  const current = await getCourseProgress(courseId);
  if (lessonIndex > current.lastLessonCompleted) {
    await db.courseProgress.put({ courseId, lastLessonCompleted: lessonIndex });
  }
}

export async function recordGame(record: Omit<GameRecord, "id">): Promise<void> {
  await db.games.add(record as GameRecord);
}

export async function getRecentGames(courseId: string, limit = 10): Promise<GameRecord[]> {
  const rows = await db.games.where("courseId").equals(courseId).sortBy("playedAt");
  return rows.reverse().slice(0, limit);
}

export async function markPuzzleSolved(puzzleId: string): Promise<void> {
  await db.puzzleProgress.put({ puzzleId, solvedAt: Date.now() });
}

export async function getSolvedPuzzleIds(): Promise<Set<string>> {
  const rows = await db.puzzleProgress.toArray();
  return new Set(rows.map((r) => r.puzzleId));
}

export async function getSolvedPuzzleCount(): Promise<number> {
  return db.puzzleProgress.count();
}
