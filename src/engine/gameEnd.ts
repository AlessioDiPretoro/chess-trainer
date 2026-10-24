import type { Chess } from "chess.js";

export type GameOutcome = "win" | "loss" | "draw";

export type GameEndInfo = {
  outcome: GameOutcome;
  reason: string;
};

export function outcomeLabel(outcome: GameOutcome): string {
  switch (outcome) {
    case "win":
      return "Hai vinto!";
    case "loss":
      return "Hai perso";
    case "draw":
      return "Patta";
  }
}

/** Determina chi ha vinto/perso (dal punto di vista del giocatore) e il motivo preciso della fine della partita. */
export function describeGameEnd(chess: Chess, playerLetter: "w" | "b"): GameEndInfo {
  if (chess.isCheckmate()) {
    // chi è sotto scacco matto è chi deve muovere (chess.turn()) e quindi perde.
    const loserLetter = chess.turn();
    return { outcome: loserLetter === playerLetter ? "loss" : "win", reason: "Scacco matto" };
  }
  if (chess.isStalemate()) {
    return { outcome: "draw", reason: "Stallo: nessuna mossa legale, ma il re non è sotto scacco" };
  }
  if (chess.isInsufficientMaterial()) {
    return { outcome: "draw", reason: "Materiale insufficiente per dare scacco matto" };
  }
  if (chess.isThreefoldRepetition()) {
    return { outcome: "draw", reason: "Tripla ripetizione della stessa posizione" };
  }
  if (chess.isDrawByFiftyMoves()) {
    return { outcome: "draw", reason: "Regola delle 50 mosse senza catture o mosse di pedone" };
  }
  return { outcome: "draw", reason: "Patta" };
}
