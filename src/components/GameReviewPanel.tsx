import type { GameReviewResult, MoveQuality } from "../types/gameReview";

const QUALITY_LABEL: Record<MoveQuality, string> = {
  best: "Ottima",
  good: "Buona",
  inaccuracy: "Imprecisione",
  mistake: "Errore",
  blunder: "Abbaglio",
};

const QUALITY_CLASS: Record<MoveQuality, string> = {
  best: "move-quality-best",
  good: "move-quality-good",
  inaccuracy: "move-quality-inaccuracy",
  mistake: "move-quality-mistake",
  blunder: "move-quality-blunder",
};

type Props = {
  result: GameReviewResult;
  /** -1 = posizione iniziale, altrimenti indice della mossa mostrata sulla scacchiera. */
  currentIndex: number;
  onSelectIndex: (index: number) => void;
};

export function GameReviewPanel({ result, currentIndex, onSelectIndex }: Props) {
  const currentMove = currentIndex >= 0 ? result.moves[currentIndex] : null;

  return (
    <div className="card explanation-card">
      <h3>Revisione partita</h3>
      {result.openingName && (
        <p className="status-line">
          Apertura riconosciuta: <strong>{result.openingName}</strong>
        </p>
      )}
      <p className="status-line">
        Precisione media: <strong>{result.playerAccuracyLabel}</strong> (perdita media di circa{" "}
        {(result.playerAverageCentipawnLoss / 100).toFixed(2)} pedoni a mossa)
      </p>
      <p className="status-line">Usa le frecce ◄ ► sotto la scacchiera per scorrere le mosse della partita.</p>

      <div className={`card deviation-banner ${currentMove && (currentMove.quality === "best" || currentMove.quality === "good") ? "good" : ""}`}>
        {currentMove ? (
          <>
            <p>
              <strong>
                {currentMove.moveNumber}
                {currentMove.color === "white" ? "." : "..."} {currentMove.san}
              </strong>{" "}
              <span className={QUALITY_CLASS[currentMove.quality]}>{QUALITY_LABEL[currentMove.quality]}</span>
            </p>
            <p>{currentMove.comment}</p>
          </>
        ) : (
          <p>Posizione iniziale. Scorri in avanti con ► per rivedere la partita mossa per mossa.</p>
        )}
      </div>

      {result.turningPoints.length > 0 && (
        <>
          <h3>Punti di svolta</h3>
          <div className="lesson-list">
            {result.turningPoints.map((tp) => (
              <div
                className="lesson-row"
                key={tp.moveIndex}
                style={{ alignItems: "flex-start", cursor: "pointer" }}
                onClick={() => onSelectIndex(tp.moveIndex)}
              >
                <span>{tp.description}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <h3>Mosse</h3>
      <div className="lesson-list lesson-list--scrollable">
        {result.moves.map((m, index) => (
          <div
            className={`lesson-row ${index === currentIndex ? "completed" : ""}`}
            key={index}
            style={{ cursor: "pointer" }}
            onClick={() => onSelectIndex(index)}
          >
            <span>
              {m.moveNumber}
              {m.color === "white" ? "." : "..."} {m.san}
              {m.bestMoveSan && m.quality !== "best" && m.quality !== "good" && (
                <span className="status-line"> (meglio {m.bestMoveSan})</span>
              )}
            </span>
            <span className={QUALITY_CLASS[m.quality]}>{QUALITY_LABEL[m.quality]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
