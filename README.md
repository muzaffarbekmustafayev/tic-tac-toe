# Tic-Tac-Toe

A Tic-Tac-Toe game built with React and Vite. The interface is styled with Tailwind CSS via CDN and includes an AI mode plus a live score tracker.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the local development server:

```bash
npm run dev
```

3. Open the local URL shown in the terminal.

## Features

- 3x3 game board
- Automatic turn switching between `X` and `O`
- Play against AI
- Two-player mode
- Winner detection with highlighted winning cells
- Draw detection
- Live score tracking for `X`, `O`, and draws
- `Restart Game` action
- `Reset Score` action

## Technologies

- React
- Vite
- Tailwind CSS CDN

## Note

The AI uses the `minimax` approach, so it chooses optimal moves.
