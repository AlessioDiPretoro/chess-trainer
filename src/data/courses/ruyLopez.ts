import type { Course } from "../../types/course";

export const ruyLopez: Course = {
  id: "ruy-lopez",
  name: "Apertura Spagnola (Ruy Lopez)",
  description:
    "L'apertura più giocata nella storia degli scacchi ad alto livello. A differenza dei sistemi universali (London, King's Indian Attack), qui segui una linea teorica precisa — la variante Chiusa/Morphy — pensata per chi vuole studiare teoria vera e propria fino alla tabiya classica dopo 9.h3.",
  playerColor: "white",
  lessons: [
    { title: "Il pin iniziale", stepIndices: [0, 1, 2] },
    { title: "Mantenere la tensione", stepIndices: [3, 4, 5] },
    { title: "Verso la tabiya classica", stepIndices: [6, 7, 8] },
  ],
  plan: [
    {
      san: "e4",
      explanation:
        "Occupi il centro e apri la diagonale per l'alfiere e la donna. È la mossa più diretta per rivendicare subito il controllo del centro, il primo obiettivo di ogni apertura secondo la teoria classica.",
      principle: "centro",
    },
    {
      san: "Nf3",
      explanation:
        "Sviluppi attaccando subito il pedone e5, costringendo il Nero a difenderlo. Nota come lo sviluppo non sia mai fine a sé stesso: ogni pezzo che esce dovrebbe, quando possibile, creare anche una minaccia concreta, guadagnando un tempo invece di limitarsi a occupare una casa.",
      principle: "sviluppo",
    },
    {
      san: "Bb5",
      explanation:
        "La mossa che dà il nome all'apertura: l'alfiere mette pressione sul cavallo che difende e5, continuando a far pesare la minaccia sul centro nero invece di lasciare che la tensione si sciolga da sola. È sviluppo con uno scopo preciso, non un pezzo piazzato a caso.",
      patternTag: "ruy-lopez-pin",
      principle: "sviluppo",
    },
    {
      san: "Ba4",
      explanation:
        "Dopo ...a6 mantieni la pressione invece di risolvere subito la tensione: l'alfiere resta flessibile sulla diagonale a4-e8. Risolvere una tensione troppo presto (qui, catturando su c6) spesso regala all'avversario una struttura migliore di quella che avrebbe ottenuto da solo: a volte il miglior uso di una minaccia è lasciarla sul tavolo.",
      principle: "tempo",
    },
    {
      san: "O-O",
      explanation:
        "Metti il re al sicuro prima di impegnarti ulteriormente al centro. Anche in una linea teorica profonda come questa, l'ordine delle priorità resta lo stesso dei manuali classici: sviluppo dei pezzi minori, poi sicurezza del re, solo dopo i piani più ambiziosi.",
      principle: "re-sicuro",
    },
    {
      san: "Re1",
      explanation:
        "La torre si porta sulla colonna e, sostenendo il centro in vista della futura spinta d4 — prima ancora di giocarla. Preparare un'azione futura mettendo i pezzi al posto giusto in anticipo è più efficiente che improvvisarla quando il momento arriva.",
      principle: "profilassi",
    },
    {
      san: "Bb3",
      explanation:
        "Ritiri l'alfiere su una casa sicura, fuori dalla portata di ...Na5 o ...b4, mantenendo comunque la pressione sulla diagonale verso f7. Riposizionare un pezzo su una casa più sicura, senza perderne l'efficacia, è normale quando l'avversario minaccia di guadagnare tempo contro di lui.",
      principle: "sviluppo",
    },
    {
      san: "c3",
      explanation:
        "Prepari la spinta centrale d4 senza concedere al cavallo nero la casa b4. Una mossa di pedone apparentemente modesta che in realtà prepara con precisione la vera rottura centrale, togliendo in anticipo una risorsa all'avversario.",
      patternTag: "ruy-lopez-center",
      principle: "profilassi",
    },
    {
      san: "h3",
      explanation:
        "Mossa silenziosa ma tipica di questa tabiya: togli al Nero la possibilità di ...Bg4 fastidioso, pronto a continuare con Nbd2 e d4. Non tutte le mosse importanti sono spettacolari: prevenire in anticipo il fastidio di un pin sul cavallo f3 è il tipo di dettaglio che la teoria classica chiama profilassi, ed è spesso ciò che distingue una buona partita d'apertura da una solo approssimativa.",
      principle: "profilassi",
    },
  ],
  book: {
    e4: [
      { san: "e5", weight: 6, minLevel: 0 },
      { san: "c5", weight: 2, minLevel: 10 },
      { san: "e6", weight: 1, minLevel: 12 },
      { san: "c6", weight: 1, minLevel: 12 },
    ],
    "e4 e5 Nf3": [
      { san: "Nc6", weight: 6, minLevel: 0 },
      { san: "Nf6", weight: 2, minLevel: 8 },
    ],
    "e4 e5 Nf3 Nc6 Bb5": [
      { san: "a6", weight: 5, minLevel: 0 },
      { san: "Nf6", weight: 2, minLevel: 0 },
      { san: "Bc5", weight: 1, minLevel: 6 },
    ],
    "e4 e5 Nf3 Nc6 Bb5 a6 Ba4": [
      { san: "Nf6", weight: 6, minLevel: 0 },
      { san: "b5", weight: 1, minLevel: 10 },
      { san: "Bc5", weight: 1, minLevel: 10 },
    ],
    "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O": [
      { san: "Be7", weight: 5, minLevel: 0 },
      { san: "b5", weight: 2, minLevel: 0 },
      { san: "Nxe4", weight: 1, minLevel: 12 },
    ],
    "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1": [
      { san: "b5", weight: 5, minLevel: 0 },
      { san: "d6", weight: 2, minLevel: 0 },
    ],
    "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3": [
      { san: "d6", weight: 5, minLevel: 0 },
      { san: "O-O", weight: 2, minLevel: 0 },
    ],
    "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3": [{ san: "O-O", weight: 1, minLevel: 0 }],
  },
  tacticalIdeas: [
    {
      title: "La pressione del pin su c6",
      description:
        "L'alfiere su b5/a4 tiene sotto pressione il cavallo che difende e5. Non serve risolvere subito la tensione: mantenerla ti dà tempo di sviluppo e flessibilità, mentre il Nero deve costantemente tenerne conto.",
      patternTag: "ruy-lopez-pin",
    },
    {
      title: "La spinta centrale d4",
      description:
        "c3 prepara d4 senza concedere la casa b4 al cavallo nero: quando il centro si apre, se il Nero non ha preparato bene la risposta puoi ottenere un vantaggio di spazio duraturo. Il motore ti aiuterà a capire quando conviene spingere e quando mantenere la tensione.",
      patternTag: "ruy-lopez-center",
    },
  ],
};
