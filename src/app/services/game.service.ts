import { Injectable, signal, computed } from '@angular/core';
import { CellValue, GameState, GameWinner, MiniBoardState, Player } from '../models/game.model';

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

@Injectable({ providedIn: 'root' })
export class GameService {
  private state = signal<GameState>(this.createInitialState());

  readonly currentPlayer = computed(() => this.state().currentPlayer);
  readonly nextBoard = computed(() => this.state().nextBoard);
  readonly miniStates = computed(() => this.state().miniStates);
  readonly megaWinner = computed(() => this.state().megaWinner);
  readonly megaCells = computed(() => this.state().megaCells);

  private createInitialState(startingPlayer: Player = 'X'): GameState {
    return {
      currentPlayer: startingPlayer,
      nextBoard: null,
      miniStates: Array(9)
        .fill(null)
        .map(() => ({ cells: Array(9).fill(null), winner: null })),
      megaWinner: null,
      megaCells: Array(9).fill(null),
    };
  }

  checkWinner(cells: CellValue[]): CellValue {
    for (const [a, b, c] of WIN_LINES) {
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
    return null;
  }

  isFull(cells: CellValue[]): boolean {
    return cells.every((cell) => cell !== null);
  }

  isBoardPlayable(boardIndex: number): boolean {
    const miniState = this.state().miniStates[boardIndex];
    return !miniState.winner && !this.isFull(miniState.cells);
  }

  isBoardActive(boardIndex: number): boolean {
    const { megaWinner, nextBoard } = this.state();
    if (megaWinner) {
      return false;
    }
    if (nextBoard === null) {
      return this.isBoardPlayable(boardIndex);
    }
    return nextBoard === boardIndex && this.isBoardPlayable(boardIndex);
  }

  handleMove(boardIndex: number, cellIndex: number): { isDrawReset: boolean } {
    const currentState = this.state();
    if (currentState.megaWinner) {
      return { isDrawReset: false };
    }

    const miniState = currentState.miniStates[boardIndex];
    if (miniState.cells[cellIndex] || miniState.winner) {
      return { isDrawReset: false };
    }

    const newMiniStates: MiniBoardState[] = currentState.miniStates.map((board, index) => {
      if (index !== boardIndex) {
        return board;
      }
      return {
        ...board,
        cells: board.cells.map((cell, index) =>
          index === cellIndex ? currentState.currentPlayer : cell,
        ),
      };
    });

    const updatedCells = newMiniStates[boardIndex].cells;
    const miniWinner = this.checkWinner(updatedCells);
    const newMegaCells = [...currentState.megaCells];
    let isDrawReset = false;

    if (miniWinner) {
      newMiniStates[boardIndex] = { ...newMiniStates[boardIndex], winner: miniWinner };
      newMegaCells[boardIndex] = miniWinner;
    } else if (this.isFull(updatedCells)) {
      isDrawReset = true;
      newMiniStates[boardIndex] = { cells: Array(9).fill(null), winner: null };
    }

    const megaWinner = this.checkWinner(newMegaCells) as GameWinner;
    const allFull = newMegaCells.every((cell) => cell !== null);
    const finalMegaWinner: GameWinner = megaWinner || (allFull ? 'D' : null);

    const candidate = cellIndex;
    const nextBoard = this.isBoardPlayableFromState(candidate, newMiniStates) ? candidate : null;
    const nextPlayer: Player = currentState.currentPlayer === 'X' ? 'O' : 'X';

    this.state.set({
      currentPlayer: finalMegaWinner ? currentState.currentPlayer : nextPlayer,
      nextBoard: finalMegaWinner ? null : nextBoard,
      miniStates: newMiniStates,
      megaWinner: finalMegaWinner,
      megaCells: newMegaCells,
    });

    return { isDrawReset };
  }

  private isBoardPlayableFromState(boardIndex: number, miniStates: MiniBoardState[]): boolean {
    const miniState = miniStates[boardIndex];
    return !miniState.winner && !this.isFull(miniState.cells);
  }

  resetGame(startingPlayer: Player = 'X'): void {
    this.state.set(this.createInitialState(startingPlayer));
  }
}
