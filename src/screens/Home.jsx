import React from "react";
import Board from "../components/Board.jsx";
import Cart from "../components/Cart.jsx";
import HomeStyle from "../style/HomeStyle.css";

const createEmptyBoard = size => {
  let matrix = new Array(size);
  for (let i = 0; i < size; i++) {
    matrix[i] = new Array(size);
    for (let j = 0; j < size; j++) {
      matrix[i][j] = new Card(false);
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
      arr[arrIndex] = { valid: undefined, side1: i, side2: j };
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
class Card {
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
      cartMap: initialCart,
      selectedCard: null
    };
    this.validLocationsByNumber = [...Array(7)].map(x => Array(0));
  }

  render() {
    return (
      <div id="homeContainer">
        <div id="boardFrame">
          <Board
            cells={this.state.boardMap}
            onClick={(i, j) => this.handleBoardClick(i, j)}
          />
        </div>
        <Cart
          id="cartStyle"
          cart={this.state.cartMap}
          onClick={(i, value) => this.handleCartClick(i, value)}
        />
      </div>
    );
  }
  isEmptyAndNotValid(row, col) {
    const { boardMap } = this.state;
    return (
      boardMap[row][col].valid !== true &&
      boardMap[row][col].isLaying === undefined
    );
  }

  setCellValid(board, row, col) {
    console.log(
      "in SetCellValid" + "in col:" + col + "in rows" + row + board[row][col]
    );
    board[row][col].valid = true;
  }

  updateValidCellsInBoard(board, card) {
    const { side1, side2 } = card;

    for (let col = 0; col < this.validLocationsByNumber[side1].length; col++) {
      this.setCellValid(
        board,
        this.validLocationsByNumber[side1][col].i,
        this.validLocationsByNumber[side1][col].j
      );
    }

    for (let col = 0; col < this.validLocationsByNumber[side2].length; col++) {
      this.setCellValid(
        board,
        this.validLocationsByNumber[side2][col].i,
        this.validLocationsByNumber[side2][col].j
      );
    }
  }

  updateValidLocationsByNumber(row, col, card) {
    const { isLaying } = card;
    if (isLaying) {
      if (this.isEmptyAndNotValid(row, col - 1)) {
        this.validLocationsByNumber[card.side1].push({
          i: row,
          j: col - 1
        });
      }
      if (this.isEmptyAndNotValid(row, col + 1)) {
        this.validLocationsByNumber[card.side2].push({
          i: row,
          j: col + 1
        });
      }
    } else if (isLaying === false) {
      if (this.isEmptyAndNotValid(row - 1, col)) {
        this.validLocationsByNumber[card.side1].push({
          i: row - 1,
          j: col
          // laying: isLaying
        });
      }
      if (this.isEmptyAndNotValid(row + 1, col)) {
        this.validLocationsByNumber[card.side2].push({
          i: row + 1,
          j: col
        });
      }
    }
  }

  removeValidLocation(row, col, card) {
    let value = { row, col };
    this.validLocationsByNumber[card.side1] = this.validLocationsByNumber[
      card.side1
    ].filter(item => item !== value);
    this.validLocationsByNumber[card.side2] = this.validLocationsByNumber[
      card.side2
    ].filter(item => item !== value);
  }

  locatePieceOnBoard(row, col, card) {
    const newBoardMap = this.state.boardMap.slice();
    if (card.side1 === card.side2) {
      card.isLaying = !card.isLaying;
    }
    newBoardMap[row][col] = card;
    this.removeValidLocation(row, col, card);
    this.updateValidLocationsByNumber(row, col, card);
    this.setState(() => ({ boardMap: newBoardMap }));
  }

  handleBoardClick(i, j) {
    const { boardMap } = this.state;
    if (this.state.selectedCard) {
      //we need to that in the next: isLaying=getPosition(i,j)
      const { side1, side2 } = this.state.selectedCard;
      console.log("clicked" + i + j);
      let row = i;
      let col = j;
      let card = new Card(false, side1, side2, true);
      if (
        boardMap[row][col + 1].side1 === side1 ||
        boardMap[row][col + 1].side2 === side2||
        boardMap[row][col - 1].side1 === side1 ||
        boardMap[row][col - 1].side2 === side2 ||
        boardMap[row - 1][col].side1 === side1 ||
        boardMap[row - 1][col].side2 === side2 ||
        boardMap[row + 1][col].side1 === side1||
        boardMap[row + 1][col].side2 === side2
      ) {
        card = new Card(false, side2, side1, true);
      }
      this.locatePieceOnBoard(i, col, card);
    }
  }

  handleCartClick(i, value) {
    console.log("clicked" + i);
    const newCartMap = this.state.cartMap.slice();
    for (let i = 0; i < 7; i++) {
      newCartMap[i].valid = undefined;
    }
    newCartMap[i].valid = true;
    const newBoardMap = this.state.boardMap.slice();
    this.updateValidCellsInBoard(newBoardMap, value);
    this.setState(() => ({
      boardMap: newBoardMap,
      cartMap: newCartMap,
      selectedCard: value
    }));
  }
}

export default Home;
