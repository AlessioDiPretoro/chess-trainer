export type PlanStep = {
  /** Mossa in notazione SAN consigliata dall'insegnante per questo step. */
  san: string;
  /** Spiegazione didattica del perché questa mossa fa parte del piano. */
  explanation: string;
  /** Tag del pattern tattico/posizione classica a cui questo step prepara, se presente. */
  patternTag?: string;
};

export type BookReply = {
  san: string;
  /** Peso relativo con cui questa risposta viene scelta a un dato livello. */
  weight: number;
  /** Livello minimo (0-20) da cui questa risposta entra nel pool. */
  minLevel: number;
};

/** Libro delle aperture: mappa una sequenza di mosse (storia in SAN, giunta con spazi) alle risposte note. */
export type OpeningBook = Record<string, BookReply[]>;

export type Lesson = {
  title: string;
  /** Indici (0-based) degli step del `plan` che compongono questa mini-lezione. */
  stepIndices: number[];
};

export type TacticalIdea = {
  title: string;
  description: string;
  /** Collega l'idea al `patternTag` di uno step del piano. */
  patternTag: string;
};

export type Course = {
  id: string;
  name: string;
  description: string;
  /** Il giocatore umano gioca sempre questo colore in questo corso. */
  playerColor: "white" | "black";
  /** Piano di sviluppo consigliato, indipendente (per lo più) dalle risposte dell'avversario. */
  plan: PlanStep[];
  /** Raggruppamento del piano in mini-lezioni percorribili step by step. */
  lessons: Lesson[];
  /** Libro delle risposte note dell'avversario, usato per restare "in teoria" per livello. */
  book: OpeningBook;
  /** Pattern tattici/posizioni classiche a cui il piano di questo corso prepara. */
  tacticalIdeas: TacticalIdea[];
};
