export type MoveQuality = "best" | "good" | "inaccuracy" | "mistake" | "blunder";

export type MoveReview = {
  /** Numero di mossa "piena" (1. e4 e5 → entrambe le mosse hanno moveNumber 1). */
  moveNumber: number;
  color: "white" | "black";
  san: string;
  quality: MoveQuality;
  /** Perdita di valutazione (in centipawn) rispetto alla mossa migliore in quella posizione. */
  centipawnLoss: number;
  /** Mossa migliore alternativa secondo il motore, se diversa da quella giocata. */
  bestMoveSan: string | null;
};

export type TurningPoint = {
  moveIndex: number;
  description: string;
};

export type GameReviewResult = {
  moves: MoveReview[];
  /** Nome dello schema di apertura riconosciuto più in profondità, se presente. */
  openingName: string | null;
  /** Perdita media di centipawn, calcolata solo sulle mosse del giocatore. */
  playerAverageCentipawnLoss: number;
  playerAccuracyLabel: string;
  turningPoints: TurningPoint[];
};
