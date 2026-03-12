import { useEffect, useState } from "react";

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(board) {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        player: board[a],
        line: [a, b, c],
      };
    }
  }

  return null;
}

function getAvailableMoves(board) {
  return board
    .map((cell, index) => (cell === null ? index : null))
    .filter((value) => value !== null);
}

function minimax(board, isMaximizing) {
  const winner = calculateWinner(board);

  if (winner?.player === "O") {
    return 10;
  }

  if (winner?.player === "X") {
    return -10;
  }

  if (board.every(Boolean)) {
    return 0;
  }

  const moves = getAvailableMoves(board);

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (const move of moves) {
      const nextBoard = [...board];
      nextBoard[move] = "O";
      bestScore = Math.max(bestScore, minimax(nextBoard, false));
    }

    return bestScore;
  }

  let bestScore = Infinity;

  for (const move of moves) {
    const nextBoard = [...board];
    nextBoard[move] = "X";
    bestScore = Math.min(bestScore, minimax(nextBoard, true));
  }

  return bestScore;
}

function getBestMove(board) {
  let bestScore = -Infinity;
  let chosenMove = null;

  for (const move of getAvailableMoves(board)) {
    const nextBoard = [...board];
    nextBoard[move] = "O";
    const score = minimax(nextBoard, false);

    if (score > bestScore) {
      bestScore = score;
      chosenMove = move;
    }
  }

  return chosenMove;
}

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [mode, setMode] = useState("ai");
  const [score, setScore] = useState({
    X: 0,
    O: 0,
    draw: 0,
  });

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);
  const isAiTurn = mode === "ai" && !winner && !isDraw && !isXTurn;

  const status = winner
    ? `${winner.player} yutdi`
    : isDraw
      ? "Durang"
      : mode === "ai" && !isXTurn
        ? "AI o'ylayapti..."
        : `${isXTurn ? "X" : "O"} ning navbati`;

  useEffect(() => {
    if (!winner && !isDraw) {
      return;
    }

    setScore((current) => {
      if (winner) {
        return {
          ...current,
          [winner.player]: current[winner.player] + 1,
        };
      }

      return {
        ...current,
        draw: current.draw + 1,
      };
    });
  }, [winner, isDraw]);

  useEffect(() => {
    if (!isAiTurn) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const bestMove = getBestMove(board);

      if (bestMove === null) {
        return;
      }

      setBoard((currentBoard) => {
        if (currentBoard[bestMove]) {
          return currentBoard;
        }

        const nextBoard = [...currentBoard];
        nextBoard[bestMove] = "O";
        return nextBoard;
      });
      setIsXTurn(true);
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [board, isAiTurn]);

  function handleCellClick(index) {
    if (board[index] || winner || isAiTurn) {
      return;
    }

    const nextBoard = [...board];
    nextBoard[index] = isXTurn ? "X" : "O";
    setBoard(nextBoard);
    setIsXTurn((current) => !current);
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
  }

  function resetScore() {
    setScore({
      X: 0,
      O: 0,
      draw: 0,
    });
    resetGame();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.15),_transparent_30%)]" />

      <section className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-[0_30px_120px_rgba(8,47,73,0.55)] backdrop-blur">
        <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
              React + Vite + Tailwind 
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-6xl">
              Tic-Tac-Toe
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
              Klassik X-O o'yini endi ikki rejimda ishlaydi: ikki o'yinchi
              yoki AI ga qarshi. Har raund natijasi hisoblagichda saqlanadi.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">
                  X g'alaba
                </p>
                <p className="mt-3 text-3xl font-black text-white">{score.X}</p>
              </div>
              <div className="rounded-3xl border border-pink-400/20 bg-pink-400/10 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-pink-200">
                  O g'alaba
                </p>
                <p className="mt-3 text-3xl font-black text-white">{score.O}</p>
              </div>
              <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-amber-200">
                  Durang
                </p>
                <p className="mt-3 text-3xl font-black text-white">
                  {score.draw}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => changeMode("ai")}
                  className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                    mode === "ai"
                      ? "bg-cyan-400 text-slate-950"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  AI bilan
                </button>
                <button
                  type="button"
                  onClick={() => changeMode("duo")}
                  className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                    mode === "duo"
                      ? "bg-cyan-400 text-slate-950"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  2 o'yinchi
                </button>
              </div>

              <p className="mt-4 rounded-2xl bg-slate-950/60 px-4 py-4 text-lg font-semibold text-slate-100">
                {status}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={resetGame}
                  className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-200"
                >
                  Qayta boshlash
                </button>
                <button
                  type="button"
                  onClick={resetScore}
                  className="rounded-full border border-white/15 bg-slate-800 px-5 py-3 text-sm font-bold text-slate-100 transition hover:bg-slate-700"
                >
                  Score ni tozalash
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Rejim
                </p>
                <p className="mt-1 text-xl font-bold text-white">
                  {mode === "ai" ? "AI bilan o'yin" : "Ikki o'yinchi"}
                </p>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
                Jonli
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {board.map((cell, index) => {
                const isWinningCell = winner?.line.includes(index);

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleCellClick(index)}
                    className={`aspect-square rounded-[1.5rem] border text-4xl font-black transition duration-200 md:text-5xl ${
                      isWinningCell
                        ? "border-emerald-400 bg-emerald-400/20 text-emerald-300"
                        : "border-slate-800 bg-slate-900 text-white hover:-translate-y-0.5 hover:border-cyan-400 hover:bg-slate-800"
                    } ${isAiTurn ? "cursor-wait" : ""}`}
                    aria-label={`${index + 1}-katak`}
                  >
                    <span
                      className={
                        cell === "X"
                          ? "text-cyan-300"
                          : cell === "O"
                            ? "text-pink-300"
                            : "text-white"
                      }
                    >
                      {cell}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">Qoidalar</p>
                <p className="mt-2 leading-6">
                  Ketma-ket 3 ta belgi gorizontal, vertikal yoki diagonal
                  joylashsa g'alaba qayd etiladi.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">AI xususiyati</p>
                <p className="mt-2 leading-6">
                  AI eng yaxshi yurishni tanlaydi, shuning uchun uni yutish
                  qiyin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
