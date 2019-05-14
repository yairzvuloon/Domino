import React from "react";
import Piece, { EmptyPiece } from "./Piece.jsx";
import { ValidPiece } from "./Piece.jsx";
import BoardStyle from "../style/BoardStyle.css";

const BoardRow = props => {
  const { row } = props;
  return row.map((dominoPiece, j) => {
    const { valid, side1, side2, isLaying } = dominoPiece;
    let ret = (
      <td key={j}>
        <Piece side1={side1} side2={side2} isLaying={isLaying} />
      </td>
    );
    if (!valid && side1 === undefined)
      ret = (
        <td key={j}>
          <EmptyPiece />
        </td>
      );
    if (!side1)
      ret = (
        <td key={j}>
          <ValidPiece />
        </td>
      );
      return ret;
  });
};

const Board = props => {
  const { cells } = props;
  return (
    <table id="boardGame">
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
