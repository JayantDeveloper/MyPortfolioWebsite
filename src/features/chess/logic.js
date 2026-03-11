const PIECE_VALUES = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 };

const PIECE_SQUARE_TABLES = {
  P: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  N: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ],
  B: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ],
  R: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
  ],
  Q: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ],
  K: [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20],
  ],
};

export function fenToBoard(fen) {
  const rows = fen.split(" ")[0].split("/");
  return rows.map((row) => {
    const parsedRow = [];
    for (const cell of row) {
      if (Number.isNaN(Number(cell))) {
        parsedRow.push(cell);
        continue;
      }
      for (let index = 0; index < Number(cell); index += 1) {
        parsedRow.push(null);
      }
    }
    return parsedRow;
  });
}

export function pieceColor(piece) {
  if (!piece) return null;
  return piece === piece.toUpperCase() ? "w" : "b";
}

export function pieceType(piece) {
  if (!piece) return null;
  return piece.toUpperCase();
}

function inBounds(row, column) {
  return row >= 0 && row < 8 && column >= 0 && column < 8;
}

function pseudoMoves(board, row, column, enPassant) {
  const piece = board[row][column];
  if (!piece) return [];

  const color = pieceColor(piece);
  const type = pieceType(piece);
  const opponent = color === "w" ? "b" : "w";
  const moves = [];

  const addMove = (targetRow, targetColumn) => {
    if (!inBounds(targetRow, targetColumn)) return;
    const targetPiece = board[targetRow][targetColumn];
    if (!targetPiece || pieceColor(targetPiece) === opponent) {
      moves.push([targetRow, targetColumn]);
    }
  };

  const slide = (rowStep, columnStep) => {
    let targetRow = row + rowStep;
    let targetColumn = column + columnStep;
    while (inBounds(targetRow, targetColumn)) {
      const targetPiece = board[targetRow][targetColumn];
      if (targetPiece) {
        if (pieceColor(targetPiece) === opponent) {
          moves.push([targetRow, targetColumn]);
        }
        break;
      }
      moves.push([targetRow, targetColumn]);
      targetRow += rowStep;
      targetColumn += columnStep;
    }
  };

  if (type === "P") {
    const direction = color === "w" ? -1 : 1;
    const startRow = color === "w" ? 6 : 1;

    if (inBounds(row + direction, column) && !board[row + direction][column]) {
      moves.push([row + direction, column]);
      if (row === startRow && !board[row + 2 * direction][column]) {
        moves.push([row + 2 * direction, column]);
      }
    }

    for (const columnOffset of [-1, 1]) {
      const targetRow = row + direction;
      const targetColumn = column + columnOffset;
      if (!inBounds(targetRow, targetColumn)) continue;

      const targetPiece = board[targetRow][targetColumn];
      if (targetPiece && pieceColor(targetPiece) === opponent) {
        moves.push([targetRow, targetColumn]);
      }
      if (
        !targetPiece &&
        enPassant &&
        enPassant[0] === targetRow &&
        enPassant[1] === targetColumn
      ) {
        moves.push([targetRow, targetColumn]);
      }
    }

    return moves;
  }

  if (type === "N") {
    [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ].forEach(([rowStep, columnStep]) => addMove(row + rowStep, column + columnStep));
    return moves;
  }

  if (type === "B") {
    [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ].forEach(([rowStep, columnStep]) => slide(rowStep, columnStep));
    return moves;
  }

  if (type === "R") {
    [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ].forEach(([rowStep, columnStep]) => slide(rowStep, columnStep));
    return moves;
  }

  if (type === "Q") {
    [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ].forEach(([rowStep, columnStep]) => slide(rowStep, columnStep));
    return moves;
  }

  [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ].forEach(([rowStep, columnStep]) => addMove(row + rowStep, column + columnStep));
  return moves;
}

