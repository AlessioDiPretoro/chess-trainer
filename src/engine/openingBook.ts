import type { OpeningBook } from "../types/course";

/**
 * Sceglie una risposta nota dal libro per la posizione raggiunta da `historySan`.
 * Restituisce null se la posizione non è nel libro: in quel caso l'avversario
 * deve ricorrere al motore (Stockfish) per continuare la partita.
 */
export function getBookMove(
  book: OpeningBook,
  historySan: string[],
  level: number
): string | null {
  const key = historySan.join(" ");
  const replies = book[key];
  if (!replies) return null;

  const available = replies.filter((reply) => reply.minLevel <= level);
  if (available.length === 0) return null;

  const totalWeight = available.reduce((sum, reply) => sum + reply.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const reply of available) {
    roll -= reply.weight;
    if (roll <= 0) return reply.san;
  }
  return available[available.length - 1].san;
}

/**
 * Risposta "di linea principale" per la posizione raggiunta da `historySan`: sempre
 * la stessa (quella con peso maggiore nel libro), senza scelta casuale né dipendenza
 * dalla difficoltà. Usata nelle lezioni guidate, dove la sequenza deve restare
 * coerente con la spiegazione del corso, non imprevedibile come in partita libera.
 */
export function getMainLineBookMove(book: OpeningBook, historySan: string[]): string | null {
  const key = historySan.join(" ");
  const replies = book[key];
  if (!replies || replies.length === 0) return null;
  return replies.reduce((best, reply) => (reply.weight > best.weight ? reply : best), replies[0]).san;
}
