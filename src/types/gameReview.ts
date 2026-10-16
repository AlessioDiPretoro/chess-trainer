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
  /** Frase di commento onesta e verificabile (vedi `buildMoveComment`). */
  comment: string;
  /** Posizione (FEN) subito dopo questa mossa, per poterla rivedere sulla scacchiera. */
  fenAfter: string;
  /** Casella di partenza e arrivo, per evidenziarle sulla scacchiera durante la revisione. */
  from: string;
  to: string;
};

export type TurningPoint = {
  moveIndex: number;
  description: string;
};

export type GameReviewResult = {
  /** Posizione di partenza (di solito quella iniziale), per poter mostrare "prima di ogni mossa". */
  initialFen: string;
  moves: MoveReview[];
  /** Nome dello schema di apertura riconosciuto più in profondità, se presente. */
  openingName: string | null;
  /** Perdita media di centipawn, calcolata solo sulle mosse del giocatore. */
  playerAverageCentipawnLoss: number;
  playerAccuracyLabel: string;
  turningPoints: TurningPoint[];
};
