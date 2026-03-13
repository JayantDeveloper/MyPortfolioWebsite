import { useCallback, useMemo, useRef, useState } from "react";
import { Plane, Vector3 } from "three";
import {
  BOARD_DEPTH_OFFSET,
  DARK_SQUARE_COLOR,
  LAST_MOVE_DARK_SQUARE_COLOR,
  LAST_MOVE_LIGHT_SQUARE_COLOR,
  LIGHT_SQUARE_COLOR,
  N_SQ,
  OFF,
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
  const dragMovedRef = useRef(false);
  const skipNextClickRef = useRef(false);
  const boardGroupRef = useRef(null);
  const dragPlane = useMemo(() => new Plane(new Vector3(0, 1, 0), 0), []);
  const dragIntersectionRef = useRef(new Vector3());
  const [dragVisual, setDragVisual] = useState(null);

  const legalTargets = useMemo(() => {
    const targets = new Set();
    activeMoves.forEach(([row, column]) => targets.add(`${row},${column}`));
    return targets;
  }, [activeMoves]);

  const clampToBoard = useCallback((value) => {
    const min = OFF + 0.01;
    const max = OFF + N_SQ - 0.01;
    return Math.max(min, Math.min(max, value));
  }, []);

  const projectRayToBoard = useCallback(
    (ray) => {
      if (!ray || !boardGroupRef.current) return null;
      if (!ray.intersectPlane(dragPlane, dragIntersectionRef.current)) return null;
      const localPoint = boardGroupRef.current.worldToLocal(
        dragIntersectionRef.current.clone(),
      );
      return {
        x: clampToBoard(localPoint.x),
        z: clampToBoard(localPoint.z),
      };
    },
    [clampToBoard, dragPlane],
  );

  const pointToSquare = useCallback((point) => {
    if (!point) return null;
    const row = Math.max(0, Math.min(N_SQ - 1, Math.floor(point.z - OFF)));
    const column = Math.max(0, Math.min(N_SQ - 1, Math.floor(point.x - OFF)));
    return [row, column];
  }, []);

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
    (row, column, event) => {
      draggingFromRef.current = [row, column];
      dragMovedRef.current = false;
      // Selection happens on pointer-down; suppress the follow-up click event.
      skipNextClickRef.current = true;
      handleSquareSelection(row, column);

      const dragPoint = projectRayToBoard(event?.ray);
      setDragVisual({
        row,
        column,
        position: [
          dragPoint?.x ?? squareCenter(column),
          0.24,
          dragPoint?.z ?? squareCenter(row),
        ],
      });
    },
    [handleSquareSelection, projectRayToBoard],
  );

  const handlePieceDragMove = useCallback(
    (event) => {
      const draggingFrom = draggingFromRef.current;
      if (!draggingFrom) return;

      const dragPoint = projectRayToBoard(event?.ray);
      if (!dragPoint) return;

      const [fromRow, fromColumn] = draggingFrom;
      if (
        Math.abs(dragPoint.x - squareCenter(fromColumn)) > 0.06 ||
        Math.abs(dragPoint.z - squareCenter(fromRow)) > 0.06
      ) {
        dragMovedRef.current = true;
      }

      setDragVisual({
        row: fromRow,
        column: fromColumn,
        position: [dragPoint.x, 0.24, dragPoint.z],
      });
    },
    [projectRayToBoard],
  );

  const handlePieceDragEnd = useCallback(
    (event) => {
      const draggingFrom = draggingFromRef.current;
      draggingFromRef.current = null;
      setDragVisual(null);

      if (!draggingFrom) return;

      const [fromRow, fromColumn] = draggingFrom;
      const wasMoved = dragMovedRef.current;
      dragMovedRef.current = false;
      if (!wasMoved) return;

      const dragPoint = projectRayToBoard(event?.ray);
      const targetSquare = pointToSquare(dragPoint);
      if (!targetSquare) return;

      const [targetRow, targetColumn] = targetSquare;
      if (fromRow === targetRow && fromColumn === targetColumn) return;

      skipNextClickRef.current = true;
      handleSquareSelection(targetRow, targetColumn);
    },
    [handleSquareSelection, pointToSquare, projectRayToBoard],
  );

  const nameRotationY = playerColor === "b" ? Math.PI : 0;
  const resolvedBoardOffsetZ =
    boardOffsetZ ?? (playerColor === "w" ? -BOARD_DEPTH_OFFSET : BOARD_DEPTH_OFFSET);

  return (
    <group
      ref={boardGroupRef}
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
          const isDraggedPiece =
            dragVisual && dragVisual.row === row && dragVisual.column === column;
          const position = isDraggedPiece
            ? dragVisual.position
            : [squareCenter(column), 0.04, squareCenter(row)];

          return (
            <PieceGeometry
              key={`piece-${row}-${column}`}
              type={type}
              color={color}
              position={position}
              selected={isSelectedPiece}
              legalTarget={isLegalTarget}
              premoved={false}
              onDragStart={(event) => handlePieceDragStart(row, column, event)}
              onDragMove={handlePieceDragMove}
              onDragEnd={handlePieceDragEnd}
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
