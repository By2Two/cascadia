# Cascadia

Cascadia, a strategy game where every move decides where your opponent gets to play next.

---

## Install & Run

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

---

## How to Play

### The Board

The game is played on a **3×3 grid of 9 mini-boards**, each of which is a standard tic-tac-toe board. To win, you need to claim **3 mini-boards in a row** on the mega-board.

### Taking Turns

- From then on, **where you play determines where your opponent must play next**: if you mark cell #5 in a mini-board, your opponent must play on mini-board #5.
- If the targeted mini-board is already won or full, your opponent is free to play anywhere.

### Winning a Mini-Board

Get **3 in a row** (horizontally, vertically, or diagonally) inside a mini-board to claim it.  
If a mini-board ends in a **draw**, it resets and becomes playable again.

### Winning the Game

Claim **3 mini-boards in a row** on the mega-board to win. If all mini-boards are filled with no winner, the game ends in a draw.

---

> Think carefully. Your move is not just about scoring, it's about controlling where the game goes next.
