import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildNoMoveGameOver, createInitialGameState, resolveMoveState } from "./gameState";
import { INIT_TIME } from "./constants";
import {
  applyMove,
  getBotMove,
  getPremoveLegalMoves,
  getLegalMoves,
  isInCheck,
  pieceColor,
  pieceType,
} from "./logic";

const BOT_THINK_LONG_MIN_MS = 0;
const BOT_THINK_LONG_MAX_MS = 8000;
const BOT_THINK_MID_MS = 2000;
const BOT_THINK_FAST_MS = 1000;
const BOT_OPENING_MOVE_VARIATION = 48;

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

function preserveSelectedPieceAfterOpponentMove(previousState, nextState) {
  if (!previousState || !previousState.selected) {
    return nextState;
  }

  if (previousState.turn === previousState.playerColor) {
    return nextState;
  }

  const selectedSquare = previousState.selected;
  const selectedPiece = nextState.board[selectedSquare[0]][selectedSquare[1]];
  if (!selectedPiece || pieceColor(selectedPiece) !== nextState.playerColor) {
    return { ...nextState, selected: null, legalMoves: [] };
  }

  if (nextState.gameStatus !== "playing") {
    return nextState;
  }

  return {
    ...nextState,
    selected: selectedSquare,
    legalMoves: getLegalMoves(
      nextState.board,
      selectedSquare,
      nextState.castling,
      nextState.enPassant,
    ),
  };
}

function isSameMoveSet(first, second) {
  if (first.length !== second.length) return false;
  const secondSet = new Set(second.map(([row, column]) => `${row},${column}`));
  return first.every(([row, column]) => secondSet.has(`${row},${column}`));
}

function resolveMoveWithHighlights(state, from, to, promotion = "q") {
  const nextState = resolveMoveState(state, from, to, promotion);
  return preserveSelectedPieceAfterOpponentMove(state, {
    ...nextState,
    moveHighlights: appendMoveHighlights(state.moveHighlights, { from, to }),
  });
}

