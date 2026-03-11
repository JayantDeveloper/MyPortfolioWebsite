import { INIT_FEN, INIT_TIME } from "./constants";
import {
  applyMove,
  fenToBoard,
  hasAnyLegalMove,
  isInCheck,
  pieceColor,
  pieceType,
} from "./logic";

export function createInitialGameState(playerColor) {
  return {
    board: fenToBoard(INIT_FEN),
    turn: "w",
    playerColor,
    selected: null,
    legalMoves: [],
    lastMove: null,
    castling: "KQkq",
    enPassant: null,
    gameStatus: "playing",
    gameResult: null,
    wTime: INIT_TIME,
    bTime: INIT_TIME,
  };
}

function stripRookCastlingRights(castling, row, column) {
  let nextCastling = castling;
  if (row === 7 && column === 0) nextCastling = nextCastling.replace("Q", "");
  if (row === 7 && column === 7) nextCastling = nextCastling.replace("K", "");
  if (row === 0 && column === 0) nextCastling = nextCastling.replace("q", "");
  if (row === 0 && column === 7) nextCastling = nextCastling.replace("k", "");
  return nextCastling;
}

function updateCastlingRights(castling, board, from, to) {
  let nextCastling = castling;
  const movingPiece = board[from[0]][from[1]];
  const capturedPiece = board[to[0]][to[1]];

  if (pieceType(movingPiece) === "K") {
    nextCastling =
      pieceColor(movingPiece) === "w"
        ? nextCastling.replace("K", "").replace("Q", "")
        : nextCastling.replace("k", "").replace("q", "");
  }

  if (pieceType(movingPiece) === "R") {
    nextCastling = stripRookCastlingRights(nextCastling, from[0], from[1]);
  }

  if (pieceType(capturedPiece) === "R") {
    nextCastling = stripRookCastlingRights(nextCastling, to[0], to[1]);
  }

  return nextCastling;
}

function nextPlayer(turn) {
  return turn === "w" ? "b" : "w";
}

export function buildNoMoveGameOver(state) {
  const inCheck = isInCheck(state.board, state.turn);
  return {
    ...state,
    gameStatus: "over",
    gameResult: inCheck
      ? state.turn === state.playerColor
        ? "Bot wins by checkmate!"
        : "You win by checkmate!"
      : "Draw - stalemate",
  };
}

export function resolveMoveState(state, from, to) {
  const { board: nextBoard, enPassant: nextEnPassant } = applyMove(
    state.board,
    from,
    to,
  );
  const nextCastling = updateCastlingRights(state.castling, state.board, from, to);
  const nextTurn = nextPlayer(state.turn);
  const baseState = {
    ...state,
    board: nextBoard,
    turn: nextTurn,
    lastMove: { from, to },
    castling: nextCastling,
    enPassant: nextEnPassant,
    selected: null,
    legalMoves: [],
  };

  if (!hasAnyLegalMove(nextBoard, nextTurn, nextCastling, nextEnPassant)) {
    const inCheck = isInCheck(nextBoard, nextTurn);
    return {
      ...baseState,
      gameStatus: "over",
      gameResult: inCheck
        ? nextTurn === state.playerColor
          ? "Bot wins by checkmate!"
          : "You win by checkmate!"
        : "Draw - stalemate",
    };
  }

  return baseState;
}
