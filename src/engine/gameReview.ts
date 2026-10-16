import { Chess, type Square } from "chess.js";
import { lookupOpeningName } from "../data/openingNames";
import type { GameReviewResult, MoveQuality, MoveReview, TurningPoint } from "../types/gameReview";
import type { StockfishEngine } from "./stockfish";

const MATE_SCORE = 100000;
const REVIEW_DEPTH = 14;

function signedScore(scoreCp: number | undefined, scoreMate: number | undefined): number {
  if (scoreMate !== undefined) return scoreMate > 0 ? MATE_SCORE : -MATE_SCORE;
  return scoreCp ?? 0;
}

function classify(centipawnLoss: number): MoveQuality {
  if (centipawnLoss <= 10) return "best";
  if (centipawnLoss <= 50) return "good";
  if (centipawnLoss <= 100) return "inaccuracy";
  if (centipawnLoss <= 250) return "mistake";
  return "blunder";
}

function uciToSan(chess: Chess, uci: string): string | null {
  const from = uci.slice(0, 2) as Square;
  const to = uci.slice(2, 4) as Square;
  const promotion = uci.slice(4, 5) || undefined;
  const match = chess
    .moves({ verbose: true })
    .find((m) => m.from === from && m.to === to && (!promotion || m.promotion === promotion));
  return match?.san ?? null;
}

function accuracyLabel(acpl: number): string {
  if (acpl <= 20) return "Eccellente";
  if (acpl <= 50) return "Buona";
  if (acpl <= 100) return "Discreta";
  if (acpl <= 200) return "Da migliorare";
  return "Partita difficile";
}

/**
 * Rigioca l'intera partita e, per ogni mossa, calcola quanto ha perso rispetto alla
 * mossa migliore in quella posizione (stessa metodologia già usata dal vivo in
 * `applyPlannedMove`/`reviewPlanMove`, qui applicata a tutta la partita). Ogni
 * posizione viene valutata una sola volta sola e riusata sia come "dopo" della
 * mossa precedente sia come "prima" di quella successiva, per dimezzare il numero
 * di chiamate al motore necessarie.
 */
export async function reviewGame(
  movesSan: string[],
  playerColor: "white" | "black",
  engine: StockfishEngine,
  onProgress?: (done: number, total: number) => void
): Promise<GameReviewResult> {
  const chess = new Chess();
  const depth = REVIEW_DEPTH;

  const positions: { scoreCp?: number; scoreMate?: number; bestMove: string }[] = [];
  positions.push(await engine.analyze(chess.fen(), depth));
  for (const san of movesSan) {
    chess.move(san);
    positions.push(await engine.analyze(chess.fen(), depth));
    onProgress?.(positions.length - 1, movesSan.length);
  }

  const replay = new Chess();
  const moves: MoveReview[] = [];

  for (let i = 0; i < movesSan.length; i++) {
    const san = movesSan[i];
    const before = positions[i];
    const after = positions[i + 1];
    const bestEval = signedScore(before.scoreCp, before.scoreMate);
    const ownEval = -signedScore(after.scoreCp, after.scoreMate);
    const centipawnLoss = Math.max(0, Math.round(bestEval - ownEval));

    const bestMoveUci = before.bestMove;
    const bestMoveSan = bestMoveUci ? uciToSan(replay, bestMoveUci) : null;

    moves.push({
      moveNumber: Math.floor(i / 2) + 1,
      color: i % 2 === 0 ? "white" : "black",
      san,
      quality: classify(centipawnLoss),
      centipawnLoss,
      bestMoveSan: bestMoveSan && bestMoveSan !== san ? bestMoveSan : null,
    });

    replay.move(san);
  }

  const playerMoves = moves.filter((m) => m.color === playerColor);
  const playerAverageCentipawnLoss = playerMoves.length
    ? Math.round(playerMoves.reduce((sum, m) => sum + m.centipawnLoss, 0) / playerMoves.length)
    : 0;

  const turningPoints: TurningPoint[] = [...moves]
    .map((m, index) => ({ m, index }))
    .filter(({ m }) => m.centipawnLoss >= 150)
    .sort((a, b) => b.m.centipawnLoss - a.m.centipawnLoss)
    .slice(0, 3)
    .sort((a, b) => a.index - b.index)
    .map(({ m, index }) => ({
      moveIndex: index,
      description: `Mossa ${m.moveNumber}${m.color === "white" ? "." : "..."} ${m.san}: valutazione peggiorata di circa ${(m.centipawnLoss / 100).toFixed(1)} pedoni${m.bestMoveSan ? ` (meglio ${m.bestMoveSan})` : ""}.`,
    }));

  let openingName: string | null = null;
  for (let i = 1; i <= movesSan.length; i++) {
    const match = lookupOpeningName(movesSan.slice(0, i));
    if (match) openingName = match.name;
  }

  return {
    moves,
    openingName,
    playerAverageCentipawnLoss,
    playerAccuracyLabel: accuracyLabel(playerAverageCentipawnLoss),
    turningPoints,
  };
}
