import { Chessboard } from "react-chessboard";

type Props = {
  fen: string;
  onPieceDrop: (args: { sourceSquare: string; targetSquare: string | null }) => boolean;
  orientation?: "white" | "black";
  arrowFrom?: string;
  arrowTo?: string;
  highlightSquares?: Record<string, string>;
};

export function Board({ fen, onPieceDrop, orientation = "white", arrowFrom, arrowTo, highlightSquares }: Props) {
  const squareStyles: Record<string, React.CSSProperties> = {};
  if (highlightSquares) {
    for (const [square, color] of Object.entries(highlightSquares)) {
      squareStyles[square] = { boxShadow: `inset 0 0 0 3px ${color}` };
    }
  }

  return (
    <div className="board-wrap">
      <Chessboard
        options={{
          position: fen,
          onPieceDrop,
          boardOrientation: orientation,
          darkSquareStyle: { backgroundColor: "#5c7a4a" },
          lightSquareStyle: { backgroundColor: "#ead9b9" },
          squareStyles,
          arrows: arrowFrom && arrowTo ? [{ startSquare: arrowFrom, endSquare: arrowTo, color: "rgba(74, 222, 128, 0.85)" }] : [],
          animationDurationInMs: 200,
        }}
      />
    </div>
  );
}
