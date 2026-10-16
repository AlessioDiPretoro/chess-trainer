import type { OpeningNameEntry } from "../types/openingName";

/**
 * Elenco curato di aperture note, riconosciute dal loro nome storico/tradizionale.
 * Volutamente limitato a nomi molto documentati e certi: niente varianti rare o
 * contestate, per non rischiare di "inventare" classificazioni imprecise.
 *
 * Ogni voce è la sequenza di mosse (in SAN) a cui corrisponde quel nome. Le voci
 * sono verificate per legalità con uno script offline (chess.js) prima del merge.
 */
export const curatedOpeningNames: OpeningNameEntry[] = [
  // --- Prime mosse del Bianco ---
  { moves: ["e4"], name: "Apertura di Re" },
  { moves: ["d4"], name: "Apertura di Donna" },
  { moves: ["c4"], name: "Apertura Inglese" },
  { moves: ["Nf3"], name: "Apertura Réti" },
  { moves: ["g3"], name: "Apertura Benko" },
  { moves: ["b3"], name: "Apertura Larsen (Nimzo-Larsen Attack)" },
  { moves: ["f4"], name: "Apertura Bird" },
  { moves: ["b4"], name: "Apertura Sokolsky (Orango)" },
  { moves: ["Nc3"], name: "Apertura Van Geet" },
  { moves: ["g4"], name: "Apertura Grob" },
  { moves: ["e3"], name: "Apertura Van't Kruijs" },
  { moves: ["c3"], name: "Apertura Saragozza" },
  { moves: ["d3"], name: "Apertura Mieses" },
  { moves: ["a3"], name: "Apertura Anderssen" },
  { moves: ["f3"], name: "Apertura Gedult (Barnes)" },

  // --- 1.e4: risposte del Nero ---
  { moves: ["e4", "e5"], name: "Gioco Aperto" },
  { moves: ["e4", "c5"], name: "Difesa Siciliana" },
  { moves: ["e4", "e6"], name: "Difesa Francese" },
  { moves: ["e4", "c6"], name: "Difesa Caro-Kann" },
  { moves: ["e4", "d5"], name: "Difesa Scandinava" },
  { moves: ["e4", "Nf6"], name: "Difesa Alekhine" },
  { moves: ["e4", "d6"], name: "Difesa Pirc" },
  { moves: ["e4", "g6"], name: "Difesa Moderna" },
  { moves: ["e4", "b6"], name: "Difesa Owen" },
  { moves: ["e4", "Nc6"], name: "Difesa Nimzowitsch (1.e4 Cc6)" },

  // --- 1.e4 e5: diramazioni ---
  { moves: ["e4", "e5", "Bc4"], name: "Apertura dell'Alfiere" },
  { moves: ["e4", "e5", "Nc3"], name: "Apertura Vienna" },
  { moves: ["e4", "e5", "d4"], name: "Gambetto di Centro" },
  { moves: ["e4", "e5", "f4"], name: "Gambetto di Re" },
  { moves: ["e4", "e5", "f4", "exf4"], name: "Gambetto di Re Accettato" },
  { moves: ["e4", "e5", "f4", "Bc5"], name: "Gambetto di Re Rifiutato (Difesa Classica)" },
  { moves: ["e4", "e5", "Nf3", "Nf6"], name: "Difesa Petrov (Russa)" },
  { moves: ["e4", "e5", "Nf3", "d6"], name: "Difesa Philidor" },
  { moves: ["e4", "e5", "Nf3", "f5"], name: "Controgambetto Lettone" },
  { moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"], name: "Apertura Spagnola (Ruy Lopez)" },
  { moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"], name: "Apertura Italiana (Giuoco Piano)" },
  { moves: ["e4", "e5", "Nf3", "Nc6", "Nc3"], name: "Apertura dei Quattro Cavalli" },
  { moves: ["e4", "e5", "Nf3", "Nc6", "d4"], name: "Apertura Scozzese (Scotch Game)" },

  // --- 1.e4 c5: diramazioni Siciliana ---
  { moves: ["e4", "c5", "Nc3"], name: "Difesa Siciliana, Variante Chiusa" },
  { moves: ["e4", "c5", "c3"], name: "Difesa Siciliana, Variante Alapin" },
  { moves: ["e4", "c5", "Nf3", "g6"], name: "Difesa Siciliana, Dragone Accelerato" },
  { moves: ["e4", "c5", "Nf3", "e6"], name: "Difesa Siciliana (Scheveningen/Taimanov)" },

  // --- 1.e4 e6: diramazioni Francese ---
  { moves: ["e4", "e6", "d4", "d5", "Nc3", "Bb4"], name: "Difesa Francese, Variante Winawer" },
  { moves: ["e4", "e6", "d4", "d5", "Nd2"], name: "Difesa Francese, Variante Tarrasch" },
  { moves: ["e4", "e6", "d4", "d5", "exd5"], name: "Difesa Francese, Variante dello Scambio" },
  { moves: ["e4", "e6", "d4", "d5", "e5"], name: "Difesa Francese, Variante dell'Avanzata" },

  // --- 1.d4: risposte del Nero ---
  { moves: ["d4", "d5"], name: "Apertura di Donna" },
  { moves: ["d4", "Nf6"], name: "Gioco Indiano" },
  { moves: ["d4", "f5"], name: "Difesa Olandese" },
  { moves: ["d4", "c5"], name: "Difesa Benoni" },
  { moves: ["d4", "g6"], name: "Difesa Moderna" },

  // --- 1.d4 d5: diramazioni ---
  { moves: ["d4", "d5", "c4", "e6"], name: "Gambetto di Donna Rifiutato" },
  { moves: ["d4", "d5", "c4", "dxc4"], name: "Gambetto di Donna Accettato" },
  { moves: ["d4", "d5", "c4", "c6"], name: "Difesa Slava" },
  { moves: ["d4", "d5", "c4", "Nc6"], name: "Difesa Chigorin" },

  // --- 1.d4 Nf6: diramazioni Indiane ---
  { moves: ["d4", "Nf6", "c4", "g6"], name: "Difesa Est-Indiana (King's Indian Defense)" },
  { moves: ["d4", "Nf6", "c4", "c5"], name: "Difesa Benoni" },
  { moves: ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4"], name: "Difesa Nimzo-Indiana" },
  { moves: ["d4", "Nf6", "c4", "e6", "Nf3", "b6"], name: "Difesa Est-Indiana della Donna (Queen's Indian)" },
  { moves: ["d4", "Nf6", "c4", "d5"], name: "Difesa Grünfeld" },

  // --- 1.c4: diramazioni Inglese ---
  { moves: ["c4", "e5"], name: "Apertura Inglese (Siciliana Invertita)" },
  { moves: ["c4", "c5"], name: "Apertura Inglese, Variante Simmetrica" },
];
