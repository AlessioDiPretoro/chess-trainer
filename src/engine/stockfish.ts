/** Profondità di ricerca in base alla difficoltà (0-20): usata per analisi/suggerimenti, non per la forza dell'avversario (vedi `setStrength`). */
export function engineDepthFor(difficulty: number): number {
  const clamped = Math.max(0, Math.min(20, difficulty));
  return 8 + Math.round((clamped / 20) * 10);
}

/**
 * Tempo di ricerca per la mossa dell'avversario: fisso e non legato alla difficoltà (così
 * la risposta resta sempre rapida), non una profondità. La forza è calibrata via
 * `setStrength` (UCI_Elo), pensato per funzionare con una ricerca normale: limitarla
 * ulteriormente non la rende più debole in modo prevedibile, anzi impedisce al
 * meccanismo di Elo di funzionare come progettato (in Stockfish "Skill Level"/profondità
 * bassa da sole non producono gli errori "da umano" che UCI_Elo invece simula correttamente).
 */
const OPPONENT_MOVETIME_MS = 800;

const MIN_ELO = 600;
const MAX_ELO = 3190;

/**
 * Elo "reale" minimo che Stockfish accetta per UCI_Elo: sotto questa soglia il motore da
 * solo non scende (la calibrazione interna di Stockfish non va più in basso). Per le
 * difficoltà mappate su un Elo stimato più basso (vedi `eloFor`), il motore viene comunque
 * tenuto a questo floor e la debolezza aggiuntiva viene simulata altrove (vedi
 * `pickOpponentMove` in opponent.ts, che aggiunge mosse casuali con probabilità crescente
 * quanto più l'Elo stimato scende sotto questa soglia).
 */
export const ENGINE_ELO_FLOOR = 1320;

/** Elo stimato (600-3190) per un livello di difficoltà 0-20: sotto 1320 è "intento", non quello che Stockfish gioca da solo. */
export function eloFor(difficulty: number): number {
  const clamped = Math.max(0, Math.min(20, difficulty));
  return Math.round(MIN_ELO + (clamped / 20) * (MAX_ELO - MIN_ELO));
}

export type EngineAnalysis = {
  bestMove: string;
  ponderMove?: string;
  /** Valutazione in centipawn dal punto di vista di chi deve muovere nella FEN analizzata. */
  scoreCp?: number;
  /** Se presente, matto in N mosse (positivo = a favore di chi muove, negativo = a favore dell'altro). */
  scoreMate?: number;
};

/**
 * Wrapper UCI su Stockfish eseguito in un Web Worker. Le richieste vengono
 * accodate ed eseguite una alla volta, perché il motore gestisce un solo
 * comando "go" per volta.
 */
export class StockfishEngine {
  private worker: Worker;
  private readyPromise: Promise<void>;
  private queue: Promise<unknown> = Promise.resolve();

