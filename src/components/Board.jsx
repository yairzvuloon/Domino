import React from "react";
import Piece, { EmptyPiece } from "./Piece.jsx";

const BoardRow = props => {
  const { row } = props;
  return row.map((dominoPiece, j) => {
    if (!dominoPiece)
      return (
        <td key={j}>
          <EmptyPiece />
        </td>
      );
    const { side1, side2, isLaying } = dominoPiece;
    return (
      <td key={j}>
        <Piece side1={side1} side2={side2} isLaying={isLaying} />
      </td>
    );
  });
};

const Board = props => {
  const { cells } = props;
  return (
    <table>
      <tbody>
        {cells.map((row, i) => (
          <tr key={i}>
            <BoardRow row={row} />
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Board;
