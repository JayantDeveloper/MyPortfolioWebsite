const PIECE_VALUES = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 };
const BOT_BASE_DEPTH = 3;
const BOT_ENDGAME_DEPTH = 4;
const BOT_ENDGAME_PIECE_THRESHOLD = 14;

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

export function isPromotionMove(board, from, to) {
  const piece = board[from[0]][from[1]];
  return pieceType(piece) === "P" && (to[0] === 0 || to[0] === 7);
}

function inBounds(row, column) {
  return row >= 0 && row < 8 && column >= 0 && column < 8;
}

function pseudoMoves(board, row, column, enPassant, options = {}) {
  const { includeOwnTargets = false } = options;
  const piece = board[row][column];
  if (!piece) return [];

  const color = pieceColor(piece);
  const type = pieceType(piece);
  const opponent = color === "w" ? "b" : "w";
  const moves = [];

  const addMove = (targetRow, targetColumn) => {
    if (!inBounds(targetRow, targetColumn)) return;
    const targetPiece = board[targetRow][targetColumn];
    if (
      !targetPiece ||
      pieceColor(targetPiece) === opponent ||
      (includeOwnTargets && targetPiece && pieceColor(targetPiece) === color)
    ) {
      moves.push([targetRow, targetColumn]);
    }
  };

  const slide = (rowStep, columnStep) => {
    let targetRow = row + rowStep;
    let targetColumn = column + columnStep;
    while (inBounds(targetRow, targetColumn)) {
      const targetPiece = board[targetRow][targetColumn];
      if (targetPiece) {
        if (pieceColor(targetPiece) === opponent || (includeOwnTargets && pieceColor(targetPiece) === color)) {
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
      if (
        (targetPiece && pieceColor(targetPiece) === opponent) ||
        (includeOwnTargets && targetPiece && pieceColor(targetPiece) === color)
      ) {
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

export function applyMove(board, from, to, promotion = "q", options = {}) {
  const { deferPromotion = false } = options;
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
    if (deferPromotion) {
      nextBoard[to[0]][to[1]] = color === "w" ? "P" : "p";
    } else {
      const promoted = promotion.toUpperCase();
      nextBoard[to[0]][to[1]] = color === "w" ? promoted : promoted.toLowerCase();
    }
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

export function getPremoveLegalMoves(board, from, castling, enPassant) {
  const piece = board[from[0]][from[1]];
  if (!piece) return [];

  const color = pieceColor(piece);
  const legalMoves = pseudoMoves(board, from[0], from[1], enPassant, {
    includeOwnTargets: true,
  });

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

function scoreImmediateMove(board, move) {
  const movingPiece = pieceType(board[move.from[0]][move.from[1]]);
  const capturedPiece = board[move.to[0]][move.to[1]];
  const capturedValue = capturedPiece ? PIECE_VALUES[pieceType(capturedPiece)] : 0;
  const movingValue = movingPiece ? PIECE_VALUES[movingPiece] : 0;
  return capturedValue * 100 - movingValue * 12 + (capturedValue || 0);
}

function orderedMoves(board, color, castling, enPassant, maximizing) {
  const moves = getAllMoves(board, color, castling, enPassant);
  return moves.sort((firstMove, secondMove) => {
    const firstScore = scoreImmediateMove(board, firstMove);
    const secondScore = scoreImmediateMove(board, secondMove);
    return maximizing ? secondScore - firstScore : firstScore - secondScore;
  });
}

function minimax(board, depth, alpha, beta, maximizing, castling, enPassant) {
  if (depth === 0) return evaluate(board);

  const color = maximizing ? "w" : "b";
  const moves = orderedMoves(board, color, castling, enPassant, maximizing);
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

function pickWeightedByRank(candidates) {
  if (!candidates.length) return null;
  const totalWeight = candidates.reduce((sum, _, index) => sum + 1 / (index + 1), 0);
  let draw = Math.random() * totalWeight;
  for (let index = 0; index < candidates.length; index += 1) {
    draw -= 1 / (index + 1);
    if (draw <= 0) {
      return candidates[index];
    }
  }
  return candidates[0];
}

export function getBotMove(board, color, castling, enPassant, options = {}) {
  const { moveNoise = 0 } = options;
  const moves = getAllMoves(board, color, castling, enPassant);
  if (!moves.length) return null;

  const moveCount = board.flat().filter(Boolean).length;
  const searchDepth = moveCount <= BOT_ENDGAME_PIECE_THRESHOLD ? BOT_ENDGAME_DEPTH : BOT_BASE_DEPTH;
  const orderedTopMoves = orderedMoves(board, color, castling, enPassant, color !== "b");
  const scoredMoves = [];

  for (const move of orderedTopMoves) {
    const { board: nextBoard, enPassant: nextEnPassant } = applyMove(
      board,
      move.from,
      move.to,
    );
    const value = minimax(
      nextBoard,
      searchDepth - 1,
      -Infinity,
      Infinity,
      color === "b",
      castling,
      nextEnPassant,
    );
    scoredMoves.push({ move, value });
  }

  const maximizing = color === "w";
  const sortedMoves = scoredMoves.sort((first, second) =>
    maximizing ? second.value - first.value : first.value - second.value,
  );
  const bestValue = sortedMoves[0].value;

  const OPENING_PIECE_THRESHOLD = 28;
  const OPENING_VALUE_SPREAD = 65;
  const OPENING_POOL_LIMIT = 6;
  if (moveCount >= OPENING_PIECE_THRESHOLD) {
    const openingCandidates = sortedMoves.filter(({ value }) =>
      maximizing ? value >= bestValue - OPENING_VALUE_SPREAD : value <= bestValue + OPENING_VALUE_SPREAD,
    );
    const candidatePool = (openingCandidates.length ? openingCandidates : sortedMoves).slice(
      0,
      OPENING_POOL_LIMIT,
    );
    const chosen = pickWeightedByRank(candidatePool);
    if (chosen) {
      return chosen.move;
    }
  }

  let bestNoisy = maximizing ? -Infinity : Infinity;
  let bestMove = sortedMoves[0].move;
  for (const { move, value } of sortedMoves) {
    const noisyValue = value + (Math.random() - 0.5) * moveNoise;
    if (
      (maximizing && noisyValue > bestNoisy) ||
      (!maximizing && noisyValue < bestNoisy)
    ) {
      bestNoisy = noisyValue;
      bestMove = move;
    }
  }

  return bestMove;
}
