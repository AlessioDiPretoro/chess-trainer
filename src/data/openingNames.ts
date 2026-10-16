import { courses } from "./courses";
import { curatedOpeningNames } from "./openingNamesCurated";
import { getMainLineBookMove } from "../engine/openingBook";
import type { MoveSuggestion, OpeningMatch } from "../types/openingName";

function buildCuratedMap(): Record<string, OpeningMatch> {
  const map: Record<string, OpeningMatch> = {};
  for (const entry of curatedOpeningNames) {
    map[entry.moves.join(" ")] = { name: entry.name };
  }
  return map;
}

/**
 * Per ogni corso già presente nell'app, ricostruisce la sua "linea principale"
 * (piano + risposta di libro con peso maggiore ad ogni bivio, la stessa usata nelle
 * lezioni guidate) e marca ogni posizione lungo quella linea con il nome del corso.
 * Così la terminologia resta coerente con quella usata nelle lezioni, e questi dati
 * restano sincronizzati automaticamente se un corso viene modificato in futuro.
 */
function buildCourseMap(): Record<string, OpeningMatch> {
  const map: Record<string, OpeningMatch> = {};
  for (const course of courses) {
    const history: string[] = [];

    if (course.playerColor === "black") {
      const firstReply = getMainLineBookMove(course.book, history);
      if (!firstReply) continue;
      history.push(firstReply);
      map[history.join(" ")] = { name: course.name, courseId: course.id };
    }

    for (const step of course.plan) {
      history.push(step.san);
      map[history.join(" ")] = { name: course.name, courseId: course.id };

      const reply = getMainLineBookMove(course.book, history);
      if (!reply) break;
      history.push(reply);
      map[history.join(" ")] = { name: course.name, courseId: course.id };
    }
  }
  return map;
}

// I nomi derivati dai corsi hanno la precedenza sulle voci generiche quando le chiavi
// coincidono (es. "Apertura Spagnola" generica vs il corso Ruy Lopez completo).
export const openingNameBook: Record<string, OpeningMatch> = {
  ...buildCuratedMap(),
  ...buildCourseMap(),
};

export function lookupOpeningName(historySan: string[]): OpeningMatch | null {
  return openingNameBook[historySan.join(" ")] ?? null;
}

/**
 * Tra le mosse legali nella posizione attuale, restituisce solo quelle che portano
 * a uno schema noto (curato o di un corso), indicando se proseguono lo schema
 * attuale o ne aprono uno diverso. Usata per consigliare "dove si va" prima di
 * muovere, non solo "qual è la mossa migliore".
 */
export function suggestKnownMoves(historySan: string[], legalMoves: string[]): MoveSuggestion[] {
  const currentName = lookupOpeningName(historySan)?.name ?? null;
  const prefix = historySan.join(" ");
  const suggestions: MoveSuggestion[] = [];

  for (const san of legalMoves) {
    const key = prefix ? `${prefix} ${san}` : san;
    const match = openingNameBook[key];
    if (match) {
      suggestions.push({ san, resultingName: match.name, continuesCurrent: match.name === currentName });
    }
  }

  return suggestions;
}

/**
 * Quando non c'è nessuna continuazione precisa da qui (`suggestKnownMoves` vuoto,
 * perché per quell'apertura non abbiamo registrato mosse successive), propone comunque
 * mosse "ispirate" ad altri schemi noti: guarda ogni mossa legale come se fosse una
 * prima mossa isolata, e la segnala se corrisponde a un'apertura nota a quel livello.
 * Non è teoria precisa (il resto della storia non c'entra), quindi va presentata
 * all'utente come idea di stile, non come continuazione della riga esatta.
 */
export function suggestStyleIdeas(legalMoves: string[]): MoveSuggestion[] {
  const ideas: MoveSuggestion[] = [];
  for (const san of legalMoves) {
    const match = openingNameBook[san];
    if (match) {
      ideas.push({ san, resultingName: match.name, continuesCurrent: false });
    }
  }
  return ideas;
}
