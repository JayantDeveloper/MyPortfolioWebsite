import { useMemo } from "react";
import {
  BOARD_DEPTH_OFFSET,
  DARK_SQUARE_COLOR,
  LAST_MOVE_DARK_SQUARE_COLOR,
  LAST_MOVE_LIGHT_SQUARE_COLOR,
  LIGHT_SQUARE_COLOR,
  SELECTED_DARK_SQUARE_COLOR,
  SELECTED_LIGHT_SQUARE_COLOR,
  squareCenter,
} from "../constants";
import { pieceColor, pieceType } from "../logic";
import BoardBase from "./BoardBase";
import BoardName from "./BoardName";
import MoveDot from "./MoveDot";
import PieceGeometry from "./pieces/PieceGeometry";

function resolveSquareColor(row, column, selected, lastMove) {
  const lightSquare = (row + column) % 2 === 0;
  const isSelected = selected && selected[0] === row && selected[1] === column;
  const isFromSquare =
    lastMove && lastMove.from[0] === row && lastMove.from[1] === column;
  const isToSquare = lastMove && lastMove.to[0] === row && lastMove.to[1] === column;

  if (isSelected) {
    return lightSquare ? SELECTED_LIGHT_SQUARE_COLOR : SELECTED_DARK_SQUARE_COLOR;
  }

  if (isFromSquare || isToSquare) {
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
  lastMove,
  gameStatus,
}) {
  const legalTargets = useMemo(() => {
    const targets = new Set();
    legalMoves.forEach(([row, column]) => targets.add(`${row},${column}`));
    return targets;
  }, [legalMoves]);

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
          resolveSquareColor(row, column, selected, lastMove)
        }
      />

      <BoardName rotationY={nameRotationY} />

      {legalMoves.map(([row, column]) => {
        if (board[row][column]) return null;
        return (
          <MoveDot
            key={`move-dot-${row}-${column}`}
            position={[squareCenter(column), 0.06, squareCenter(row)]}
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
          const canInteract =
            gameStatus === "playing" &&
            ((turn === playerColor && color === playerColor) || isLegalTarget);

          return (
            <PieceGeometry
              key={`piece-${row}-${column}`}
              type={type}
              color={color}
              position={[squareCenter(column), 0.04, squareCenter(row)]}
              selected={selected && selected[0] === row && selected[1] === column}
              legalTarget={isLegalTarget}
              interactive={canInteract}
              onClick={canInteract ? () => onSquareClick(row, column) : undefined}
            />
          );
        }),
      )}
    </group>
  );
}