  constructor() {
    this.worker = new Worker(`${import.meta.env.BASE_URL}stockfish/stockfish-19-lite-single.js`);
    const handshake = new Promise<void>((resolve) => {
      const onReady = (event: MessageEvent<string>) => {
        if (event.data === "uciok") {
          this.worker.removeEventListener("message", onReady);
          resolve();
        }
      };
      this.worker.addEventListener("message", onReady);
      this.worker.postMessage("uci");
    });
    // non restiamo bloccati per sempre se il worker non risponde (es. errore di caricamento del motore)
    const timeout = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error("Timeout avvio motore Stockfish")), 10000);
    });
    this.readyPromise = Promise.race([handshake, timeout]);
  }

  private enqueue<T>(task: () => Promise<T>): Promise<T> {
    const result = this.queue.then(task, task);
    this.queue = result.then(
      () => undefined,
      () => undefined
    );
    return result;
  }

  /**
   * Calibra la forza su un Elo stimato (UCI_LimitStrength + UCI_Elo), non sulla vecchia
   * opzione "Skill Level": quest'ultima rende le scelte meno precise ma non produce gli
   * errori tattici "da umano debole" che un giocatore di basso livello farebbe davvero
   * (a livello 3 restava fortissimo). UCI_Elo è pensato apposta per questo e Stockfish lo
   * calibra internamente, quindi va usato con una ricerca normale (`OPPONENT_SEARCH_DEPTH`),
   * non con una profondità già ridotta. Privato: solo `getOpponentMove` lo usa, per
   * garantire che la forza venga sempre ripristinata subito dopo, senza rischiare di
   * lasciare "debole" il motore condiviso anche per i suggerimenti/l'analisi del giocatore.
   */
  private async setStrength(difficulty: number): Promise<void> {
    return this.enqueue(async () => {
      await this.readyPromise;
      const clamped = Math.max(0, Math.min(20, difficulty));
      if (clamped >= 20) {
        this.worker.postMessage("setoption name UCI_LimitStrength value false");
      } else {
        this.worker.postMessage("setoption name UCI_LimitStrength value true");
        this.worker.postMessage(`setoption name UCI_Elo value ${Math.max(ENGINE_ELO_FLOOR, eloFor(clamped))}`);
      }
    });
  }

  private runGo(fen: string, goCommand: string): Promise<EngineAnalysis> {
    return this.enqueue(async () => {
      await this.readyPromise;
      return new Promise<EngineAnalysis>((resolve) => {
        let scoreCp: number | undefined;
        let scoreMate: number | undefined;

        const onMessage = (event: MessageEvent<string>) => {
          if (typeof event.data !== "string") return;
          const data = event.data;
          if (data.startsWith("info")) {
            const cpMatch = data.match(/score cp (-?\d+)/);
            const mateMatch = data.match(/score mate (-?\d+)/);
            if (mateMatch) {
              scoreMate = parseInt(mateMatch[1], 10);
              scoreCp = undefined;
            } else if (cpMatch) {
              scoreCp = parseInt(cpMatch[1], 10);
              scoreMate = undefined;
            }
          } else if (data.startsWith("bestmove")) {
            this.worker.removeEventListener("message", onMessage);
            const parts = data.split(" ");
            resolve({ bestMove: parts[1], ponderMove: parts[3], scoreCp, scoreMate });
          }
        };

        this.worker.addEventListener("message", onMessage);
        this.worker.postMessage(`position fen ${fen}`);
        this.worker.postMessage(goCommand);
      });
    });
  }

  /** Analizza una posizione a profondità fissa e restituisce la mossa migliore con la relativa valutazione. */
  async analyze(fen: string, depth = 12): Promise<EngineAnalysis> {
    return this.runGo(fen, `go depth ${depth}`);
  }

  /**
   * Come `analyze`, ma con un tempo massimo invece di una profondità fissa: utile per
   * analisi in batch (es. la revisione di un'intera partita), dove un tempo totale
   * prevedibile conta più della profondità esatta raggiunta in ogni posizione.
   */
  async analyzeByTime(fen: string, movetimeMs: number): Promise<EngineAnalysis> {
    return this.runGo(fen, `go movetime ${movetimeMs}`);
  }

  async getBestMove(fen: string, depth = 12): Promise<EngineAnalysis> {
    return this.analyze(fen, depth);
  }

  /**
   * Mossa dell'avversario calibrata sulla difficoltà: abbassa la forza solo per questa
   * ricerca e la ripristina subito dopo (anche in caso di errore), così le chiamate
   * successive sullo stesso motore (suggerimenti, valutazioni per i commenti/la
   * revisione) restano sempre a piena forza.
   */
  async getOpponentMove(fen: string, difficulty: number): Promise<EngineAnalysis> {
    await this.setStrength(difficulty);
    try {
      return await this.runGo(fen, `go movetime ${OPPONENT_MOVETIME_MS}`);
    } finally {
      await this.setStrength(20);
    }
  }

  terminate(): void {
    this.worker.terminate();
  }
}
