import { outcomeLabel, type GameEndInfo } from "../engine/gameEnd";

type Props = {
  endInfo: GameEndInfo;
};

export function GameEndBanner({ endInfo }: Props) {
  return (
    <div className={`game-end-banner game-end-banner--${endInfo.outcome}`}>
      <div className="game-end-banner-icon">👑</div>
      <div>
        <h2>{outcomeLabel(endInfo.outcome)}</h2>
        <p>{endInfo.reason}</p>
      </div>
    </div>
  );
}
