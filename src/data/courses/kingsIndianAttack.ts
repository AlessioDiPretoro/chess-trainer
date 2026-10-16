import type { Course } from "../../types/course";

export const kingsIndianAttack: Course = {
  id: "kings-indian-attack",
  name: "King's Indian Attack",
  description:
    "Un secondo sistema universale per il Bianco, stavolta basato sul fianchetto: sviluppi sempre nello stesso modo (Nf3, g3, Bg2, O-O, d3, Nbd2, e4) quasi a prescindere da come risponde il Nero, poi guadagni spazio al centro e punti all'attacco di re.",
  playerColor: "white",
  lessons: [
    { title: "Lo schieramento flessibile", stepIndices: [0, 1, 2] },
    { title: "Il re al sicuro, poi il centro", stepIndices: [3, 4, 5] },
    { title: "Spazio e attacco", stepIndices: [6, 7, 8] },
  ],
  plan: [
    { san: "Nf3", explanation: "Sviluppi in modo flessibile, senza svelare subito come sarà la struttura centrale." },
    { san: "g3", explanation: "Prepari il fianchetto dell'alfiere, che controllerà la lunga diagonale a1-h8." },
    {
      san: "Bg2",
      explanation: "L'alfiere prende posizione sulla diagonale lunga, pronto a sostenere lo sfondamento centrale.",
      patternTag: "kia-setup",
    },
    { san: "O-O", explanation: "Metti il re al sicuro presto, prima di impegnarti al centro: non hai nulla da temere tatticamente." },
    { san: "d3", explanation: "Sostieni il centro in modo solido, lasciando aperte più opzioni rispetto a una spinta immediata." },
    { san: "Nbd2", explanation: "Sviluppi l'ultimo cavallo, pronto a sostenere la futura spinta e4 o a saltare in c4." },
    { san: "e4", explanation: "Ora che lo sviluppo è completo, occupi il centro e guadagni spazio." },
    {
      san: "Re1",
      explanation: "La torre sostiene la colonna e, preparando l'eventuale avanzata e4-e5.",
      patternTag: "kia-expansion",
    },
    { san: "e5", explanation: "La spinta tipica del sistema: guadagni spazio e togli al Nero le case migliori per i suoi pezzi." },
  ],
  book: {
    Nf3: [
      { san: "d5", weight: 3, minLevel: 0 },
      { san: "c5", weight: 3, minLevel: 0 },
      { san: "Nf6", weight: 2, minLevel: 0 },
      { san: "e5", weight: 1, minLevel: 8 },
      { san: "g6", weight: 1, minLevel: 12 },
    ],
    "Nf3 d5 g3": [
      { san: "Nf6", weight: 4, minLevel: 0 },
      { san: "c5", weight: 2, minLevel: 0 },
      { san: "Bg4", weight: 1, minLevel: 6 },
    ],
    "Nf3 c5 g3": [
      { san: "Nf6", weight: 3, minLevel: 0 },
      { san: "g6", weight: 2, minLevel: 0 },
      { san: "d5", weight: 1, minLevel: 6 },
    ],
    "Nf3 d5 g3 Nf6 Bg2": [
      { san: "e6", weight: 3, minLevel: 0 },
      { san: "Bg4", weight: 2, minLevel: 0 },
      { san: "c6", weight: 2, minLevel: 6 },
    ],
  },
  tacticalIdeas: [
    {
      title: "Spazio ed espansione sul lato di re",
      description:
        "Dopo e4-e5 il Nero perde le case migliori per il cavallo e l'alfiere chiaro, mentre tu sei libero di manovrare i pezzi verso il lato di re (ad esempio con Nd2-f1-g3-h5, o con la spinta f4-f5) in vista di un attacco diretto al re. Il motore ti aiuterà a riconoscere il momento giusto durante la partita.",
      patternTag: "kia-expansion",
    },
  ],
};
