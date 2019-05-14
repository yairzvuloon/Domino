import React from "react";
import Board from "../components/Board.jsx";
import HomeStyle from "../style/HomeStyle.css";


const createEmptyBoard = (size) => {
  let matrix = new Array(size);
  for (let i = 0; i < size; i++) {
    matrix[i] = new Array(size);
    for (let j = 0; j < size; j++) {
      matrix[i][j] = {valid:false, side1: 3, side2: 3, isLaying: true };
    }
  }
  return matrix;
};

const setInitialBoard=(size)=>{
let board = createEmptyBoard(size);
let mid=Math.floor(size/2);
board[mid][mid]={valid: true};
 return board;
}
class Home extends React.Component {
  constructor(props) {
    super(props);
    const initialBoard = setInitialBoard(57);
    this.state = {
      cells:initialBoard /*[
        [{valid: true}, {valid:false, side1: 3, side2: 3, isLaying: true }],
        [{valid: true}, {valid:false, side1: 3, side2: 2, isLaying: false }]
      ]*/
    };
  }

  render() {
    return (
      <div id="home">
        <Board cells={this.state.cells} />
      </div>
    );
  }
}

export default Home;