export function isInCheck(board, color) {
  let kingRow = -1;
  let kingColumn = -1;

  for (let row = 0; row < 8; row += 1) {
    for (let column = 0; column < 8; column += 1) {
      if (board[row][column] === (color === "w" ? "K" : "k")) {
        kingRow = row;
        kingColumn = column;
      }
    }
  }

  if (kingRow === -1) return true;

  const opponent = color === "w" ? "b" : "w";
  for (let row = 0; row < 8; row += 1) {
    for (let column = 0; column < 8; column += 1) {
      if (pieceColor(board[row][column]) !== opponent) continue;
      if (
        pseudoMoves(board, row, column, null).some(
          ([targetRow, targetColumn]) =>
            targetRow === kingRow && targetColumn === kingColumn,
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

export function applyMove(board, from, to, promotion = "q") {
  const nextBoard = board.map((row) => [...row]);
  const piece = nextBoard[from[0]][from[1]];
  const color = pieceColor(piece);
  let enPassant = null;

  if (pieceType(piece) === "P" && from[1] !== to[1] && !nextBoard[to[0]][to[1]]) {
    nextBoard[from[0]][to[1]] = null;
  }

  if (pieceType(piece) === "K" && Math.abs(to[1] - from[1]) === 2) {
    if (to[1] === 6) {
      nextBoard[from[0]][5] = nextBoard[from[0]][7];
      nextBoard[from[0]][7] = null;
    } else {
      nextBoard[from[0]][3] = nextBoard[from[0]][0];
      nextBoard[from[0]][0] = null;
    }
  }

  if (pieceType(piece) === "P" && Math.abs(to[0] - from[0]) === 2) {
    enPassant = [((from[0] + to[0]) / 2) | 0, to[1]];
  }

  nextBoard[to[0]][to[1]] = piece;
  nextBoard[from[0]][from[1]] = null;

  if (pieceType(piece) === "P" && (to[0] === 0 || to[0] === 7)) {
    const promoted = promotion.toUpperCase();
    nextBoard[to[0]][to[1]] = color === "w" ? promoted : promoted.toLowerCase();
  }

  return { board: nextBoard, enPassant };
}

export function getLegalMoves(board, from, castling, enPassant) {
  const piece = board[from[0]][from[1]];
  if (!piece) return [];

  const color = pieceColor(piece);
  const legalMoves = pseudoMoves(board, from[0], from[1], enPassant).filter(
    (to) => !isInCheck(applyMove(board, from, to).board, color),
  );

  if (pieceType(piece) !== "K" || isInCheck(board, color)) {
    return legalMoves;
  }

  const row = color === "w" ? 7 : 0;
  if (from[0] !== row || from[1] !== 4) {
    return legalMoves;
  }

  if (
    (color === "w" ? castling.includes("K") : castling.includes("k")) &&
    !board[row][5] &&
    !board[row][6] &&
    !isInCheck(applyMove(board, [row, 4], [row, 5]).board, color) &&
    !isInCheck(applyMove(board, [row, 4], [row, 6]).board, color)
  ) {
    legalMoves.push([row, 6]);
  }

  if (
    (color === "w" ? castling.includes("Q") : castling.includes("q")) &&
    !board[row][3] &&
    !board[row][2] &&
    !board[row][1] &&
    !isInCheck(applyMove(board, [row, 4], [row, 3]).board, color) &&
    !isInCheck(applyMove(board, [row, 4], [row, 2]).board, color)
  ) {
    legalMoves.push([row, 2]);
  }

  return legalMoves;
}

export function hasAnyLegalMove(board, color, castling, enPassant) {
  for (let row = 0; row < 8; row += 1) {
    for (let column = 0; column < 8; column += 1) {
      if (pieceColor(board[row][column]) !== color) continue;
      if (getLegalMoves(board, [row, column], castling, enPassant).length > 0) {
        return true;
      }
    }
  }
  return false;
}

function evaluate(board) {
  let score = 0;
  for (let row = 0; row < 8; row += 1) {
    for (let column = 0; column < 8; column += 1) {
      const piece = board[row][column];
      if (!piece) continue;

      const color = pieceColor(piece);
      const type = pieceType(piece);
      const value = PIECE_VALUES[type] || 0;
      const table = PIECE_SQUARE_TABLES[type];
      const positionValue = table
        ? color === "w"
          ? table[row][column]
          : table[7 - row][column]
        : 0;

      score += color === "w" ? value + positionValue : -(value + positionValue);
    }
  }
  return score;
}

function getAllMoves(board, color, castling, enPassant) {
  const moves = [];
  for (let row = 0; row < 8; row += 1) {
    for (let column = 0; column < 8; column += 1) {
      if (pieceColor(board[row][column]) !== color) continue;
      getLegalMoves(board, [row, column], castling, enPassant).forEach((to) => {
        moves.push({ from: [row, column], to });
      });
    }
  }
  return moves;
}

function minimax(board, depth, alpha, beta, maximizing, castling, enPassant) {
  if (depth === 0) return evaluate(board);

  const color = maximizing ? "w" : "b";
  const moves = getAllMoves(board, color, castling, enPassant);
  if (!moves.length) {
    return isInCheck(board, color) ? (maximizing ? -99999 : 99999) : 0;
  }

  if (maximizing) {
    let bestValue = -Infinity;
    for (const move of moves) {
      const { board: nextBoard, enPassant: nextEnPassant } = applyMove(
        board,
        move.from,
        move.to,
      );
      bestValue = Math.max(
        bestValue,
        minimax(nextBoard, depth - 1, alpha, beta, false, castling, nextEnPassant),
      );
      alpha = Math.max(alpha, bestValue);
      if (beta <= alpha) break;
    }
    return bestValue;
  }

  let bestValue = Infinity;
  for (const move of moves) {
    const { board: nextBoard, enPassant: nextEnPassant } = applyMove(
      board,
      move.from,
      move.to,
    );
    bestValue = Math.min(
      bestValue,
      minimax(nextBoard, depth - 1, alpha, beta, true, castling, nextEnPassant),
    );
    beta = Math.min(beta, bestValue);
    if (beta <= alpha) break;
  }
  return bestValue;
}

export function getBotMove(board, color, castling, enPassant) {
  const moves = getAllMoves(board, color, castling, enPassant);
  if (!moves.length) return null;

  for (let index = moves.length - 1; index > 0; index -= 1) {
    const swapIndex = (Math.random() * index) | 0;
    [moves[index], moves[swapIndex]] = [moves[swapIndex], moves[index]];
  }

  let bestValue = color === "b" ? Infinity : -Infinity;
  let bestMove = moves[0];

  for (const move of moves) {
    const { board: nextBoard, enPassant: nextEnPassant } = applyMove(
      board,
      move.from,
      move.to,
    );
    const value = minimax(
      nextBoard,
      2,
      -Infinity,
      Infinity,
      color === "b",
      castling,
      nextEnPassant,
    );
    if ((color === "b" && value < bestValue) || (color === "w" && value > bestValue)) {
      bestValue = value;
      bestMove = move;
    }
  }

  return bestMove;
}
