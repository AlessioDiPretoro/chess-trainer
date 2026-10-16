import type { PlanStep } from "../types/course";

/** Indice (0-based) nella storia della prima mossa giocata dal giocatore, in base al colore del corso. */
export function playerStartIndex(playerColor: "white" | "black"): number {
  return playerColor === "white" ? 0 : 1;
}

/** Conta quante mosse del giocatore nella storia si discostano dal piano del corso. */
export function countDeviations(historySan: string[], plan: PlanStep[], playerColor: "white" | "black"): number {
  let count = 0;
  const start = playerStartIndex(playerColor);
  for (let i = start; i < historySan.length; i += 2) {
    const planIndex = (i - start) / 2;
    if (planIndex >= plan.length) break;
    if (historySan[i] !== plan[planIndex].san) count++;
  }
  return count;
}