export function useChessGame() {
  const [phase, setPhase] = useState("intro");
  const [gameState, setGameState] = useState(null);
  const [premoveSelection, setPremoveSelection] = useState(null);
  const [premoveLegalMoves, setPremoveLegalMoves] = useState([]);
  const [premoveQueue, setPremoveQueueState] = useState([]);
  const [showPremoveMoveTargets, setShowPremoveMoveTargets] = useState(false);

  const timerRef = useRef(null);
  const tickRef = useRef(null);
  const botRef = useRef(false);
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
    setShowPremoveMoveTargets(false);
    setPremoveSelection(null);
    setPremoveLegalMoves([]);
  }, []);

  const clearPremove = useCallback(() => {
    setShowPremoveMoveTargets(false);
    setPremoveQueue([]);
    clearPremoveSelection();
  }, [clearPremoveSelection, setPremoveQueue]);

  const startPremoveSelection = useCallback(
    (state, row, column) => {
      setShowPremoveMoveTargets(true);
      setPremoveSelection([row, column]);
      setPremoveLegalMoves(
        getPremoveLegalMoves(state.board, [row, column], state.castling, state.enPassant),
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

  const resign = useCallback(() => {
    setGameState((previousState) => {
      if (!previousState || previousState.gameStatus !== "playing") {
        return previousState;
      }

      return {
        ...previousState,
        gameStatus: "over",
        gameResult: "You resigned. Bot wins by resignation!",
        selected: null,
        legalMoves: [],
        pendingPromotion: null,
      };
    });

    clearPremove();
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
    if (!gameState || gameState.gameStatus !== "playing") {
      clearPremove();
    }
  }, [clearPremove, gameState]);

  useEffect(() => {
    if (!gameState || gameState.gameStatus !== "playing" || !gameState.selected) {
      return;
    }

    const [selectedRow, selectedColumn] = gameState.selected;
    const isPlayerTurn = gameState.turn === gameState.playerColor;
    const boardForMoves = isPlayerTurn
      ? gameState.board
      : premovePreviewState?.board ?? gameState.board;
    const castlingForMoves = isPlayerTurn
      ? gameState.castling
      : premovePreviewState?.castling ?? gameState.castling;
    const enPassantForMoves = isPlayerTurn
      ? gameState.enPassant
      : premovePreviewState?.enPassant ?? gameState.enPassant;
    const getMovesForTurn = isPlayerTurn ? getLegalMoves : getPremoveLegalMoves;

    const selectedPiece = boardForMoves[selectedRow][selectedColumn];
    if (!selectedPiece || pieceColor(selectedPiece) !== gameState.playerColor) {
      setGameState((previousState) => {
        if (!previousState || !previousState.selected) return previousState;
        return { ...previousState, selected: null, legalMoves: [] };
      });
      return;
    }

    if (!isPlayerTurn && !showPremoveMoveTargets) {
      return;
    }

    const recomputedLegalMoves = getMovesForTurn(
      boardForMoves,
      gameState.selected,
      castlingForMoves,
      enPassantForMoves,
    );

    if (!isSameMoveSet(recomputedLegalMoves, gameState.legalMoves)) {
      setGameState((previousState) => {
        if (!previousState || !previousState.selected) return previousState;
        return { ...previousState, legalMoves: recomputedLegalMoves };
      });
    }
  }, [
    gameState?.board,
    gameState?.castling,
    gameState?.enPassant,
    gameState?.selected,
    gameState?.turn,
    gameState?.playerColor,
    premovePreviewState?.board,
    premovePreviewState?.castling,
    premovePreviewState?.enPassant,
    showPremoveMoveTargets,
  ]);

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
    const currentBotTurnClock = gameState.turn === "w" ? gameState.wTime : gameState.bTime;
    const shouldUseMoveNoise = currentBotTurnClock > 60_000;
    const botThinkMs =
      currentBotTurnClock > 60_000
        ? BOT_THINK_LONG_MIN_MS +
          Math.random() * (BOT_THINK_LONG_MAX_MS - BOT_THINK_LONG_MIN_MS)
        : currentBotTurnClock > 30_000
          ? BOT_THINK_MID_MS
          : BOT_THINK_FAST_MS;

    const timeoutId = setTimeout(() => {
      setGameState((currentState) => {
        if (
          !currentState ||
          currentState.gameStatus !== "playing" ||
          currentState.turn === currentState.playerColor
        ) {
          botRef.current = false;
          return currentState;
        }

        const move = getBotMove(
          currentState.board,
          currentState.turn,
          currentState.castling,
          currentState.enPassant,
          { moveNoise: shouldUseMoveNoise ? BOT_OPENING_MOVE_VARIATION : 0 },
        );

        if (!move) {
          botRef.current = false;
          clearPremove();
          return buildNoMoveGameOver(currentState);
        }

        const nextState = resolveMoveWithHighlights(currentState, move.from, move.to);

        clearPremoveSelection();
        if (nextState.gameStatus !== "playing") {
          setPremoveQueue([]);
        }
        botRef.current = false;
        return nextState;
      });
    }, botThinkMs);

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
      const selectedSquare = gameState.selected;
      const selectedMoveTarget = selectedSquare
        ? hasMoveTarget(gameState.legalMoves, row, column)
        : false;

      if (selectedMoveTarget || (premoveSelection && hasMoveTarget(premoveLegalMoves, row, column))) {
        const source = selectedSquare ?? premoveSelection;
        const nextPremoveQueue = [
          ...premoveQueueRef.current,
          { from: source, to: [row, column] },
        ];
        const nextPreviewState = buildPremovePreviewState(gameState, nextPremoveQueue);
        setShowPremoveMoveTargets(false);

        setPremoveQueue((previousQueue) => [
          ...previousQueue,
          { from: source, to: [row, column] },
        ]);
        clearPremoveSelection();

        if (nextPreviewState) {
          setGameState((previousState) => {
            if (!previousState || previousState.gameStatus !== "playing") {
              return previousState;
            }

            const nextSelectedSquare = [row, column];
            const selectedPiece = nextPreviewState.board[row]?.[column];
            if (!selectedPiece || pieceColor(selectedPiece) !== gameState.playerColor) {
              return {
                ...previousState,
                selected: null,
                legalMoves: [],
              };
            }

            return {
              ...previousState,
              selected: nextSelectedSquare,
              legalMoves: [],
            };
          });
        }

        return;
      }

      if (clickedPiece && pieceColor(clickedPiece) === gameState.playerColor) {
        const isSameSelectedPiece =
          selectedSquare &&
          selectedSquare[0] === row &&
          selectedSquare[1] === column;

        if (isSameSelectedPiece && showPremoveMoveTargets) {
          clearPremoveSelection();
          setGameState((previousState) => {
            if (!previousState || previousState.gameStatus !== "playing") {
              return previousState;
            }

            return {
              ...previousState,
              selected: null,
              legalMoves: [],
            };
          });
          return;
        }

        startPremoveSelection(previewState, row, column);
        setGameState((previousState) => {
        if (
          !previousState ||
          previousState.gameStatus !== "playing" ||
          !previousState.board[row]
        ) {
          return previousState;
        }

        const boardForMoves = previewState?.board ?? previousState.board;
        return {
          ...previousState,
          selected: [row, column],
          legalMoves: getPremoveLegalMoves(
            boardForMoves,
            [row, column],
            previewState?.castling ?? previousState.castling,
            previewState?.enPassant ?? previousState.enPassant,
            ),
          };
        });
        return;
      }

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
        const isSameSelectedSquare =
          previousState.selected[0] === row && previousState.selected[1] === column;

        if (isLegalTarget) {
          return resolveMoveWithHighlights(
            previousState,
            previousState.selected,
            [row, column],
          );
        }

        if (isSameSelectedSquare) {
          return {
            ...previousState,
            selected: null,
            legalMoves: [],
          };
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
    showPremoveMoveTargets,
    setPremoveQueue,
    startPremoveSelection,
  ]);

    const isCurrentTurnInCheck = useMemo(() => {
    if (!gameState) return false;
    return isInCheck(gameState.board, gameState.turn);
  }, [gameState?.board, gameState?.turn, gameState?.gameStatus]);

  const clearSelection = useCallback(() => {
    clearPremoveSelection();
    setShowPremoveMoveTargets(false);

    setGameState((previousState) => {
      if (!previousState || previousState.selected === null) {
        return previousState;
      }

      return {
        ...previousState,
        selected: null,
        legalMoves: [],
      };
    });
  }, [clearPremoveSelection]);

  return {
    phase,
    gameState,
    startGame,
    rematch,
    resign,
    goToIntro,
    handleSquareClick,
    isCurrentTurnInCheck,
    clearSelection,
    cancelPremove,
    displayBoard,
    premoveSelection,
    premoveLegalMoves,
    premoveQueue,
  };
}
