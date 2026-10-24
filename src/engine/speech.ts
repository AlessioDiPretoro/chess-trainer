/**
 * Sintesi vocale per i commenti dell'istruttore, via Web Speech API: gratis, nessuna
 * chiave/API esterna, integrata nel browser (niente da aggiungere al bundle).
 */

let lastSpokenText: string | null = null;

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Legge il testo ad alta voce, interrompendo qualunque lettura precedente ancora in corso. */
export function speakText(text: string): void {
  if (!isSpeechSupported() || !text) return;
  if (lastSpokenText === text) return;
  lastSpokenText = text;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "it-IT";
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  lastSpokenText = null;
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}
