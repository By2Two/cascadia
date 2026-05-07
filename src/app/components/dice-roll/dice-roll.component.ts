import { Component, OnDestroy, OnInit, output, signal } from '@angular/core';
import { Player } from '../../models/game.model';

type Phase = 'rolling' | 'result' | 'tie' | 'winner';

const DOTS: Record<number, boolean[]> = {
  1: [false, false, false, false, true, false, false, false, false],
  2: [false, false, true, false, false, false, true, false, false],
  3: [false, false, true, false, true, false, true, false, false],
  4: [true, false, true, false, false, false, true, false, true],
  5: [true, false, true, false, true, false, true, false, true],
  6: [true, false, true, true, false, true, true, false, true],
};

@Component({
  selector: 'app-dice-roll',
  standalone: true,
  templateUrl: './dice-roll.component.html',
  styleUrl: './dice-roll.component.scss',
})
export class DiceRollComponent implements OnInit, OnDestroy {
  readonly rollComplete = output<Player>();

  xValue = signal(1);
  oValue = signal(1);
  phase = signal<Phase>('rolling');
  winner = signal<Player | null>(null);
  leaving = signal(false);

  private rollInterval: ReturnType<typeof setInterval> | null = null;
  private timeouts: ReturnType<typeof setTimeout>[] = [];

  ngOnInit() {
    this.startRoll();
  }

  ngOnDestroy() {
    this.clearTimers();
  }

  dots(value: number): boolean[] {
    return DOTS[value] ?? DOTS[1];
  }

  private rand(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  private clearTimers() {
    if (this.rollInterval) clearInterval(this.rollInterval);
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
  }

  private after(ms: number, fn: () => void) {
    const t = setTimeout(fn, ms);
    this.timeouts.push(t);
  }

  private startRoll() {
    this.phase.set('rolling');
    this.winner.set(null);
    this.leaving.set(false);

    this.rollInterval = setInterval(() => {
      this.xValue.set(this.rand());
      this.oValue.set(this.rand());
    }, 80);

    this.after(2000, () => {
      if (this.rollInterval) clearInterval(this.rollInterval);

      const x = this.rand();
      const o = this.rand();
      this.xValue.set(x);
      this.oValue.set(o);
      this.phase.set('result');

      this.after(900, () => {
        if (x === o) {
          this.phase.set('tie');
          this.after(1500, () => this.startRoll());
        } else {
          const w: Player = x > o ? 'X' : 'O';
          this.winner.set(w);
          this.phase.set('winner');
          this.after(1600, () => {
            this.leaving.set(true);
            this.after(400, () => this.rollComplete.emit(w));
          });
        }
      });
    });
  }
}
