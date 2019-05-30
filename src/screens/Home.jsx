import React from "react";
import Board from "../components/Board.jsx";
import Cart from "../components/Cart.jsx";
import Timer from "../components/Timer.jsx";
import "../style/HomeStyle.css";
import { DominoStackLogic } from "../utilities/Manager";
import Stats from "../components/Stats.jsx";
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
    const initialBoard = this.setInitialBoard(57);
    const initialCart = this.setInitialCart();
    this.state = {
      boardMap: initialBoard,
      cartMap: initialCart,
      selectedCard: null,
      currentScore: 0,
      turn: 0
    };
    this.validLocationsArray = this.createEmptyValidLocations();
    this.isDataTimerNeeded = false;
    this.lastPieceStats = null;
  }

  createEmptyBoard(size) {
    let matrix = new Array(size);
    for (let i = 0; i < size; i++) {
      matrix[i] = new Array(size);
      for (let j = 0; j < size; j++) {
        matrix[i][j] = new Card(false);
      }
    }
    return matrix;
  }

  setInitialBoard(size) {
    let board = this.createEmptyBoard(size);
    let mid = Math.floor(size / 2);
    board[mid][mid].valid = true;
    return board;
  }

  setInitialCart() {
    let cart = new Array(7);
    for (let i = 0; i < 7; i++) {
      cart[i] = DominoStackLogic.getCard();
    }
    return cart;
  }

  createEmptyValidLocations() {
    let matrix = new Array(7);
    for (let i = 0; i < 7; i++) {
      matrix[i] = new Array(0);
    }
    return matrix;
  }

  isEmptyAndNotValid(row, col) {
    const { boardMap } = this.state;
    return (
      boardMap[row][col].valid !== true &&
      boardMap[row][col].isLaying === undefined
    );
  }

  updateValidLocationsByNumber(row, col, card) {
    const { isLaying } = card;
    const isJoker = card.side1 === card.side2;
    if (isJoker || isLaying) {
      if (this.isEmptyAndNotValid(row, col - 1)) {
        this.validLocationsArray[card.side1].push({
          i: row,
          j: col - 1
        });
      }
      if (this.isEmptyAndNotValid(row, col + 1)) {
        this.validLocationsArray[card.side2].push({
          i: row,
          j: col + 1
        });
      }
    }
    if (isJoker || isLaying === false) {
      if (this.isEmptyAndNotValid(row - 1, col)) {
        this.validLocationsArray[card.side1].push({
          i: row - 1,
          j: col
          // laying: isLaying
        });
      }
      if (this.isEmptyAndNotValid(row + 1, col)) {
        this.validLocationsArray[card.side2].push({
          i: row + 1,
          j: col
        });
      }
    }
  }

  createCopyRow(matrix, i_Row) {
    let size = 0;
    if (matrix[i_Row]) size = matrix[i_Row].length;

    const array = new Array(size);
    for (let i = 0; i < size; i++) {
      array[i] = matrix[i_Row][i];
    }
    return array;
  }

  removeRowColElementFromArray(arr, row, col) {
    let val = false;
    for (var idx = 0; idx < arr.length; idx++)
      if (arr[idx].i === row && arr[idx].j === col) {
        val = arr[idx].i === row && arr[idx].j === col;
        arr.splice(idx, 1);
        break;
      }
    return val;
  }

  removeValidLocation(row, col, card) {
    let length1 = this.validLocationsArray[card.side1].length;
    let length2 = this.validLocationsArray[card.side2].length;
    let arr1 = this.createCopyRow(this.validLocationsArray, card.side1);
    let arr2 = this.createCopyRow(this.validLocationsArray, card.side2);
    let output1 = this.removeRowColElementFromArray(arr1, row, col);
    let output2 = this.removeRowColElementFromArray(arr2, row, col);

    if (output1) {
      length1--;
      this.validLocationsArray[card.side1] = new Array(length1);
      for (let i = 0; i < length1; i++) {
        this.validLocationsArray[card.side1][i] = arr1[i];
      }
    }

    if (output2) {
      length2--;
      this.validLocationsArray[card.side2] = new Array(length2);
      for (let i = 0; i < length2; i++) {
        this.validLocationsArray[card.side2][i] = arr2[i];
      }
    }
  }

  removePieceFromCart() {
    const { index } = this.state.selectedCard;
    this.setState(prevState => {
      const newCartMap = this.getCartMapAfterRemoveCard(
        index,
        prevState.cartMap
      );
      return {
        cartMap: newCartMap
      };
    });
  }

  getCartMapAfterRemoveCard(index, cartMap) {
    cartMap[index] = new Card(false);
    return cartMap;
  }

  locatePieceOnBoard(row, col, card) {
    if (card.side1 === card.side2) {
      card.isLaying = !card.isLaying;
    }
    this.removeValidLocation(row, col, card);
    this.updateValidLocationsByNumber(row, col, card);
    this.removePieceFromCart();
    //this.lastPiece = card;
    let addition = card.side1 + card.side2;
    this.isDataTimerNeeded = true;
    this.setState(prevState => {
      const newBoardMap = this.getUpdatedBoard(
        [...prevState.boardMap],
        card,
        row,
        col
      );
      const newScore = this.getUpdatedScore(prevState.currentScore, addition);
      const newTurn = prevState.turn + 1;
      return { boardMap: newBoardMap, currentScore: newScore, turn: newTurn };
    });
  }

  getUpdatedScore(score, addition) {
    score += addition;
    return score;
  }

  getUpdatedBoard(board, card, row, col) {
    board[row][col] = card;
    this.updateValidCellsInBoard(board, card, false);
    return board;
  }

  checkNeighborPiece(row, col) {
    const { boardMap } = this.state;
    let obj = null;
    if (this.state.selectedCard) {
      const { side1, side2 } = this.state.selectedCard["value"];

      if (
        boardMap[row][col].side1 === side1 ||
        boardMap[row][col].side2 === side2 ||
        boardMap[row][col].side1 === side2 ||
        boardMap[row][col].side2 === side1
      ) {
        obj = { row: row, col: col };
      }
    }
    return obj;
  }

  checkPiecePosition(neighborName, neighborPiece, side1, side2) {
    return (
      (side1 === neighborPiece.side1 &&
        (neighborName === "down" || neighborName === "right")) ||
      (side2 === neighborPiece.side2 &&
        (neighborName === "up" || neighborName === "left"))
    );
  }

  NeighborsObj(up, down, left, right) {
    this.up = up;
    this.down = down;
    this.left = left;
    this.right = right;
  }

  getNeighborsObj(row, col) {
    let neighborsObj = new this.NeighborsObj(
      this.checkNeighborPiece(row - 1, col),
      this.checkNeighborPiece(row + 1, col),
      this.checkNeighborPiece(row, col - 1),
      this.checkNeighborPiece(row, col + 1)
    );
    return neighborsObj;
  }

  selectPosition(neighborName, piece) {
    let position = piece.isLaying;
    if (
      (!position && neighborName === "left") ||
      (!position && neighborName === "right") ||
      (position && neighborName === "up") ||
      (position && neighborName === "down")
    ) {
      position = !position;
    }
    return position;
  }

  createPiece(neighborName, neighborPiece, side1, side2) {
    let position = this.selectPosition(neighborName, neighborPiece);

    let card = new Card(false, side1, side2, position);

    if (this.checkPiecePosition(neighborName, neighborPiece, side1, side2)) {
      card = new Card(false, side2, side1, position);
    }

    return card;
  }

  runMove(row, col) {
    const { boardMap } = this.state;
    if (this.state.selectedCard) {
      const { side1, side2 } = this.state.selectedCard["value"];

      let neighborsObj = this.getNeighborsObj(row, col);

      let card = new Card(false, side1, side2, true);

      const neighborName = Object.keys(neighborsObj).filter(function(row) {
        return neighborsObj[row] !== null;
      });
      const neighborLocation = neighborsObj[neighborName];

      if (neighborLocation) {
        let piece = boardMap[neighborLocation.row][neighborLocation.col];
        card = this.createPiece(neighborName[0], piece, side1, side2);
      }
      this.locatePieceOnBoard(row, col, card);
    }
  }

  handleBoardClick(row, col) {
    this.runMove(row, col);
  }

  toggleCellValid(board, row, col, booleanVal) {
    board[row][col].valid = booleanVal;
  }

  updateValidCellsInBoard(board, card, booleanVal) {
    const { side1, side2 } = card;

    for (let col = 0; col < this.validLocationsArray[side1].length; col++) {
      this.toggleCellValid(
        board,
        this.validLocationsArray[side1][col].i,
        this.validLocationsArray[side1][col].j,
        booleanVal
      );
    }

    for (let col = 0; col < this.validLocationsArray[side2].length; col++) {
      this.toggleCellValid(
        board,
        this.validLocationsArray[side2][col].i,
        this.validLocationsArray[side2][col].j,
        booleanVal
      );
    }
  }

  isExistPieceForValidSquares(cartMap) {
    let isExist = false;
    let cards = new Array(7);
    for (let i = 0; i < cartMap.length; i++) {
      if (cartMap[i]) {
        cards[cartMap[i].side1] = true;
        cards[cartMap[i].side2] = true;
      }
    }
    for (let j = 0; j < 7; j++) {
      let num = this.validLocationsArray[j].length;
      if (cards[j] && num > 0) {
        isExist = true;
        break;
      }
    }
    return isExist;
  }

  isTheFirstTurn() {
    return this.state.boardMap[28][28].valid;
  }

  handleCartClick(indexCart, card) {
    console.log("clicked" + indexCart);
    this.setState(prevState => {
      const boardMap = this.getBoardWithSignsCells(
        [...prevState.boardMap],
        card
      );
      const cartMap = this.getUpdatedCart([...prevState.cartMap], indexCart);
      return {
        boardMap: boardMap,
        cartMap: cartMap,
        selectedCard: { value: card, index: indexCart }
      };
    });
  }

  getBoardWithSignsCells(board, card) {
    if (this.state.selectedCard !== null) {
      let prevSelectedCard = this.state.selectedCard["value"];
      this.updateValidCellsInBoard(board, prevSelectedCard, false);
    }
    this.updateValidCellsInBoard(board, card, true);
    return board;
  }

  getUpdatedCart(cartMap, indexCart) {
    for (let i = 0; i < cartMap.length; i++) {
      if (cartMap[i].valid) cartMap[i].valid = undefined;
    }
    cartMap[indexCart].valid = true;

    while (
      !this.isTheFirstTurn() &&
      !this.isExistPieceForValidSquares(cartMap)
    ) {
      let domino = DominoStackLogic.getCard();
      if (domino) {
        cartMap.push(domino);
        this.setState(prevState => {
          return { turn: prevState.turn + 1 };
        });
      }
    }
    return cartMap;
  }

  saveCurrentTime(m, s) {
    if (this.isDataTimerNeeded) {
      console.log("minutes: " + m + "secondes: " + s);
      this.lastPieceStats = { minutes: m, secondes: s };
      this.isDataTimerNeeded = false;
    }
  }

  render() {
    const Withdrawals = DominoStackLogic.getNumOfWithdrawals();
    //this.isDataTimerNeeded = false;
    return (
      <div id="homeContainer">
        <div id="StatsFrame">
          <Timer
            id="timer"
            sendCurrentTime={(m, s) => this.saveCurrentTime(m, s)}
            isDataTimerNeeded={this.isDataTimerNeeded}
          />
          <Stats
            id="statistics"
            currentScore={this.state.currentScore}
            turn={this.state.turn}
            withdrawals={Withdrawals}
          />
        </div>
        <div id="boardFrame">
          <Board
            cells={this.state.boardMap}
            onClick={(i, j) => this.handleBoardClick(i, j)}
          />
        </div>
        <div id="cartFrame">
          <Cart
            id="cartStyle"
            cart={this.state.cartMap}
            onClick={(i, value) => this.handleCartClick(i, value)}
          />
        </div>
      </div>
    );
  }
}

export default Home;
