/** Profondità di ricerca in base alla difficoltà (0-20): da alle basse difficoltà a sfidante alle alte. */
export function engineDepthFor(difficulty: number): number {
  const clamped = Math.max(0, Math.min(20, difficulty));
  return 8 + Math.round((clamped / 20) * 10);
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

  async setSkillLevel(level: number): Promise<void> {
    return this.enqueue(async () => {
      await this.readyPromise;
      const clamped = Math.max(0, Math.min(20, level));
      this.worker.postMessage(`setoption name Skill Level value ${clamped}`);
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

  terminate(): void {
    this.worker.terminate();
  }
}
