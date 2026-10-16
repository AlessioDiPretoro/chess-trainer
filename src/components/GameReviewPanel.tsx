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
};

export function GameReviewPanel({ result }: Props) {
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

      {result.turningPoints.length > 0 && (
        <>
          <h3>Punti di svolta</h3>
          <div className="lesson-list">
            {result.turningPoints.map((tp) => (
              <div className="lesson-row" key={tp.moveIndex} style={{ alignItems: "flex-start" }}>
                <span>{tp.description}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <h3>Mosse</h3>
      <div className="lesson-list lesson-list--scrollable">
        {result.moves.map((m, index) => (
          <div className="lesson-row" key={index}>
            <span>
              {m.color === "white" ? `${m.moveNumber}.` : `${m.moveNumber}...`} {m.san}
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
