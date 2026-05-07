export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type GameWinner = Player | 'D' | null;

export interface MiniBoardState {
  cells: CellValue[];
  winner: CellValue;
}

export interface GameState {
  currentPlayer: Player;
  nextBoard: number | null;
  miniStates: MiniBoardState[];
  megaWinner: GameWinner;
  megaCells: CellValue[];
}
