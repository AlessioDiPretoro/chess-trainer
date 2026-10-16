import type { Chess } from "chess.js";
import type { OpeningBook } from "../types/course";
import { getBookMove, getMainLineBookMove } from "./openingBook";
import { engineDepthFor, type StockfishEngine } from "./stockfish";

/**
 * Sceglie e gioca la mossa dell'avversario su `chess` (side effect), restituendo
 * la mossa in SAN. Prova prima il libro (per restare "in teoria" al livello
 * scelto), poi ricorre al motore se la posizione è fuori dal libro.
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

  await engine.setSkillLevel(difficulty);
  const { bestMove } = await engine.getBestMove(chess.fen(), engineDepthFor(difficulty));
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
