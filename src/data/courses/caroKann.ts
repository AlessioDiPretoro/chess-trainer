import type { Course } from "../../types/course";

export const caroKann: Course = {
  id: "caro-kann",
  name: "Difesa Caro-Kann",
  description:
    "Un secondo corso per il Nero, più solido e meno affilato della Najdorf: la linea Classica, con il celebre piano h4-h5 del Bianco e il cambio degli alfieri su d3. Struttura solida, meno teoria a memoria rispetto alla Siciliana, ma richiede comunque precisione nei primi movimenti.",
  playerColor: "black",
  lessons: [
    { title: "Il cambio al centro", stepIndices: [0, 1, 2] },
    { title: "L'alfiere fuori dalla catena", stepIndices: [3, 4, 5] },
    { title: "Resistere all'avanzata h4-h5", stepIndices: [6, 7, 8] },
  ],
  plan: [
    { san: "c6", explanation: "Prepari ...d5 sostenendo il pedone con il pedone c: una struttura più solida (anche se meno attiva) della Difesa Francese." },
    { san: "d5", explanation: "Sfidi subito il centro bianco, offrendo di cambiare i pedoni centrali." },
    { san: "dxe4", explanation: "Catturi il pedone: il Bianco deve riprendere con il cavallo, perdendo un tempo di sviluppo." },
    {
      san: "Bf5",
      explanation: "Sviluppi l'alfiere fuori dalla catena di pedoni prima di giocare ...e6: è il vantaggio tipico del Caro-Kann rispetto alla Francese, dove questo alfiere resta chiuso in casa.",
      patternTag: "caro-kann-setup",
    },
    { san: "Bg6", explanation: "Ritiri l'alfiere mantenendolo attivo sulla diagonale, invece di concederlo in cambio con ...Bg4 o mosse simili." },
    { san: "h6", explanation: "Mossa prudente: prepari ...Nf6 togliendo al Bianco la possibilità di un fastidioso Ng5, mentre osservi l'espansione bianca con h4-h5." },
    { san: "Nd7", explanation: "Sviluppi il cavallo verso una casa flessibile, pronto a riposizionarsi su b6 o f6 secondo necessità." },
    {
      san: "Bh7",
      explanation: "Ritiri l'alfiere in un angolo sicuro ma ancora utile sulla diagonale, lasciando aperta la strada per l'arrocco.",
      patternTag: "caro-kann-trade",
    },
    { san: "Bxd3", explanation: "Scambi il tuo alfiere con quello bianco su d3, semplificando la posizione ed eliminando un pezzo che altrimenti punterebbe verso il tuo arrocco." },
  ],
  book: {
    "": [{ san: "e4", weight: 1, minLevel: 0 }],
    "e4 c6": [
      { san: "d4", weight: 6, minLevel: 0 },
      { san: "Nc3", weight: 1, minLevel: 10 },
      { san: "Nf3", weight: 1, minLevel: 12 },
    ],
    "e4 c6 d4 d5": [
      { san: "Nc3", weight: 6, minLevel: 0 },
      { san: "e5", weight: 3, minLevel: 8 },
      { san: "Nd2", weight: 1, minLevel: 10 },
      { san: "exd5", weight: 1, minLevel: 12 },
    ],
    "e4 c6 d4 d5 Nc3 dxe4": [{ san: "Nxe4", weight: 1, minLevel: 0 }],
    "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5": [{ san: "Ng3", weight: 1, minLevel: 0 }],
    "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6": [
      { san: "h4", weight: 5, minLevel: 0 },
      { san: "Bc4", weight: 2, minLevel: 8 },
      { san: "Nf3", weight: 1, minLevel: 10 },
    ],
    "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6": [{ san: "Nf3", weight: 1, minLevel: 0 }],
    "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7": [{ san: "h5", weight: 1, minLevel: 0 }],
    "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5 Ng3 Bg6 h4 h6 Nf3 Nd7 h5 Bh7": [{ san: "Bd3", weight: 1, minLevel: 0 }],
  },
  tacticalIdeas: [
    {
      title: "L'alfiere fuori prima di ...e6",
      description:
        "A differenza della Difesa Francese, nel Caro-Kann l'alfiere chiaro esce (...Bf5/...Bg6) PRIMA di chiudere la catena di pedoni con ...e6: è il motivo principale per cui molti giocatori preferiscono questa struttura, pur essendo un tempo più lenta della Siciliana.",
      patternTag: "caro-kann-setup",
    },
    {
      title: "Il cambio su d3 toglie benzina all'attacco",
      description:
        "Scambiando l'alfiere su d3 elimini uno dei pezzi che il Bianco userebbe per attaccare il tuo arrocco, e semplifichi la posizione verso un mediogioco più tranquillo — ideale se preferisci una partita solida piuttosto che una corsa tattica come nella Najdorf.",
      patternTag: "caro-kann-trade",
    },
  ],
};
