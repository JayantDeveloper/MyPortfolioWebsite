import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildNoMoveGameOver, createInitialGameState, resolveMoveState } from "./gameState";
import {
  applyMove,
  getBotMove,
  getLegalMoves,
  isInCheck,
  pieceColor,
  pieceType,
} from "./logic";

function randomPlayerColor() {
  return Math.random() < 0.5 ? "w" : "b";
}

function hasMoveTarget(moves, row, column) {
  return moves.some(([targetRow, targetColumn]) => targetRow === row && targetColumn === column);
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

function buildPremovePreviewState(gameState, premoveQueue) {
  if (!gameState) return null;

  const previewState = {
    board: gameState.board,
    castling: gameState.castling,
    enPassant: gameState.enPassant,
  };

  for (const move of premoveQueue) {
    const movingPiece = previewState.board[move.from[0]][move.from[1]];
    if (!movingPiece || pieceColor(movingPiece) !== gameState.playerColor) {
      break;
    }

    const { board: nextBoard, enPassant: nextEnPassant } = applyMove(
      previewState.board,
      move.from,
      move.to,
    );

    previewState.castling = updateCastlingRights(
      previewState.castling,
      previewState.board,
      move.from,
      move.to,
    );
    previewState.board = nextBoard;
    previewState.enPassant = nextEnPassant;
  }

  return previewState;
}

function appendMoveHighlights(moveHighlights, move) {
  return [...(moveHighlights || []).slice(-1), move];
}

function resolveMoveWithHighlights(state, from, to, promotion = "q") {
  const nextState = resolveMoveState(state, from, to, promotion);
  return {
    ...nextState,
    moveHighlights: appendMoveHighlights(state.moveHighlights, { from, to }),
  };
}

export function useChessGame() {
  const [phase, setPhase] = useState("intro");
  const [gameState, setGameState] = useState(null);
  const [premoveSelection, setPremoveSelection] = useState(null);
  const [premoveLegalMoves, setPremoveLegalMoves] = useState([]);
  const [premoveQueue, setPremoveQueueState] = useState([]);

  const timerRef = useRef(null);
  const tickRef = useRef(null);
  const botRef = useRef(false);
  const gameStateRef = useRef(null);
  const premoveQueueRef = useRef([]);

  const setPremoveQueue = useCallback((nextQueueOrUpdater) => {
    const nextQueue =
      typeof nextQueueOrUpdater === "function"
        ? nextQueueOrUpdater(premoveQueueRef.current)
        : nextQueueOrUpdater;

    premoveQueueRef.current = nextQueue;
    setPremoveQueueState(nextQueue);
    return nextQueue;
  }, []);

  const clearPremoveSelection = useCallback(() => {
    setPremoveSelection(null);
    setPremoveLegalMoves([]);
  }, []);

  const clearPremove = useCallback(() => {
    setPremoveQueue([]);
    clearPremoveSelection();
  }, [clearPremoveSelection, setPremoveQueue]);

  const startPremoveSelection = useCallback(
    (state, row, column) => {
      setPremoveSelection([row, column]);
      setPremoveLegalMoves(
        getLegalMoves(state.board, [row, column], state.castling, state.enPassant),
      );
    },
    [],
  );

  const cancelPremove = useCallback(() => {
    clearPremove();
  }, [clearPremove]);

  const premovePreviewState = useMemo(() => {
    if (!gameState || gameState.turn === gameState.playerColor) {
      return null;
    }

    return buildPremovePreviewState(gameState, premoveQueue);
  }, [gameState, premoveQueue]);

  const displayBoard = premovePreviewState?.board ?? gameState?.board ?? null;

  const startGame = useCallback(() => {
    botRef.current = false;
    clearPremove();
    setGameState(createInitialGameState(randomPlayerColor()));
    setPhase("playing");
  }, [clearPremove]);

  const rematch = useCallback(() => {
    botRef.current = false;
    clearPremove();
    setGameState(createInitialGameState(randomPlayerColor()));
  }, [clearPremove]);

  const goToIntro = useCallback(() => {
    clearInterval(timerRef.current);
    botRef.current = false;
    clearPremove();
    setGameState(null);
    setPhase("intro");
  }, [clearPremove]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    if (!gameState || gameState.gameStatus !== "playing") {
      clearPremove();
    }
  }, [clearPremove, gameState]);

  useEffect(() => {
    if (
      !gameState ||
      gameState.gameStatus !== "playing" ||
      gameState.turn !== gameState.playerColor
    ) {
      return;
    }

    if (premoveSelection) {
      clearPremoveSelection();
    }

    const queuedPremoves = premoveQueueRef.current;
    if (!queuedPremoves.length) {
      return;
    }

    const [nextPremove, ...remainingPremoves] = queuedPremoves;
    const queuedPiece = gameState.board[nextPremove.from[0]][nextPremove.from[1]];
    let nextState = gameState;
    let nextQueue = [];

    if (queuedPiece && pieceColor(queuedPiece) === gameState.playerColor) {
      const nextLegalMoves = getLegalMoves(
        gameState.board,
        nextPremove.from,
        gameState.castling,
        gameState.enPassant,
      );

      if (hasMoveTarget(nextLegalMoves, nextPremove.to[0], nextPremove.to[1])) {
        nextState = resolveMoveWithHighlights(gameState, nextPremove.from, nextPremove.to);
        nextQueue = nextState.gameStatus === "playing" ? remainingPremoves : [];
      }
    }

    setPremoveQueue(nextQueue);

    if (nextState !== gameState) {
      setGameState(nextState);
    }
  }, [
    clearPremoveSelection,
    gameState,
    premoveSelection,
    setPremoveQueue,
  ]);

  useEffect(() => {
    if (!gameState || gameState.gameStatus !== "playing") {
      clearInterval(timerRef.current);
      return undefined;
    }

    clearInterval(timerRef.current);
    tickRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - tickRef.current;
      tickRef.current = now;

      setGameState((previousState) => {
        if (!previousState || previousState.gameStatus !== "playing") {
          return previousState;
        }

        const activeClockKey = previousState.turn === "w" ? "wTime" : "bTime";
        const remainingTime = previousState[activeClockKey] - elapsed;

        if (remainingTime <= 0) {
          clearInterval(timerRef.current);
          const winner = previousState.turn === "w" ? "b" : "w";
          return {
            ...previousState,
            [activeClockKey]: 0,
            gameStatus: "over",
            gameResult: `${winner === previousState.playerColor ? "You win" : "Bot wins"} on time!`,
          };
        }

        return { ...previousState, [activeClockKey]: remainingTime };
      });
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [gameState?.turn, gameState?.gameStatus]);

  useEffect(() => {
    if (
      !gameState ||
      gameState.gameStatus !== "playing" ||
      gameState.turn === gameState.playerColor ||
      botRef.current
    ) {
      return undefined;
    }

    botRef.current = true;

    const timeoutId = setTimeout(() => {
      const previousState = gameStateRef.current;
      if (
        !previousState ||
        previousState.gameStatus !== "playing" ||
        previousState.turn === previousState.playerColor
      ) {
        botRef.current = false;
        return;
      }

      const move = getBotMove(
        previousState.board,
        previousState.turn,
        previousState.castling,
        previousState.enPassant,
      );

      botRef.current = false;

      if (!move) {
        clearPremove();
        setGameState(buildNoMoveGameOver(previousState));
        return;
      }

      let nextState = resolveMoveWithHighlights(previousState, move.from, move.to);
      let nextPremoveQueue = premoveQueueRef.current;

      if (
        nextState.gameStatus === "playing" &&
        nextState.turn === nextState.playerColor &&
        nextPremoveQueue.length > 0
      ) {
        const [nextPremove, ...remainingPremoves] = nextPremoveQueue;
        const queuedPiece = nextState.board[nextPremove.from[0]][nextPremove.from[1]];

        if (queuedPiece && pieceColor(queuedPiece) === nextState.playerColor) {
          const nextLegalMoves = getLegalMoves(
            nextState.board,
            nextPremove.from,
            nextState.castling,
            nextState.enPassant,
          );

          if (hasMoveTarget(nextLegalMoves, nextPremove.to[0], nextPremove.to[1])) {
            nextState = resolveMoveWithHighlights(
              nextState,
              nextPremove.from,
              nextPremove.to,
            );
            nextPremoveQueue = nextState.gameStatus === "playing" ? remainingPremoves : [];
          } else {
            nextPremoveQueue = [];
          }
        } else {
          nextPremoveQueue = [];
        }
      }

      clearPremoveSelection();
      setPremoveQueue(nextState.gameStatus === "playing" ? nextPremoveQueue : []);
      setGameState(nextState);
    }, 900);

    return () => clearTimeout(timeoutId);
  }, [
    clearPremove,
    clearPremoveSelection,
    gameState?.board,
    gameState?.turn,
    gameState?.gameStatus,
    gameState?.playerColor,
    setPremoveQueue,
  ]);

  const handleSquareClick = useCallback((row, column) => {
    if (!gameState || gameState.gameStatus !== "playing") {
      return;
    }

    if (gameState.turn !== gameState.playerColor) {
      const previewState = premovePreviewState ?? gameState;
      const clickedPiece = previewState.board[row][column];

      if (premoveSelection && hasMoveTarget(premoveLegalMoves, row, column)) {
        setPremoveQueue((previousQueue) => [
          ...previousQueue,
          { from: premoveSelection, to: [row, column] },
        ]);
        clearPremoveSelection();
        return;
      }

      if (clickedPiece && pieceColor(clickedPiece) === gameState.playerColor) {
        startPremoveSelection(previewState, row, column);
        return;
      }

      clearPremoveSelection();
      return;
    }

    clearPremove();

    setGameState((previousState) => {
      if (
        !previousState ||
        previousState.gameStatus !== "playing" ||
        previousState.turn !== previousState.playerColor
      ) {
        return previousState;
      }

      const clickedPiece = previousState.board[row][column];

      if (previousState.selected) {
        const isLegalTarget = previousState.legalMoves.some(
          ([targetRow, targetColumn]) => targetRow === row && targetColumn === column,
        );

        if (isLegalTarget) {
          return resolveMoveWithHighlights(
            previousState,
            previousState.selected,
            [row, column],
          );
        }

        if (clickedPiece && pieceColor(clickedPiece) === previousState.playerColor) {
          return {
            ...previousState,
            selected: [row, column],
            legalMoves: getLegalMoves(
              previousState.board,
              [row, column],
              previousState.castling,
              previousState.enPassant,
            ),
          };
        }

        return { ...previousState, selected: null, legalMoves: [] };
      }

      if (clickedPiece && pieceColor(clickedPiece) === previousState.playerColor) {
        return {
          ...previousState,
          selected: [row, column],
          legalMoves: getLegalMoves(
            previousState.board,
            [row, column],
            previousState.castling,
            previousState.enPassant,
          ),
        };
      }

      return previousState;
    });
  }, [
    clearPremove,
    clearPremoveSelection,
    gameState,
    premovePreviewState,
    premoveLegalMoves,
    premoveSelection,
    setPremoveQueue,
    startPremoveSelection,
  ]);

  const isCurrentTurnInCheck = useMemo(() => {
    if (!gameState || gameState.gameStatus !== "playing") return false;
    return isInCheck(gameState.board, gameState.turn);
  }, [gameState?.board, gameState?.turn, gameState?.gameStatus]);

  return {
    phase,
    gameState,
    startGame,
    rematch,
    goToIntro,
    handleSquareClick,
    isCurrentTurnInCheck,
    cancelPremove,
    displayBoard,
    premoveSelection,
    premoveLegalMoves,
    premoveQueue,
  };
}
