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
    { san: "c5", explanation: "Risposta affilata e asimmetrica a 1.e4: lotti per l'iniziativa invece di cercare la simmetria." },
    { san: "d6", explanation: "Prepari ...Nf6 senza concedere subito spazio al centro e tieni aperte le opzioni di struttura." },
    { san: "cxd4", explanation: "Catturi al centro: il Bianco deve riprendere con il cavallo, perdendo un tempo di sviluppo rispetto a strutture più simmetriche." },
    { san: "Nf6", explanation: "Sviluppi attaccando subito il pedone e4, mossa naturale dopo la cattura su d4." },
    {
      san: "a6",
      explanation: "La mossa che dà il nome alla variante: togli al Bianco la casa b5 per cavallo e alfiere, preparando con calma ...e5 o ...b5.",
      patternTag: "najdorf-setup",
    },
    { san: "e5", explanation: "Contro il Sistema Inglese (6.Be3) contrasti subito il cavallo centrale: il cavallo su d4 deve ritirarsi, cedendoti tempo e spazio." },
    { san: "Be6", explanation: "Sviluppi l'alfiere su una casa attiva, pronta a sostenere un futuro ...d5 e a controllare la diagonale verso a2." },
    { san: "Be7", explanation: "Completi lo sviluppo del secondo alfiere, pronto a manovrare con ...Nbd7 e ...b5 o a completare l'arrocco secondo necessità." },
    {
      san: "Nbd7",
      explanation: "Sviluppi l'ultimo cavallo verso una casa flessibile, pronto a sostenere la spinta ...b5 per il contrattacco sul lato di donna.",
      patternTag: "najdorf-counterplay",
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
