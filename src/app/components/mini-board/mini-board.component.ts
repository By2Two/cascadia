import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellComponent } from '../cell/cell.component';
import { MiniBoardState } from '../../models/game.model';

@Component({
  selector: 'app-mini-board',
  standalone: true,
  imports: [CommonModule, CellComponent],
  templateUrl: './mini-board.component.html',
  styleUrl: './mini-board.component.scss',
})
export class MiniBoardComponent implements OnChanges {
  @Input() boardState!: MiniBoardState;
  @Input() isActive = false;
  @Input() isFull = false;
  @Input() drawResetCounter = 0;
  @Output() cellPlayed = new EventEmitter<number>();

  isResetting = false;
  lastPlayedCell: number | null = null;
  showToast = false;

  get isDrawn(): boolean {
    return !this.boardState.winner && this.isFull;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['drawResetCounter'] && !changes['drawResetCounter'].firstChange) {
      this.triggerDrawReset();
    }
  }

  private triggerDrawReset(): void {
    this.showToast = true;
    this.isResetting = true;
    setTimeout(() => {
      this.showToast = false;
    }, 1800);
    setTimeout(() => {
      this.isResetting = false;
    }, 900);
  }

  onCellClick(cellIndex: number): void {
    if (!this.isActive || this.boardState.winner) {
      return;
    }
    this.lastPlayedCell = cellIndex;
    this.cellPlayed.emit(cellIndex);
    setTimeout(() => {
      this.lastPlayedCell = null;
    }, 400);
  }

  getCells(): number[] {
    return Array.from({ length: 9 }, (_, index) => index);
  }
}
