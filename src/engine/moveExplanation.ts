import { Chess, type Square } from "chess.js";
import type { MoveQuality } from "../types/gameReview";

export const MATE_SCORE = 100000;

export function signedScore(scoreCp: number | undefined, scoreMate: number | undefined): number {
  if (scoreMate !== undefined) return scoreMate > 0 ? MATE_SCORE : -MATE_SCORE;
  return scoreCp ?? 0;
}

export function classifyQuality(centipawnLoss: number): MoveQuality {
  if (centipawnLoss <= 10) return "best";
  if (centipawnLoss <= 50) return "good";
  if (centipawnLoss <= 100) return "inaccuracy";
  if (centipawnLoss <= 250) return "mistake";
  return "blunder";
}

export function qualityLabel(quality: MoveQuality): string {
  switch (quality) {
    case "best":
      return "Ottima mossa";
    case "good":
      return "Buona mossa";
    case "inaccuracy":
      return "Imprecisione";
    case "mistake":
      return "Errore";
    case "blunder":
      return "Abbaglio";
  }
}

export function uciToVerboseMove(chess: Chess, uci: string) {
  const from = uci.slice(0, 2) as Square;
  const to = uci.slice(2, 4) as Square;
  const promotion = uci.slice(4, 5) || undefined;
  return (
    chess.moves({ verbose: true }).find((m) => m.from === from && m.to === to && (!promotion || m.promotion === promotion)) ?? null
  );
}

const CENTER_SQUARES: Square[] = ["d4", "d5", "e4", "e5"];

const PIECE_NAMES: Record<string, string> = {
  p: "il pedone",
  n: "il cavallo",
  b: "l'alfiere",
  r: "la torre",
  q: "la donna",
  k: "il re",
};

const STARTING_MINOR_SQUARES: Record<"w" | "b", Square[]> = {
  w: ["b1", "g1", "c1", "f1"],
  b: ["b8", "g8", "c8", "f8"],
};

export type MoveCommentInput = {
  fenBeforeMove: string;
  fenAfterMove: string;
  moveSan: string;
  moveFrom: Square;
  moveTo: Square;
  movePiece: string;
  moveCaptured?: string;
  moverColor: "w" | "b";
  quality: MoveQuality;
  centipawnLoss: number;
  bestMoveSan: string | null;
  /** UCI della mossa migliore del motore nella posizione DOPO questa mossa (prospettiva avversario). */
  opponentBestMoveUci?: string;
};

/**
 * Costruisce una frase di commento onesta e verificabile per una mossa: non inventa
 * motivazioni strategiche che non può controllare concretamente. Se non trova nessun
 * fatto concreto da riportare, si limita alla classificazione (ottima/buona/ecc.).
 */
export function buildMoveComment(input: MoveCommentInput): string {
  const label = qualityLabel(input.quality);

  if (input.quality === "mistake" || input.quality === "blunder") {
    if (input.opponentBestMoveUci) {
      const afterChess = new Chess(input.fenAfterMove);
      const oppMove = uciToVerboseMove(afterChess, input.opponentBestMoveUci);
      if (oppMove?.captured) {
        const pieceName = PIECE_NAMES[oppMove.captured] ?? "un pezzo";
        return `${label}: lasci ${pieceName} in presa su ${oppMove.to}${input.bestMoveSan ? ` (meglio ${input.bestMoveSan})` : ""}.`;
      }
    }
    return `${label}${input.bestMoveSan ? `: la mossa migliore era ${input.bestMoveSan}` : ""}.`;
  }

  if (input.moveSan === "O-O" || input.moveSan === "O-O-O") {
    return `${label}: metti il re al sicuro con l'arrocco.`;
  }

  if (input.moveCaptured) {
    const pieceName = PIECE_NAMES[input.moveCaptured] ?? "un pezzo";
    return `${label}: guadagni materiale catturando ${pieceName} su ${input.moveTo}.`;
  }

  const beforeChess = new Chess(input.fenBeforeMove);
  const afterChess = new Chess(input.fenAfterMove);
  const centerGained = CENTER_SQUARES.filter(
    (sq) => !beforeChess.isAttacked(sq, input.moverColor) && afterChess.isAttacked(sq, input.moverColor)
  );
  if (centerGained.length > 0) {
    return `${label}: aumenti il controllo del centro (${centerGained.join(", ")}).`;
  }

  if (
    (input.movePiece === "n" || input.movePiece === "b") &&
    STARTING_MINOR_SQUARES[input.moverColor].includes(input.moveFrom)
  ) {
    return `${label}: sviluppi un pezzo verso una casa attiva.`;
  }

  if (input.quality === "inaccuracy" && input.bestMoveSan) {
    return `${label}: non è la scelta più precisa, la mossa migliore era ${input.bestMoveSan}.`;
  }

  return `${label}.`;
}
