import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameWinner } from '../../models/game.model';

@Component({
  selector: 'app-win-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './win-overlay.component.html',
  styleUrl: './win-overlay.component.scss',
})
export class WinOverlayComponent {
  @Input() winner: GameWinner = null;
  @Output() restart = new EventEmitter<void>();

  get isVisible(): boolean {
    return this.winner !== null;
  }

  get winMessage(): string {
    if (this.winner === 'D') {
      return 'DRAW';
    }
    return `${this.winner} WINS`;
  }

  get winSubtext(): string {
    if (this.winner === 'D') {
      return 'No winner this time';
    }
    if (this.winner === 'X') {
      return 'X dominates the board!';
    }
    return 'O claims victory!';
  }

  get winClass(): string {
    if (this.winner === 'D') {
      return 'draw';
    }
    return this.winner?.toLowerCase() ?? '';
  }

  onRestart(): void {
    this.restart.emit();
  }
}
