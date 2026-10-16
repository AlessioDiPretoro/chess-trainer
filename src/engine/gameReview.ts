import { Chess } from "chess.js";
import { lookupOpeningName } from "../data/openingNames";
import type { GameReviewResult, MoveReview, TurningPoint } from "../types/gameReview";
import { buildMoveComment, classifyQuality, signedScore, uciToVerboseMove } from "./moveExplanation";
import type { StockfishEngine } from "./stockfish";

const REVIEW_DEPTH = 14;

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
  const initialFen = chess.fen();

  const positions: { fen: string; scoreCp?: number; scoreMate?: number; bestMove: string }[] = [];
  positions.push({ fen: chess.fen(), ...(await engine.analyze(chess.fen(), depth)) });
  for (const san of movesSan) {
    chess.move(san);
    positions.push({ fen: chess.fen(), ...(await engine.analyze(chess.fen(), depth)) });
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
    const quality = classifyQuality(centipawnLoss);

    const bestMoveSan = before.bestMove ? uciToVerboseMove(replay, before.bestMove)?.san ?? null : null;

    const fenBeforeMove = replay.fen();
    const moverColor = replay.turn();
    const playedMove = replay.move(san);

    const comment = buildMoveComment({
      fenBeforeMove,
      fenAfterMove: after.fen,
      moveSan: san,
      moveFrom: playedMove.from,
      moveTo: playedMove.to,
      movePiece: playedMove.piece,
      moveCaptured: playedMove.captured,
      moverColor,
      quality,
      centipawnLoss,
      bestMoveSan: bestMoveSan && bestMoveSan !== san ? bestMoveSan : null,
      opponentBestMoveUci: after.bestMove,
    });

    moves.push({
      moveNumber: Math.floor(i / 2) + 1,
      color: i % 2 === 0 ? "white" : "black",
      san,
      quality,
      centipawnLoss,
      bestMoveSan: bestMoveSan && bestMoveSan !== san ? bestMoveSan : null,
      comment,
      fenAfter: after.fen,
      from: playedMove.from,
      to: playedMove.to,
    });
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
    initialFen,
    moves,
    openingName,
    playerAverageCentipawnLoss,
    playerAccuracyLabel: accuracyLabel(playerAverageCentipawnLoss),
    turningPoints,
  };
}
