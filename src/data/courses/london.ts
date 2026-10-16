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
    {
      san: "d4",
      explanation:
        "Occupi subito una delle quattro case centrali e apri la diagonale per l'alfiere di c1. Non è un caso che quasi tutte le aperture serie inizino così: chi controlla il centro nelle prime mosse costringe l'avversario a reagire sul tuo terreno, invece che dettare lui il gioco.",
      principle: "centro",
    },
    {
      san: "Nf3",
      explanation:
        "Sviluppi un pezzo minore verso una casa attiva prima di spostare due volte lo stesso pezzo o di muovere pedoni non necessari — e lo fai prima di chiudere la diagonale dell'alfiere con e3, altrimenti quell'alfiere resterebbe bloccato in casa per diverse mosse.",
      principle: "sviluppo",
    },
    {
      san: "Bf4",
      explanation:
        "La mossa caratteristica del London System: l'alfiere esce subito, prima che il pedone e3 gli blocchi la strada. È un esempio diretto di un errore di sequenza da evitare — muovere i pedoni centrali prima di far uscire gli alfieri che ci passerebbero sopra — risolto qui semplicemente invertendo l'ordine delle mosse.",
      patternTag: "london-setup",
      principle: "sviluppo",
    },
    {
      san: "e3",
      explanation:
        "Completi la struttura a piramide (pedoni d4-e3): un pedone che protegge l'altro, difficile da attaccare con un singolo pezzo. Non è un dettaglio: una struttura pedonale solida nelle prime mosse ti risparmia problemi per tutto il resto della partita, perché i pedoni, una volta spinti, non possono più tornare indietro.",
      principle: "struttura",
    },
    {
      san: "Bd3",
      explanation:
        "L'alfiere chiaro si piazza su una diagonale che punta dritto verso il re nero, ancora prima che tu sappia con certezza se e dove il Nero arroccherà: è la base dell'attacco sul lato di re che vedrai nella lezione sul sacrificio greco. Sviluppare i pezzi verso le diagonali/colonne che porteranno all'attacco finale, non verso case qualsiasi, è ciò che distingue uno sviluppo efficace da uno solo meccanico.",
      patternTag: "greek-gift-setup",
      principle: "sviluppo",
    },
    {
      san: "Nbd2",
      explanation:
        "Sviluppi l'ultimo cavallo minore, lasciando libera la casa c3 per il pedone. A questo punto hai sviluppato tutti i pezzi minori prima di muovere la donna o le torri: è esattamente l'ordine di priorità raccomandato dai manuali classici (prima i cavalli e gli alfieri, poi il resto).",
      principle: "sviluppo",
    },
    {
      san: "c3",
      explanation:
        "Rinforzi il centro e dai una via di fuga all'alfiere di f4 se viene attaccato con ...Nh5 o ...Ne4. È anche una mossa profilattica nel senso di Nimzowitsch: non attacca nulla direttamente, ma toglie in anticipo all'avversario una risorsa tattica futura, prima ancora che diventi un problema concreto.",
      principle: "profilassi",
    },
    {
      san: "Qe2",
      explanation:
        "Colleghi le torri e prepari l'arrocco corto, tenendo la donna pronta a passare su h5 o g4 in caso di attacco. Una mossa di apertura efficace serve più di uno scopo contemporaneamente: qui prepari la sicurezza del re E tieni la donna su una casa utile per il mediogioco, senza sprecare un tempo a vuoto.",
      principle: "tempo",
    },
    {
      san: "O-O",
      explanation:
        "Il re è al sicuro: la struttura di base del London è completa. Finché il re resta al centro, ogni colonna o diagonale che si apre è un rischio concreto — arroccare appena lo sviluppo lo permette, invece di rimandarlo per inseguire altri piani, è una delle regole più ripetute (e più spesso trascurate dai principianti) in ogni manuale di apertura.",
      principle: "re-sicuro",
    },
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
