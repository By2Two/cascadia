import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellValue } from '../../models/game.model';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss',
})
export class CellComponent implements OnChanges {
  @Input() value: CellValue = null;
  @Input() isActive = false;
  @Input() isJustPlayed = false;
  @Output() cellClick = new EventEmitter<void>();

  get isTaken(): boolean {
    return this.value !== null;
  }

  get isDisabled(): boolean {
    return !this.isActive || this.isTaken;
  }

  ngOnChanges(): void {
    if (this.isJustPlayed) {
      setTimeout(() => {
        this.isJustPlayed = false;
      }, 400);
    }
  }

  onClick(): void {
    if (!this.isTaken && this.isActive) {
      this.cellClick.emit();
    }
  }
}
