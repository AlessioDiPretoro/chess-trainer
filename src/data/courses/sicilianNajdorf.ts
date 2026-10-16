import type { Course } from "../../types/course";

export const sicilianNajdorf: Course = {
  id: "sicilian-najdorf",
  name: "Difesa Siciliana Najdorf",
  description:
    "Il primo corso per il Nero: una delle difese più giocate e analizzate ad alto livello. Qui affronti il Sistema Inglese (6.Be3), una delle risposte più ambiziose e temute del Bianco, con un piano di contro-sviluppo centrale e contrattacco sul lato di donna. Repertorio teorico, pensato anche per giocatori esperti.",
  playerColor: "black",
  lessons: [
    { title: "Il taglio Najdorf", stepIndices: [0, 1, 2] },
    { title: "La mossa a6 e la reazione al centro", stepIndices: [3, 4, 5] },
    { title: "Sviluppo e corsa alle ali opposte", stepIndices: [6, 7, 8] },
  ],
  plan: [
    {
      san: "c5",
      explanation:
        "Risposta affilata e asimmetrica a 1.e4: lotti per l'iniziativa invece di cercare la simmetria. Controllare il centro non significa sempre occupare le stesse case dell'avversario — qui lo fai lateralmente, mettendo subito pressione sulla casa d4 e rifiutando una struttura speculare che favorirebbe chi ha mosso per primo.",
      principle: "centro",
    },
    {
      san: "d6",
      explanation:
        "Prepari ...Nf6 senza concedere subito spazio al centro e tieni aperte le opzioni di struttura (potrai scegliere tra ...e5 ed ...e6 più avanti). Non impegnarsi su una struttura pedonale definitiva finché non è necessario è spesso meglio che deciderla troppo presto.",
      principle: "struttura",
    },
    {
      san: "cxd4",
      explanation:
        "Catturi al centro: il Bianco deve riprendere con il cavallo, perdendo di fatto un tempo di sviluppo rispetto a strutture più simmetriche, dove quel pedone sarebbe rimasto a presidiare il centro. È il prezzo che il Bianco paga per l'ambizione del sistema aperto.",
      principle: "tempo",
    },
    {
      san: "Nf6",
      explanation:
        "Sviluppi attaccando subito il pedone e4, mossa naturale dopo la cattura su d4. Come sempre, un pezzo che esce e minaccia qualcosa vale più di un pezzo che esce e basta: guadagni sviluppo e tempo nella stessa mossa.",
      principle: "sviluppo",
    },
    {
      san: "a6",
      explanation:
        "La mossa che dà il nome alla variante: togli al Bianco la casa b5 per cavallo e alfiere, preparando con calma ...e5 o ...b5. È l'esempio di profilassi più famoso di tutta la teoria degli scacchi: una mossa di pedone apparentemente modesta che previene in anticipo un intero gruppo di idee tattiche avversarie (Nb5, Bb5+) prima ancora che si presentino.",
      patternTag: "najdorf-setup",
      principle: "profilassi",
    },
    {
      san: "e5",
      explanation:
        "Contro il Sistema Inglese (6.Be3) contrasti subito il cavallo centrale: il cavallo su d4 deve ritirarsi, cedendoti tempo e spazio. Una spinta di pedone che scaccia un pezzo avversario è spesso il modo più efficiente di guadagnare spazio: l'avversario perde tempo a riposizionarsi mentre tu continui a svilupparti.",
      principle: "centro",
    },
    {
      san: "Be6",
      explanation:
        "Sviluppi l'alfiere su una casa attiva, pronta a sostenere un futuro ...d5 e a controllare la diagonale verso a2. Nota che la struttura di pedoni già scelta (c5-d6-e5) determina quali case sono buone per i tuoi pezzi: sviluppo e struttura pedonale non sono due questioni separate, lavorano insieme.",
      principle: "sviluppo",
    },
    {
      san: "Be7",
      explanation:
        "Completi lo sviluppo del secondo alfiere, pronto a manovrare con ...Nbd7 e ...b5 o a completare l'arrocco secondo necessità. Una casa modesta ma flessibile: a differenza di molte aperture aperte, qui il re nero non ha sempre fretta di arroccare, perché il piano reale si gioca sul lato di donna.",
      principle: "sviluppo",
    },
    {
      san: "Nbd7",
      explanation:
        "Sviluppi l'ultimo cavallo verso una casa flessibile, pronto a sostenere la spinta ...b5 per il contrattacco sul lato di donna. Con lo sviluppo completo, l'iniziativa passa al piano strategico di fondo di questa variante: una vera e propria corsa, pedoni contro pedoni, sulle due ali opposte della scacchiera.",
      patternTag: "najdorf-counterplay",
      principle: "sviluppo",
    },
  ],
  book: {
    "": [{ san: "e4", weight: 1, minLevel: 0 }],
    "e4 c5": [
      { san: "Nf3", weight: 6, minLevel: 0 },
      { san: "Nc3", weight: 1, minLevel: 12 },
      { san: "c3", weight: 1, minLevel: 14 },
    ],
    "e4 c5 Nf3 d6": [{ san: "d4", weight: 1, minLevel: 0 }],
    "e4 c5 Nf3 d6 d4 cxd4": [{ san: "Nxd4", weight: 1, minLevel: 0 }],
    "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6": [{ san: "Nc3", weight: 1, minLevel: 0 }],
    "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6": [
      { san: "Be3", weight: 4, minLevel: 0 },
      { san: "Bg5", weight: 2, minLevel: 8 },
      { san: "Be2", weight: 1, minLevel: 10 },
      { san: "Bc4", weight: 1, minLevel: 12 },
    ],
    "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e5": [{ san: "Nb3", weight: 1, minLevel: 0 }],
    "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e5 Nb3 Be6": [{ san: "f3", weight: 1, minLevel: 0 }],
    "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Be3 e5 Nb3 Be6 f3 Be7": [{ san: "Qd2", weight: 1, minLevel: 0 }],
  },
  tacticalIdeas: [
    {
      title: "Il tempo guadagnato con ...a6",
      description:
        "Togliendo al Bianco le case b5 per cavallo e alfiere, ...a6 non è una mossa 'persa': ti dà la flessibilità di scegliere tra ...e5 ed ...e6 secondo come risponde il Bianco, senza subire fastidi tattici su b5.",
      patternTag: "najdorf-setup",
    },
    {
      title: "La corsa alle ali opposte",
      description:
        "Nel Sistema Inglese il Bianco arrocca spesso lungo e lancia i pedoni g4-g5-h4 contro il tuo re, mentre tu contrattacchi con ...b5-...b4 e le torri verso c8/b8 sul lato di donna. È una vera corsa: chi arriva prima spesso decide la partita. Il motore ti aiuterà a capire quando è il momento di accelerare.",
      patternTag: "najdorf-counterplay",
    },
  ],
};
