type PromotionPiece = "q" | "r" | "b" | "n";

const OPTIONS: { value: PromotionPiece; label: string; symbol: string }[] = [
  { value: "q", label: "Donna", symbol: "♛" },
  { value: "r", label: "Torre", symbol: "♜" },
  { value: "b", label: "Alfiere", symbol: "♝" },
  { value: "n", label: "Cavallo", symbol: "♞" },
];

type Props = {
  onChoose: (piece: PromotionPiece) => void;
  onCancel: () => void;
};

export function PromotionPicker({ onChoose, onCancel }: Props) {
  return (
    <div className="card explanation-card">
      <h3>Promozione del pedone</h3>
      <p>In cosa vuoi promuovere il pedone?</p>
      <div className="btn-row">
        {OPTIONS.map((option) => (
          <button key={option.value} className="btn" onClick={() => onChoose(option.value)}>
            {option.symbol} {option.label}
          </button>
        ))}
      </div>
      <div className="btn-row">
        <button className="btn" onClick={onCancel}>
          Annulla
        </button>
      </div>
    </div>
  );
}

export type { PromotionPiece };
