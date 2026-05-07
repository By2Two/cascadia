import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Player } from '../../models/game.model';
import { DiceRollComponent } from '../dice-roll/dice-roll.component';
import { MiniBoardComponent } from '../mini-board/mini-board.component';
import { TurnDisplayComponent } from '../turn-display/turn-display.component';
import { WinOverlayComponent } from '../win-overlay/win-overlay.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [DiceRollComponent, MiniBoardComponent, TurnDisplayComponent, WinOverlayComponent],
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
  readonly showDiceRoll = signal(true);

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

  onDiceRollComplete(winner: Player): void {
    this.gameService.resetGame(winner);
    this.showDiceRoll.set(false);
  }

  onReset(): void {
    this.showDiceRoll.set(true);
  }

  onBackToHome(): void {
    this.gameService.resetGame();
    this.router.navigate(['/']);
  }
}
