import React from "react";

const getDegree = (isLaying, side1, side2) => {
  var deg;
  if (!isLaying && side1 < side2) deg = 0;
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

const Piece = props => {
  const { side1, side2, isLaying } = props;

  const imgName = getImageName(side1, side2);
  const imagePath = require("../resources/pieces/" + imgName + ".svg");
  const degree = getDegree(isLaying, side1, side2);
  const transform = "rotate(" + degree + "deg)";
  return (
    <div style={{ ...style.container }}>
      <img src={imagePath} style={{ ...style.image, transform }} />
    </div>
  );
};

export default Piece;

export const EmptyPiece = () => <div style={{ ...style.container }} />;
export const ValidPiece = () => <div style={{ ...style.ValidPiece }} />;


const size = "9vw";
const style = {
  image: {
    width: size,
    height: size,
  },
  container: {
    width: size,
    height: size,
    backgroundColor: "red"
  }, ValidPiece:{
    width: size,
    height: size,
    backgroundColor: "green"
  }
};
