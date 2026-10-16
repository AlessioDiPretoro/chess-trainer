import { Chess, type Square } from "chess.js";
import { useState } from "react";
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
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [fenAtSelection, setFenAtSelection] = useState(fen);

  // la posizione può cambiare per una mossa dell'avversario, un annullamento, ecc.:
  // la selezione precedente non ha più senso, quindi la azzeriamo durante il render
  // (non in un effect) non appena ce ne accorgiamo, seguendo il pattern React per
  // "adattare lo stato quando cambia una prop".
  if (fen !== fenAtSelection) {
    setFenAtSelection(fen);
    setSelectedSquare(null);
  }

  const legalMovesFromSelection = selectedSquare
    ? new Chess(fen).moves({ square: selectedSquare, verbose: true })
    : [];

  function handleSquareClick({ square }: { square: string }) {
    if (selectedSquare) {
      const targetMove = legalMovesFromSelection.find((m) => m.to === square);
      if (targetMove) {
        const moved = onPieceDrop({ sourceSquare: selectedSquare, targetSquare: square });
        if (moved) {
          setSelectedSquare(null);
          return;
        }
      }
    }

    const chess = new Chess(fen);
    const piece = chess.get(square as Square);
    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(square === selectedSquare ? null : (square as Square));
    } else {
      setSelectedSquare(null);
    }
  }

  const squareStyles: Record<string, React.CSSProperties> = {};
  if (highlightSquares) {
    for (const [square, color] of Object.entries(highlightSquares)) {
      squareStyles[square] = { boxShadow: `inset 0 0 0 3px ${color}` };
    }
  }

  if (selectedSquare) {
    squareStyles[selectedSquare] = { boxShadow: "inset 0 0 0 3px rgba(74, 222, 128, 0.85)" };
    for (const move of legalMovesFromSelection) {
      squareStyles[move.to] = move.captured
        ? { boxShadow: "inset 0 0 0 4px rgba(74, 222, 128, 0.75)" }
        : { backgroundImage: "radial-gradient(circle, rgba(74, 222, 128, 0.55) 18%, transparent 19%)" };
    }
  }

  return (
    <div className="board-wrap">
      <Chessboard
        options={{
          position: fen,
          onPieceDrop,
          onSquareClick: handleSquareClick,
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
