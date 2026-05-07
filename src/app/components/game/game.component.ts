import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { MiniBoardComponent } from '../mini-board/mini-board.component';
import { TurnDisplayComponent } from '../turn-display/turn-display.component';
import { WinOverlayComponent } from '../win-overlay/win-overlay.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [MiniBoardComponent, TurnDisplayComponent, WinOverlayComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  private gameService = inject(GameService);
  private router = inject(Router);

  readonly currentPlayer = this.gameService.currentPlayer;
  readonly nextBoard = this.gameService.nextBoard;
  readonly miniStates = this.gameService.miniStates;
  readonly megaWinner = this.gameService.megaWinner;

  readonly drawResetCounters = signal<number[]>(Array(9).fill(0));

  getBoardIndexes(): number[] {
    return Array.from({ length: 9 }, (_, index) => index);
  }

  isBoardActive(boardIndex: number): boolean {
    return this.gameService.isBoardActive(boardIndex);
  }

  isBoardFull(boardIndex: number): boolean {
    return this.gameService.isFull(this.miniStates()[boardIndex].cells);
  }

  onCellPlayed(boardIndex: number, cellIndex: number): void {
    const { isDrawReset } = this.gameService.handleMove(boardIndex, cellIndex);
    if (isDrawReset) {
      this.drawResetCounters.update((counters) => {
        const updated = [...counters];
        updated[boardIndex]++;
        return updated;
      });
    }
  }

  onReset(): void {
    this.gameService.resetGame();
  }

  onBackToHome(): void {
    this.gameService.resetGame();
    this.router.navigate(['/']);
  }
}
