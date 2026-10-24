import type { GameOutcome } from "./gameEnd";

/**
 * Suoni di fine partita generati al volo con la Web Audio API: nessun file audio da
 * scaricare/licenziare, gratis, funziona offline. Il contesto viene creato/ripreso alla
 * prima chiamata (di norma dentro un gesto dell'utente, es. una mossa), poi resta attivo
 * per il resto della sessione anche per suoni innescati più avanti da una mossa del motore.
 */
let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
  return audioCtx;
}

function playTone(ctx: AudioContext, freq: number, startTime: number, duration: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

const MELODIES: Record<GameOutcome, [frequency: number, offset: number, duration: number][]> = {
  win: [
    [523.25, 0, 0.15],
    [659.25, 0.15, 0.15],
    [783.99, 0.3, 0.35],
  ],
  loss: [
    [392.0, 0, 0.2],
    [329.63, 0.2, 0.2],
    [261.63, 0.4, 0.4],
  ],
  draw: [
    [440.0, 0, 0.18],
    [440.0, 0.25, 0.3],
  ],
};

export function playGameEndSound(outcome: GameOutcome): void {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  for (const [freq, offset, duration] of MELODIES[outcome]) {
    playTone(ctx, freq, now + offset, duration);
  }
}
