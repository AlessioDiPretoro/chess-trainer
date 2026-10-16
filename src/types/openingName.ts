export type OpeningMatch = {
  name: string;
  /** Se questa apertura coincide con un corso già presente nell'app. */
  courseId?: string;
};

export type OpeningNameEntry = {
  /** Sequenza di mosse in SAN che porta a questa posizione, dalla partenza. */
  moves: string[];
  name: string;
};

export type MoveSuggestion = {
  /** La mossa candidata, in SAN, giocabile dalla posizione attuale. */
  san: string;
  /** Il nome dello schema in cui si entrerebbe giocando questa mossa. */
  resultingName: string;
  /** Se true, questa mossa resta nello stesso schema già riconosciuto ora. */
  continuesCurrent: boolean;
};
