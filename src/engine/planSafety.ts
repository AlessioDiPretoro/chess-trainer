import type { Chess } from "chess.js";
import { engineDepthFor, type StockfishEngine } from "./stockfish";

const BLUNDER_THRESHOLD_CP = 250;
const MATE_SCORE = 100000;

function signedScore(scoreCp: number | undefined, scoreMate: number | undefined): number {
  if (scoreMate !== undefined) return scoreMate > 0 ? MATE_SCORE : -MATE_SCORE;
  return scoreCp ?? 0;
}

/** Chiede al motore la sua mossa migliore nella posizione attuale, applicandola su `chess`. */
async function playEngineBestMove(chess: Chess, engine: StockfishEngine, difficulty: number): Promise<string> {
  const { bestMove } = await engine.getBestMove(chess.fen(), engineDepthFor(difficulty));
  const move = chess.move({
    from: bestMove.slice(0, 2),
    to: bestMove.slice(2, 4),
    promotion: bestMove.slice(4, 5) || undefined,
  });
  if (!move) {
    // nessuna mossa valida restituita dal motore (es. posizione già terminata): non facciamo nulla
    throw new Error(`Il motore non ha trovato una mossa valida in questa posizione (fen: ${chess.fen()})`);
  }
  return move.san;
}

/**
 * Applica la mossa pianificata `san` su `chess` SOLO se è ancora legale e non è un
 * errore grossolano nella posizione attuale (la partita reale può essersi allontanata
 * dalla linea principale del corso). In caso contrario ricorre alla mossa migliore del
 * motore, così il "recupero" automatico delle lezioni non si blocca né regala materiale.
 */
export async function applyPlannedMove(
  chess: Chess,
  san: string,
  engine: StockfishEngine,
  difficulty: number
): Promise<string> {
  if (chess.isGameOver()) {
    throw new Error("Partita già terminata: impossibile applicare altre mosse del piano.");
  }

  if (!chess.moves().includes(san)) {
    return playEngineBestMove(chess, engine, difficulty);
  }

  const checkDepth = Math.min(engineDepthFor(difficulty), 10);
  const before = await engine.analyze(chess.fen(), checkDepth);
  const bestEval = signedScore(before.scoreCp, before.scoreMate);

  const move = chess.move(san);
  if (!move) {
    // non dovrebbe succedere visto il controllo sopra, ma per sicurezza ricorriamo al motore
    return playEngineBestMove(chess, engine, difficulty);
  }

  if (chess.isGameOver()) {
    return move.san;
  }

  const after = await engine.analyze(chess.fen(), checkDepth);
  // "after" è dal punto di vista dell'avversario (il turno è passato): lo riportiamo al
  // punto di vista di chi ha appena mosso per confrontarlo con "bestEval".
  const ownEval = -signedScore(after.scoreCp, after.scoreMate);

  if (bestEval - ownEval > BLUNDER_THRESHOLD_CP) {
    chess.undo();
    return playEngineBestMove(chess, engine, difficulty);
  }

  return move.san;
}
