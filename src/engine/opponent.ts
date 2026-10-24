import type { Chess } from "chess.js";
import type { OpeningBook } from "../types/course";
import { getBookMove, getMainLineBookMove } from "./openingBook";
import { eloFor, engineDepthFor, ENGINE_ELO_FLOOR, type StockfishEngine } from "./stockfish";

/**
 * Sotto il floor reale di UCI_Elo di Stockfish (1320), il motore non può scendere oltre
 * da solo (vedi `ENGINE_ELO_FLOOR`): per le difficoltà pensate per un Elo stimato più
 * basso, qui aggiungiamo una probabilità di giocare una mossa legale a caso invece di
 * affidarci al motore, così il livello più basso è davvero debole (~600 Elo) e non "finto
 * debole". Probabilità 0 non appena l'Elo stimato raggiunge il floor reale del motore.
 */
function weakRandomMoveProbability(difficulty: number): number {
  const targetElo = eloFor(difficulty);
  if (targetElo >= ENGINE_ELO_FLOOR) return 0;
  return (ENGINE_ELO_FLOOR - targetElo) / (ENGINE_ELO_FLOOR - eloFor(0));
}

/** Mossa dell'avversario (oggetto from/to/promotion) calibrata sulla difficoltà: motore o, alle difficoltà più basse, a volte una mossa a caso. */
export async function pickOpponentMove(
  chess: Chess,
  engine: StockfishEngine,
  difficulty: number
): Promise<{ from: string; to: string; promotion?: string }> {
  if (Math.random() < weakRandomMoveProbability(difficulty)) {
    const legalMoves = chess.moves({ verbose: true });
    const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    return { from: randomMove.from, to: randomMove.to, promotion: randomMove.promotion || undefined };
  }
  const { bestMove } = await engine.getOpponentMove(chess.fen(), difficulty);
  return { from: bestMove.slice(0, 2), to: bestMove.slice(2, 4), promotion: bestMove.slice(4, 5) || undefined };
}

/**
 * Sceglie e gioca la mossa dell'avversario su `chess` (side effect), restituendo
 * la mossa in SAN. Prova prima il libro (per restare "in teoria" al livello
 * scelto), poi ricorre al motore (o a una mossa casuale, vedi `pickOpponentMove`)
 * se la posizione è fuori dal libro.
 */
export async function playOpponentMove(
  chess: Chess,
  book: OpeningBook,
  difficulty: number,
  engine: StockfishEngine
): Promise<string> {
  const historySan = chess.history();
  const bookSan = getBookMove(book, historySan, difficulty);
  if (bookSan) {
    const move = chess.move(bookSan);
    if (move) return move.san;
  }

  const { from, to, promotion } = await pickOpponentMove(chess, engine, difficulty);
  const move = chess.move({ from, to, promotion });
  if (!move) {
    throw new Error(`Mossa dell'avversario non applicabile (${from}${to}) per fen ${chess.fen()}`);
  }
  return move.san;
}

/**
 * Come `playOpponentMove`, ma per le lezioni guidate: gioca sempre la stessa risposta
 * "di linea principale" del libro (niente scelta casuale né dipendenza dalla
 * difficoltà), così la sequenza resta coerente con la spiegazione del corso. Solo
 * fuori dal libro ricorre al motore, usando la profondità più alta per restare fedele
 * alla teoria anche lì.
 */
export async function playScriptedOpponentMove(chess: Chess, book: OpeningBook, engine: StockfishEngine): Promise<string> {
  const historySan = chess.history();
  const bookSan = getMainLineBookMove(book, historySan);
  if (bookSan) {
    const move = chess.move(bookSan);
    if (move) return move.san;
  }

  const { bestMove } = await engine.getBestMove(chess.fen(), engineDepthFor(20));
  const move = chess.move({
    from: bestMove.slice(0, 2),
    to: bestMove.slice(2, 4),
    promotion: bestMove.slice(4, 5) || undefined,
  });
  if (!move) {
    throw new Error(`Il motore ha restituito una mossa non applicabile ("${bestMove}") per fen ${chess.fen()}`);
  }
  return move.san;
}
