import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildNoMoveGameOver, createInitialGameState, resolveMoveState } from "./gameState";
import { getBotMove, getLegalMoves, isInCheck, pieceColor } from "./logic";

function randomPlayerColor() {
  return Math.random() < 0.5 ? "w" : "b";
}

export function useChessGame() {
  const [phase, setPhase] = useState("intro");
  const [gameState, setGameState] = useState(null);

  const timerRef = useRef(null);
  const tickRef = useRef(null);
  const botRef = useRef(false);

  const startGame = useCallback(() => {
    botRef.current = false;
    setGameState(createInitialGameState(randomPlayerColor()));
    setPhase("playing");
  }, []);

  const rematch = useCallback(() => {
    botRef.current = false;
    setGameState(createInitialGameState(randomPlayerColor()));
  }, []);

  const goToIntro = useCallback(() => {
    clearInterval(timerRef.current);
    botRef.current = false;
    setGameState(null);
    setPhase("intro");
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

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
      setGameState((previousState) => {
        if (
          !previousState ||
          previousState.gameStatus !== "playing" ||
          previousState.turn === previousState.playerColor
        ) {
          botRef.current = false;
          return previousState;
        }

        const move = getBotMove(
          previousState.board,
          previousState.turn,
          previousState.castling,
          previousState.enPassant,
        );

        botRef.current = false;
        if (!move) {
          return buildNoMoveGameOver(previousState);
        }

        return resolveMoveState(previousState, move.from, move.to);
      });
    }, 900);

    return () => clearTimeout(timeoutId);
  }, [gameState?.turn, gameState?.gameStatus, gameState?.playerColor]);

  const handleSquareClick = useCallback((row, column) => {
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
          return resolveMoveState(previousState, previousState.selected, [row, column]);
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
  }, []);

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
  };
}
