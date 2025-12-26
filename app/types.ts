export enum GameContext {
  DICE = 'Dice Roll',
  COIN = 'Coin Flip',
}

export interface RollResult {
  id: string;
  value: number; // 1-6 for dice, 1 (Heads) or 2 (Tails) for coin
  prediction: number;
  stake: string;
  context: GameContext;
  timestamp: number;
  isWin: boolean;
}

export interface DiceProps {
  value: number;
  isRolling: boolean;
  onAnimationComplete?: () => void;
}

export interface CoinProps {
  value: number; // 1 for Heads, 2 for Tails
  isFlipping: boolean;
  onAnimationComplete?: () => void;
}
