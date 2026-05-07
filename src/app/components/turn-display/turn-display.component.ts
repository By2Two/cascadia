import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/game.model';

@Component({
  selector: 'app-turn-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turn-display.component.html',
  styleUrl: './turn-display.component.scss',
})
export class TurnDisplayComponent {
  @Input() currentPlayer: Player = 'X';
  @Input() nextBoard: number | null = null;
  @Input() hasWinner = false;

  get statusText(): string {
    if (this.hasWinner) {
      return '';
    }
    if (this.nextBoard !== null) {
      return `BOARD ${this.nextBoard + 1}`;
    }
    return 'FREE BOARD';
  }
}
