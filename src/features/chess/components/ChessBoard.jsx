import { useMemo } from "react";
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

function resolveSquareColor(row, column, selected, lastMove, premoveSelection, premoveQueue) {
  const lightSquare = (row + column) % 2 === 0;
  const isSelected = selected && selected[0] === row && selected[1] === column;
  const isPremoveSelected =
    premoveSelection && premoveSelection[0] === row && premoveSelection[1] === column;
  const isQueuedPremoveSquare = premoveQueue.some(
    (move) =>
      (move.from[0] === row && move.from[1] === column) ||
      (move.to[0] === row && move.to[1] === column),
  );
  const isFromSquare =
    lastMove && lastMove.from[0] === row && lastMove.from[1] === column;
  const isToSquare = lastMove && lastMove.to[0] === row && lastMove.to[1] === column;

  if (isSelected) {
    return lightSquare ? SELECTED_LIGHT_SQUARE_COLOR : SELECTED_DARK_SQUARE_COLOR;
  }

  if (isFromSquare || isToSquare) {
    return lightSquare ? LAST_MOVE_LIGHT_SQUARE_COLOR : LAST_MOVE_DARK_SQUARE_COLOR;
  }

  if (isPremoveSelected || isQueuedPremoveSquare) {
    return lightSquare ? PREMOVE_LIGHT_SQUARE_COLOR : PREMOVE_DARK_SQUARE_COLOR;
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
  lastMove,
  gameStatus,
  premoveSelection,
  premoveLegalMoves,
  premoveQueue,
}) {
  const activeMoves = premoveSelection ? premoveLegalMoves : legalMoves;

  const legalTargets = useMemo(() => {
    const targets = new Set();
    activeMoves.forEach(([row, column]) => targets.add(`${row},${column}`));
    return targets;
  }, [activeMoves]);
  const premoveTargets = useMemo(() => {
    const targets = new Set();
    premoveQueue.forEach(({ to }) => targets.add(`${to[0]},${to[1]}`));
    return targets;
  }, [premoveQueue]);

  const nameRotationY = playerColor === "b" ? Math.PI : 0;
  const boardOffsetZ = playerColor === "w" ? -BOARD_DEPTH_OFFSET : BOARD_DEPTH_OFFSET;

  return (
    <group
      position={[0, 0, boardOffsetZ]}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
    >
      <BoardBase
        interactive={gameStatus === "playing"}
        onSquareClick={onSquareClick}
        getSquareColor={(row, column) =>
          resolveSquareColor(
            row,
            column,
            selected,
            lastMove,
            premoveSelection,
            premoveQueue,
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
            color={premoveSelection ? "#8f96ff" : undefined}
            emissive={premoveSelection ? "#b9c1ff" : undefined}
            opacity={premoveSelection ? 0.82 : undefined}
            onClick={() => onSquareClick(row, column)}
          />
        );
      })}

      {board.map((rowArray, row) =>
        rowArray.map((piece, column) => {
          if (!piece) return null;

          const color = pieceColor(piece);
          const type = pieceType(piece);
          const isLegalTarget = legalTargets.has(`${row},${column}`);
          const isPremoved = premoveTargets.has(`${row},${column}`);
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
              premoved={isPremoved}
              interactive={canInteract}
              onClick={canInteract ? () => onSquareClick(row, column) : undefined}
            />
          );
        }),
      )}
    </group>
  );
}
