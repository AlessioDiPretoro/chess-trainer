import { useEffect, useRef, useState } from "react";

type Props = {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onRematch: () => void;
  onExit: () => void;
  /** Se presente, mostra il pulsante "Suggerimento" di fianco alle frecce. */
  onHint?: () => void;
  hintDisabled?: boolean;
  /** Se presente, mostra il pulsante per attivare/disattivare la voce dell'istruttore. */
  onToggleVoice?: () => void;
  voiceEnabled?: boolean;
};

export function BoardControls({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onRematch,
  onExit,
  onHint,
  hintDisabled,
  onToggleVoice,
  voiceEnabled,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="board-controls">
      <div className="options-menu-wrap" ref={wrapRef}>
        <button className="btn" onClick={() => setMenuOpen((o) => !o)}>
          ⚙ Opzioni
        </button>
        {menuOpen && (
          <div className="options-dropdown">
            <button
              className="btn"
              onClick={() => {
                setMenuOpen(false);
                onRematch();
              }}
            >
              Rivincita
            </button>
            <button
              className="btn"
              onClick={() => {
                setMenuOpen(false);
                onExit();
              }}
            >
              Esci
            </button>
          </div>
        )}
      </div>

      <div className="board-controls-right">
        {onToggleVoice && (
          <button
            className="btn"
            onClick={onToggleVoice}
            title={voiceEnabled ? "Disattiva la voce dell'istruttore" : "Attiva la voce dell'istruttore"}
            aria-label="Voce dell'istruttore"
          >
            {voiceEnabled ? "🔊" : "🔇"}
          </button>
        )}
        {onHint && (
          <button className="btn" onClick={onHint} disabled={hintDisabled} title="Suggerimento" aria-label="Suggerimento">
            💡 Suggerimento
          </button>
        )}
        <div className="move-nav">
          <button
            className="btn move-nav-btn"
            onClick={onUndo}
            disabled={!canUndo}
            title="Mossa precedente"
            aria-label="Mossa precedente"
          >
            ◄
          </button>
          <button
            className="btn move-nav-btn"
            onClick={onRedo}
            disabled={!canRedo}
            title="Mossa successiva"
            aria-label="Mossa successiva"
          >
            ►
          </button>
        </div>
      </div>
    </div>
  );
}
