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
    {
      san: "Nf3",
      explanation:
        "Sviluppi in modo flessibile, senza svelare subito come sarà la struttura centrale: a differenza del London, qui decidi la casa dei pedoni centrali solo più avanti, osservando come si schiera il Nero. Sviluppare prima di impegnarsi è una scelta di prudenza tanto quanto di principio: meno informazioni dai, meno l'avversario può preparare in anticipo.",
      principle: "sviluppo",
    },
    {
      san: "g3",
      explanation:
        "Prepari il fianchetto dell'alfiere, che controllerà la lunga diagonale a1-h8 — un modo indiretto ma molto efficace di influenzare il centro: invece di occupare le case centrali con i pedoni, le controlli a distanza con un pezzo.",
      principle: "centro",
    },
    {
      san: "Bg2",
      explanation:
        "L'alfiere prende posizione sulla diagonale lunga, pronto a sostenere lo sfondamento centrale. Qui si vede bene il principio dello sviluppo con uno scopo preciso: non è 'una mossa qualsiasi', ma la casa esatta da cui quell'alfiere lavorerà per tutta la partita.",
      patternTag: "kia-setup",
      principle: "sviluppo",
    },
    {
      san: "O-O",
      explanation:
        "Metti il re al sicuro presto, prima di impegnarti al centro: non hai nulla da temere tatticamente. Arroccare appena possibile, invece di rimandarlo per fare altro, è uno dei consigli più ripetuti — e più spesso ignorati dai principianti — in ogni manuale di apertura: un re ancora al centro è un bersaglio permanente.",
      principle: "re-sicuro",
    },
    {
      san: "d3",
      explanation:
        "Sostieni il centro in modo solido, lasciando aperte più opzioni rispetto a una spinta immediata come d4. Una struttura pedonale flessibile, che non si impegna subito, ti permette di scegliere il piano giusto DOPO aver visto come si schiera l'avversario, invece di doverti adattare a una decisione presa troppo presto.",
      principle: "struttura",
    },
    {
      san: "Nbd2",
      explanation:
        "Sviluppi l'ultimo cavallo minore, pronto a sostenere la futura spinta e4 o a saltare in c4. Con tutti i pezzi minori sviluppati e il re al sicuro, hai completato la fase di apertura nell'ordine corretto, prima ancora di pensare a un piano d'attacco.",
      principle: "sviluppo",
    },
    {
      san: "e4",
      explanation:
        "Ora che lo sviluppo è completo, occupi il centro e guadagni spazio. Non prima: spingere i pedoni centrali mentre i pezzi sono ancora fermi in casa rischia di creare bersagli senza benefici concreti — il momento in cui spingere conta quanto la spinta stessa.",
      principle: "centro",
    },
    {
      san: "Re1",
      explanation:
        "La torre sostiene la colonna e, preparando l'eventuale avanzata e4-e5 ancora prima di giocarla. È un altro esempio di profilassi/preparazione: metti il pezzo al posto giusto in anticipo, così quando la spinta centrale arriva è già sostenuta e non lascia debolezze dietro di sé.",
      patternTag: "kia-expansion",
      principle: "profilassi",
    },
    {
      san: "e5",
      explanation:
        "La spinta tipica del sistema: guadagni spazio e togli al Nero le case migliori per i suoi pezzi, in particolare il cavallo f6. Guadagnare spazio non è solo 'occupare più casa sulla scacchiera': significa restringere concretamente le opzioni dei pezzi avversari, costringendoli a manovre più passive.",
      principle: "centro",
    },
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
    // Da qui il libro mancava (il Nero sarebbe stato scelto dal motore grezzo, senza
    // nessun vincolo, per il resto del piano): aggiungo una continuazione standard e
    // verificata (nessun pezzo indifeso per nessuno dei due) per tutte le mosse restanti
    // del piano, così le lezioni 2 e 3 restano sicure fino alla fine.
    "Nf3 d5 g3 Nf6 Bg2 e6 O-O": [
      { san: "Be7", weight: 4, minLevel: 0 },
      { san: "c5", weight: 2, minLevel: 6 },
    ],
    "Nf3 d5 g3 Nf6 Bg2 e6 O-O Be7 d3": [{ san: "O-O", weight: 4, minLevel: 0 }],
    "Nf3 d5 g3 Nf6 Bg2 e6 O-O Be7 d3 O-O Nbd2": [
      { san: "c5", weight: 4, minLevel: 0 },
      { san: "b6", weight: 2, minLevel: 6 },
    ],
    "Nf3 d5 g3 Nf6 Bg2 e6 O-O Be7 d3 O-O Nbd2 c5 e4": [{ san: "Nc6", weight: 4, minLevel: 0 }],
    "Nf3 d5 g3 Nf6 Bg2 e6 O-O Be7 d3 O-O Nbd2 c5 e4 Nc6 Re1": [{ san: "b5", weight: 3, minLevel: 0 }],
    // e4-e5 attacca davvero il cavallo su f6 (è l'idea tattica descritta in tacticalIdeas):
    // la risposta corretta è ritirarlo, non lasciarlo lì.
    "Nf3 d5 g3 Nf6 Bg2 e6 O-O Be7 d3 O-O Nbd2 c5 e4 Nc6 Re1 b5 e5": [{ san: "Nd7", weight: 3, minLevel: 0 }],
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
