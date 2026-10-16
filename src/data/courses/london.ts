import type { Course } from "../../types/course";

export const londonSystem: Course = {
  id: "london-system",
  name: "London System",
  description:
    "Un piano di sviluppo solido per il Bianco, quasi indipendente dalle risposte del Nero: utile per chi inizia perché richiede poca memoria a lungo termine e porta quasi sempre a una struttura sicura con buone chance di attacco in caso di imprecisioni del Nero.",
  playerColor: "white",
  lessons: [
    { title: "Primi passi", stepIndices: [0, 1, 2] },
    { title: "La struttura d'attacco", stepIndices: [3, 4, 5] },
    { title: "Pronti alla battaglia", stepIndices: [6, 7, 8] },
  ],
  plan: [
    { san: "d4", explanation: "Occupi il centro e apri la diagonale per l'alfiere di c1." },
    { san: "Nf3", explanation: "Sviluppi il cavallo prima di chiudere la diagonale dell'alfiere con e3." },
    {
      san: "Bf4",
      explanation: "La mossa caratteristica del London System: l'alfiere esce subito, prima che il pedone e3 gli blocchi la strada.",
      patternTag: "london-setup",
    },
    { san: "e3", explanation: "Completi la struttura a piramide (pedoni d4-e3), proteggendo d4 e aprendo la strada all'alfiere chiaro." },
    {
      san: "Bd3",
      explanation: "L'alfiere chiaro punta verso h7: è la base dell'attacco sul lato di re che vedrai nella lezione sul sacrificio greco.",
      patternTag: "greek-gift-setup",
    },
    { san: "Nbd2", explanation: "Sviluppi l'ultimo cavallo, lasciando libera la casa c3 per il pedone." },
    { san: "c3", explanation: "Rinforzi il centro e dai una via di fuga all'alfiere di f4 se viene attaccato con ...Nh5 o ...Ne4." },
    { san: "Qe2", explanation: "Colleghi le torri e prepari l'arrocco corto, tenendo la donna pronta a passare su h5 o g4 in caso di attacco." },
    { san: "O-O", explanation: "Il re è al sicuro: la struttura di base del London è completa, ora si tratta di giocare sulle debolezze del Nero." },
  ],
  book: {
    d4: [
      { san: "d5", weight: 6, minLevel: 0 },
      { san: "Nf6", weight: 3, minLevel: 0 },
      { san: "c5", weight: 1, minLevel: 10 },
      { san: "g6", weight: 1, minLevel: 14 },
    ],
    "d4 d5 Nf3": [
      { san: "Nf6", weight: 6, minLevel: 0 },
      { san: "Bf5", weight: 2, minLevel: 0 },
      { san: "c6", weight: 1, minLevel: 8 },
    ],
    "d4 Nf6 Nf3": [
      { san: "d5", weight: 4, minLevel: 0 },
      { san: "g6", weight: 3, minLevel: 0 },
      { san: "e6", weight: 2, minLevel: 6 },
    ],
    "d4 d5 Nf3 Nf6 Bf4": [
      { san: "e6", weight: 5, minLevel: 0 },
      { san: "c5", weight: 3, minLevel: 0 },
      { san: "Bf5", weight: 1, minLevel: 0 },
      { san: "g6", weight: 2, minLevel: 10 },
    ],
    "d4 d5 Nf3 Nf6 Bf4 e6 e3": [
      { san: "Be7", weight: 4, minLevel: 0 },
      { san: "Bd6", weight: 3, minLevel: 0 },
      { san: "c5", weight: 2, minLevel: 6 },
    ],
  },
  tacticalIdeas: [
    {
      title: "Il sacrificio greco (Bxh7+)",
      description:
        "Se il Nero arrocca corto senza aver giocato ...h6, l'alfiere su d3 punta dritto al pedone h7. In quel caso Bxh7+! costringe il re a uscire allo scoperto: dopo ...Kxh7, Cg5+ e Dh5 creano minacce di matto decisive. Durante le partite, il motore ti segnalerà quando questa occasione si presenta davvero.",
      patternTag: "greek-gift-setup",
    },
  ],
};
