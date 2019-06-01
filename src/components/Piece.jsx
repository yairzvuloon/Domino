import React from "react";

const Piece = props => {
  const { valid, side1, side2, isLaying } = props;

  const cardInCartSelected = valid;

  const getDegree = (isLaying, side1, side2) => {
    var deg;
    if (!isLaying && side1 <= side2) deg = 0;
    else {
      if (isLaying === true) deg = 90;
      else deg = 180;

      if (side1 < side2) deg *= -1;
    }

    return deg;
  };
  //the format of piece image name is "p{minNumberSide}_{maxNumberSide}"
  const getImageName = (side1, side2) => {
    return "p" + Math.min(side1, side2) + "_" + Math.max(side1, side2);
  };

  const imgName = getImageName(side1, side2);
  const imagePath = require("../resources/pieces/" + imgName + ".svg");
  const degree = getDegree(isLaying, side1, side2);
  const transform = "rotate(" + degree + "deg)";
  let styleCopy = null;
  cardInCartSelected
    ? (styleCopy = { ...style.ValidPiece })
    : (styleCopy = { ...style.container });
  return (
    <div style={styleCopy}>
      <img src={imagePath} style={{ ...style.image, transform }} />
    </div>
  );
};

export default Piece;

export const EmptyPiece = () => <div style={{ ...style.container }} />;

export const ValidPiece = () => <div style={{ ...style.ValidPiece }} />;

const size = "5vw";
const style = {
  image: {
    width: size,
    height: size
  },
  container: {
    width: size,
    height: size,
    backgroundColor: "white"
  },
  ValidPiece: {
    width: size,
    height: size,
    backgroundColor: "green"
  }
};
