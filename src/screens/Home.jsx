import React from "react";
import Board from "../components/Board.jsx";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cells: [
        [null, { side1: 1, side2: 3, isLaying: true }],
        [null, { side1: 1, side2: 3, isLaying: false }]
      ]
    };
  }

  render() {
    return (
      <div>
        <h1>Domino</h1>
        <Board cells={this.state.cells}/>
      </div>
    );
  }
}

export default Home;
