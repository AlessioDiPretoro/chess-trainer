type Props = {
  moves: string[];
};

export function MoveList({ moves }: Props) {
  if (moves.length === 0) {
    return <p className="status-line">Nessuna mossa giocata.</p>;
  }

  const pairs: Array<[string, string | undefined]> = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push([moves[i], moves[i + 1]]);
  }

  return (
    <div className="move-list">
      {pairs.map(([white, black], index) => (
        <span className="move-pair" key={index}>
          <span className="move-number">{index + 1}.</span> {white}
          {black ? ` ${black}` : ""}
        </span>
      ))}
    </div>
  );
}
