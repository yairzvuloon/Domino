import React from "react";
import Board from "../components/Board.jsx";
import Cart from "../components/Cart.jsx";
import HomeStyle from "../style/HomeStyle.css";

const createEmptyBoard = size => {
  let matrix = new Array(size);
  for (let i = 0; i < size; i++) {
    matrix[i] = new Array(size);
    for (let j = 0; j < size; j++) {
      matrix[i][j] = new card(false);
    }
  }
  return matrix;
};

const setInitialBoard = size => {
  let board = createEmptyBoard(size);
  let mid = Math.floor(size / 2);
  board[mid][mid].valid = true;
  return board;
};

const createShuffledArray = size => {
  let a = new Array(size);
  for (let i = 0; i < size; i++) {
    a[i] = i;
  }
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const createCardsArray = () => {
  let arr = new Array(28);
  let arrIndex = 0;
  for (let i = 0; i < 7; i++) {
    for (let j = i; j < 7; j++) {
      arr[arrIndex] = { valid: true, side1: i, side2: j };
      console.log(arr[arrIndex]);
      arrIndex++;
    }
  }
  return arr;
};

const setInitialCart = i_DominoBox => {
  let cart = new Array(6);
  for (let i = 0; i < 7; i++) {
    cart[i] = i_DominoBox.getCard();
    console.log("cart[" + i + "]: " + cart[i]);
  }
  return cart;
};

class DominoBox {
  constructor() {
    this.indexesCardsBox = createShuffledArray(28);
    this.indexesCardsBoxIndex = 27;
    this.cardsArray = createCardsArray();
  }
  print() {
    for (let i = 0; i < 28; i++) {
      console.log(this.indexesCardsBox[i]);
    }
  }
  getCard() {
    let ret = null;
    if (this.indexesCardsBoxIndex > 0) {
      let cardIndex = this.indexesCardsBox.pop();
      ret = this.cardsArray[cardIndex];
      this.indexesCardsBoxIndex--;
      console.log("in getCard()");
      console.log("card: " + ret.side1 + ", " + ret.side2);
    }
    return ret;
  }
}

class card {
  constructor(i_Valid, i_Side1, i_Side2, i_IsLaying) {
    this.valid = i_Valid;
    this.side1 = i_Side1;
    this.side2 = i_Side2;
    this.isLaying = i_IsLaying;
  }
}
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.cardsBox = new DominoBox();
    //this.cardsBox.print();
    const initialBoard = setInitialBoard(57);
    const initialCart = setInitialCart(this.cardsBox);
    this.state = {
      boardMap: initialBoard,
      cartMap: initialCart
    };
  }

  render() {
    return (
      <div id="home">
        <Board cells={this.state.boardMap} />
        <Cart cart={this.state.cartMap} />
      </div>
    );
  }
}

export default Home;
