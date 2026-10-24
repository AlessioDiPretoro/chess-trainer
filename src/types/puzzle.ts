export type Puzzle = {
  id: string;
  /** Posizione in cui il giocatore deve trovare la mossa giusta (la mossa di "setup" è già stata applicata). */
  fen: string;
  /** Soluzione in UCI: mossa del giocatore, risposta forzata dell'avversario, mossa del giocatore, ... */
  moves: string[];
  rating: number;
  themes: string[];
};
