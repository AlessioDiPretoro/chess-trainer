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
    {
      san: "c6",
      explanation:
        "Prepari ...d5 sostenendo il pedone con il pedone c: una struttura più solida (anche se meno attiva) della Difesa Francese. È una scelta di struttura pedonale fatta fin dalla prima mossa: decidi subito di privilegiare la solidità a lungo termine rispetto all'attività immediata.",
      principle: "struttura",
    },
    {
      san: "d5",
      explanation:
        "Sfidi subito il centro bianco, offrendo di cambiare i pedoni centrali. Anche giocando il Nero, il principio resta lo stesso: contestare il centro appena possibile, invece di lasciare che il Bianco lo occupi senza opposizione.",
      principle: "centro",
    },
    {
      san: "dxe4",
      explanation:
        "Catturi il pedone: il Bianco deve riprendere con il cavallo, perdendo di fatto un tempo di sviluppo rispetto a come avrebbe voluto schierare i suoi pezzi. Una semplice cattura può già mettere in difficoltà l'avversario sul piano dei tempi.",
      principle: "tempo",
    },
    {
      san: "Bf5",
      explanation:
        "Sviluppi l'alfiere fuori dalla catena di pedoni prima di giocare ...e6: è il vantaggio strutturale tipico del Caro-Kann rispetto alla Francese, dove questo stesso alfiere resta chiuso in casa per tutta la partita. L'ordine delle mosse qui non è un dettaglio tecnico: è precisamente ciò che distingue le due aperture.",
      patternTag: "caro-kann-setup",
      principle: "sviluppo",
    },
    {
      san: "Bg6",
      explanation:
        "Ritiri l'alfiere mantenendolo attivo sulla diagonale, invece di concederlo in cambio con ...Bg4 o mosse simili. Conservare la coppia degli alfieri (o almeno un alfiere attivo) quando non c'è un buon motivo per cederlo è spesso una scelta strategica silenziosa ma concreta.",
      principle: "coppia-alfieri",
    },
    {
      san: "h6",
      explanation:
        "Mossa prudente: prepari ...Nf6 togliendo al Bianco la possibilità di un fastidioso Ng5, mentre osservi l'espansione bianca con h4-h5. Prevenire un problema prima che si presenti, invece di doverci reagire più avanti in condizioni peggiori, è l'essenza della profilassi.",
      principle: "profilassi",
    },
    {
      san: "Nd7",
      explanation:
        "Sviluppi il cavallo verso una casa flessibile, pronto a riposizionarsi su b6 o f6 secondo necessità. Uno sviluppo che non si impegna troppo presto su un piano preciso lascia aperte più strade per adattarti a come gioca il Bianco.",
      principle: "sviluppo",
    },
    {
      san: "Bh7",
      explanation:
        "Ritiri l'alfiere in un angolo sicuro ma ancora utile sulla diagonale, lasciando aperta la strada per l'arrocco. Un pezzo al sicuro e ancora attivo vale più di un pezzo aggressivo ma esposto a essere attaccato con guadagno di tempo.",
      patternTag: "caro-kann-trade",
      principle: "sviluppo",
    },
    {
      san: "Bxd3",
      explanation:
        "Scambi il tuo alfiere con quello bianco su d3, semplificando la posizione ed eliminando un pezzo che altrimenti punterebbe verso il tuo arrocco. Non tutti i cambi sono uguali: qui elimini specificamente il pezzo che l'avversario userebbe per attaccare il tuo re, un cambio mirato alla sicurezza del re più che alla semplificazione in sé.",
      principle: "re-sicuro",
    },
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
