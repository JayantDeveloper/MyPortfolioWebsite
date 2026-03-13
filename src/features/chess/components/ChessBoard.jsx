import { useCallback, useMemo, useRef } from "react";
import {
  BOARD_DEPTH_OFFSET,
  DARK_SQUARE_COLOR,
  LAST_MOVE_DARK_SQUARE_COLOR,
  LAST_MOVE_LIGHT_SQUARE_COLOR,
  LIGHT_SQUARE_COLOR,
  PREMOVE_DARK_SQUARE_COLOR,
  PREMOVE_LIGHT_SQUARE_COLOR,
  SELECTED_DARK_SQUARE_COLOR,
  SELECTED_LIGHT_SQUARE_COLOR,
  squareCenter,
} from "../constants";
import { pieceColor, pieceType } from "../logic";
import BoardBase from "./BoardBase";
import BoardName from "./BoardName";
import MoveDot from "./MoveDot";
import PieceGeometry from "./pieces/PieceGeometry";

function resolveSquareColor(
  row,
  column,
  selected,
  moveHighlights,
  premoveSelection,
  premoveQueue,
  isPlayerTurn,
) {
  const lightSquare = (row + column) % 2 === 0;
  const isSelected = selected && selected[0] === row && selected[1] === column;
  const isQueuedPremoveSquare = premoveQueue.some(
    (move) =>
      (move.from[0] === row && move.from[1] === column) ||
      (move.to[0] === row && move.to[1] === column),
  );
  const isCommittedMoveSquare = moveHighlights.some(
    (move) =>
      (move.from[0] === row && move.from[1] === column) ||
      (move.to[0] === row && move.to[1] === column),
  );

  if (!isPlayerTurn && isQueuedPremoveSquare) {
    return lightSquare ? PREMOVE_LIGHT_SQUARE_COLOR : PREMOVE_DARK_SQUARE_COLOR;
  }

  if (isSelected) {
    return lightSquare ? SELECTED_LIGHT_SQUARE_COLOR : SELECTED_DARK_SQUARE_COLOR;
  }

  if (isCommittedMoveSquare) {
    return lightSquare ? LAST_MOVE_LIGHT_SQUARE_COLOR : LAST_MOVE_DARK_SQUARE_COLOR;
  }

  return lightSquare ? LIGHT_SQUARE_COLOR : DARK_SQUARE_COLOR;
}

export default function ChessBoard({
  board,
  turn,
  playerColor,
  selected,
  legalMoves,
  onSquareClick,
  moveHighlights,
  gameStatus,
  premoveSelection,
  premoveLegalMoves,
  premoveQueue,
  boardOffsetZ,
}) {
  const activeMoves = premoveSelection ? premoveLegalMoves : legalMoves;
  const isPlayerTurn = turn === playerColor;
  const draggingFromRef = useRef(null);
  const skipNextClickRef = useRef(false);

  const legalTargets = useMemo(() => {
    const targets = new Set();
    activeMoves.forEach(([row, column]) => targets.add(`${row},${column}`));
    return targets;
  }, [activeMoves]);

  const handleSquareSelection = useCallback(
    (row, column) => {
      onSquareClick(row, column);
    },
    [onSquareClick],
  );

  const handleSquareSelectionWithGuard = useCallback(
    (row, column) => {
      if (skipNextClickRef.current) {
        skipNextClickRef.current = false;
        return;
      }

      handleSquareSelection(row, column);
    },
    [handleSquareSelection],
  );

  const handlePieceDragStart = useCallback(
    (row, column) => {
      draggingFromRef.current = [row, column];
      // Selection happens on pointer-down; suppress the follow-up click event.
      skipNextClickRef.current = true;
      handleSquareSelection(row, column);
    },
    [handleSquareSelection],
  );

  const handlePieceDragEnd = useCallback(
    (row, column) => {
      const draggingFrom = draggingFromRef.current;
      draggingFromRef.current = null;

      if (!draggingFrom) {
        return;
      }

      const [fromRow, fromColumn] = draggingFrom;
      if (fromRow === row && fromColumn === column) {
        return;
      }

      skipNextClickRef.current = true;
      handleSquareSelection(row, column);
    },
    [handleSquareSelection],
  );

  const handleSquarePointerUp = useCallback(
    (row, column) => {
      const draggingFrom = draggingFromRef.current;
      if (!draggingFrom) {
        return;
      }

      draggingFromRef.current = null;
      const [fromRow, fromColumn] = draggingFrom;
      if (fromRow === row && fromColumn === column) {
        return;
      }

      skipNextClickRef.current = true;
      handleSquareSelection(row, column);
    },
    [handleSquareSelection],
  );

  const handleSquarePointerDown = useCallback(
    (row, column) => {
      draggingFromRef.current = null;
    },
    [],
  );

  const nameRotationY = playerColor === "b" ? Math.PI : 0;
  const resolvedBoardOffsetZ =
    boardOffsetZ ?? (playerColor === "w" ? -BOARD_DEPTH_OFFSET : BOARD_DEPTH_OFFSET);

  return (
    <group
      position={[0, 0, resolvedBoardOffsetZ]}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
    >
      <BoardBase
        interactive={gameStatus === "playing"}
        onSquareClick={handleSquareSelectionWithGuard}
        getSquareColor={(row, column) =>
          resolveSquareColor(
            row,
            column,
            selected,
            moveHighlights,
            premoveSelection,
            premoveQueue,
            isPlayerTurn,
          )
        }
        onSquarePointerDown={handleSquarePointerDown}
        onSquarePointerUp={handleSquarePointerUp}
      />

      <BoardName rotationY={nameRotationY} />

      {activeMoves.map(([row, column]) => {
        if (board[row][column]) return null;
        return (
          <MoveDot
            key={`move-dot-${row}-${column}`}
            position={[squareCenter(column), 0.06, squareCenter(row)]}
            color={
              "#44ff88"
            }
            onClick={() => handleSquareSelectionWithGuard(row, column)}
          />
        );
      })}

      {board.map((rowArray, row) =>
        rowArray.map((piece, column) => {
          if (!piece) return null;

          const color = pieceColor(piece);
          const type = pieceType(piece);
          const isLegalTarget = legalTargets.has(`${row},${column}`);
          const isSelectedPiece =
            (selected && selected[0] === row && selected[1] === column) ||
            (premoveSelection &&
              premoveSelection[0] === row &&
              premoveSelection[1] === column);
          const canInteract = gameStatus === "playing" && (color === playerColor || isLegalTarget);

          return (
            <PieceGeometry
              key={`piece-${row}-${column}`}
              type={type}
              color={color}
              position={[squareCenter(column), 0.04, squareCenter(row)]}
              selected={isSelectedPiece}
              legalTarget={isLegalTarget}
              premoved={false}
              onDragStart={() => handlePieceDragStart(row, column)}
              onDragEnd={() => handlePieceDragEnd(row, column)}
              interactive={canInteract}
              onClick={
                canInteract ? () => handleSquareSelectionWithGuard(row, column) : undefined
              }
            />
          );
        }),
      )}
    </group>
  );
}
