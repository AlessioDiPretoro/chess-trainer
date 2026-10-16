export type ChessPrinciple = {
  title: string;
  description: string;
};

/**
 * Principi generali di strategia scacchistica, validi a prescindere dall'apertura
 * specifica. Vengono richiamati dai singoli step dei corsi (campo `principle`) per
 * collegare "questa mossa" al ragionamento più ampio che la giustifica — lo scopo è
 * far capire il *perché*, non solo imparare una sequenza a memoria. Il riferimento è
 * alla teoria classica dell'apertura (Capablanca, "Chess Fundamentals"; Nimzowitsch,
 * "My System"; Reuben Fine, "The Ideas Behind the Chess Openings"; Chernev, "Logical
 * Chess Move by Move").
 */
export const chessPrinciples: Record<string, ChessPrinciple> = {
  centro: {
    title: "Controllo del centro",
    description:
      "Le quattro case centrali (d4, d5, e4, e5) sono le più preziose della scacchiera: un pezzo piazzato lì (o che le controlla) tocca più case ed è pronto a intervenire su entrambi i lati. Capablanca lo metteva al primo posto della sua lista di priorità nell'apertura: chi controlla il centro limita la mobilità dell'avversario e si assicura spazio per manovrare i propri pezzi. Per questo quasi ogni apertura seria inizia spingendo o comunque influenzando un pedone centrale.",
  },
  sviluppo: {
    title: "Sviluppo rapido ed efficiente",
    description:
      "Ogni pezzo fermo sulla casa di partenza è un pezzo che non sta contribuendo alla partita. Il principio classico (Capablanca, Reuben Fine) è: sviluppa i cavalli e gli alfieri verso case attive prima di spostare due volte lo stesso pezzo o di portare in campo la donna troppo presto, dove può diventare bersaglio di mosse di sviluppo avversarie (perdendo a te un tempo prezioso). Idealmente ogni mossa di sviluppo fa anche qualcos'altro: minaccia, controlla una casa chiave, prepara l'arrocco.",
  },
  "re-sicuro": {
    title: "Sicurezza del re",
    description:
      "Un re lasciato al centro, specialmente mentre sono ancora in gioco molti pezzi, è un bersaglio: colonne e diagonali aperte verso di lui possono trasformarsi in attacchi decisivi nel giro di poche mosse. La regola pratica tramandata da generazioni di manuali (da Lasker a Chernev) è: completa lo sviluppo minore e arrocca presto, prima di lanciarti in piani ambiziosi. Un re al sicuro ti permette anche di giocare con più libertà altrove, perché non devi preoccuparti costantemente della sua difesa.",
  },
  struttura: {
    title: "Struttura pedonale",
    description:
      "I pedoni non possono tornare indietro: ogni spinta di pedone è una decisione permanente sulla forma della posizione. Pedoni doppiati, isolati o arretrati sono debolezze a lungo termine che un avversario attento può bersagliare per tutta la partita, anche se nell'immediato non cambiano nulla. Nimzowitsch, in 'My System', ha reso popolare l'idea di pensare alla struttura pedonale come allo scheletro della posizione: prima di spingere un pedone, vale la pena chiedersi che tipo di mediogioco quella struttura produrrà.",
  },
  tempo: {
    title: "Iniziativa e tempo",
    description:
      "In apertura ogni mossa 'persa' (che non sviluppa, non controlla il centro e non crea una minaccia reale) è un tempo regalato all'avversario, che può usarlo per completare il proprio sviluppo o lanciare un'iniziativa. Le aperture più efficaci cercano mosse che servano a più scopi contemporaneamente — sviluppare E minacciare, per esempio — così da non restare mai indietro nella corsa allo sviluppo.",
  },
  profilassi: {
    title: "Profilassi",
    description:
      "Termine reso celebre da Nimzowitsch: prima di eseguire il proprio piano, vale la pena chiedersi 'qual è il piano dell'avversario, e come posso prevenirlo in anticipo?'. Una mossa profilattica non attacca direttamente, ma toglie all'avversario una risorsa futura (una casa, una diagonale, una possibilità tattica) prima ancora che diventi un problema concreto.",
  },
  "coppia-alfieri": {
    title: "La coppia degli alfieri",
    description:
      "Due alfieri lavorano bene insieme perché, a differenza dei cavalli, controllano l'intera scacchiera (uno le case chiare, uno le scure) e la loro forza cresce man mano che la posizione si apre e le diagonali diventano libere. Per questo evitare di cederli senza una buona ragione, o puntare a conservarli, è spesso un obiettivo strategico silenzioso di molte linee di apertura.",
  },
};
