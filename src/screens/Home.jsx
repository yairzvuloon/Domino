import React from "react";
import Board from "../components/Board.jsx";
import Cart from "../components/Cart.jsx";
import "../style/HomeStyle.css";
import { DominoBoxLogic } from "../utilities/HomeUtility";

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
      selectedCard: null
    };
    this.validLocationsArray = this.createEmptyValidLocations();
  }

  createEmptyValidLocations() {
    let matrix = new Array(7);
    for (let i = 0; i < 7; i++) {
      matrix[i] = new Array(0);
    }
    return matrix;
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
    let cart = new Array(6);
    for (let i = 0; i < 7; i++) {
      cart[i] = DominoBoxLogic.getCard();
    }
    return cart;
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

    for (let col = 0; col < this.validLocationsArray[side1].length; col++) {
      this.setCellValid(
        board,
        this.validLocationsArray[side1][col].i,
        this.validLocationsArray[side1][col].j
      );
    }

    for (let col = 0; col < this.validLocationsArray[side2].length; col++) {
      this.setCellValid(
        board,
        this.validLocationsArray[side2][col].i,
        this.validLocationsArray[side2][col].j
      );
    }
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
    let value = { i: row, j: col };
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

  checkNeighborPiece(row, col) {
    const { boardMap } = this.state;
    let obj = null;
    if (this.state.selectedCard) {
      const { side1, side2 } = this.state.selectedCard;

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

  checkJokerPiecePosition(neighborName, neighborPiece, side1, side2) {
    return (
      (side1 === neighborPiece.side1 &&
        (neighborName === "down" || neighborName === "right")) ||
      (side2 === neighborPiece.side2 &&
        (neighborName === "up" || neighborName === "left"))
    );
  }

  handleBoardClick(i, j) {
    const { boardMap } = this.state;
    if (this.state.selectedCard) {
      //we need to that in the next: isLaying=getPosition(i,j)
      const { side1, side2 } = this.state.selectedCard;
      console.log("clicked" + i + j);
      let neighborsObj = {
        up: this.checkNeighborPiece(row - 1, col),
        down:  this.checkNeighborPiece(row + 1, col),
        left: this.checkNeighborPiece(row, col - 1),
        right:  this.checkNeighborPiece(row, col + 1)
      };
      let row = i;
      let col = j;
      let card = new Card(false, side1, side2, true);

      // neighborsObj["up"] = this.checkNeighborPiece(row - 1, col);
      // neighborsObj["down"] = this.checkNeighborPiece(row + 1, col);
      // neighborsObj["left"] = this.checkNeighborPiece(row, col - 1);
      // neighborsObj["right"] = this.checkNeighborPiece(row, col + 1);

      const neighborName = Object.keys(neighborsObj).filter(function(row) {
        return neighborsObj[row] !== null;
      });
      console.log("neighbor" + neighborName);

      const neighborLocation = neighborsObj[neighborName];
      console.log("neighborLocation:" + neighborLocation);

      if (neighborLocation) {
        let piece = boardMap[neighborLocation.row][neighborLocation.col];
        let position = piece.isLaying;

        console.log(neighborName[0] === "left");
        if (piece.side1 === piece.side2) {
          if (
            (!position && neighborName[0] === "left") ||
            (!position && neighborName[0] === "right") ||
            (position && neighborName[0] === "up") ||
            (position && neighborName[0] === "down")
          ) {
            position = !position;
          }
          card = new Card(false, side1, side2, position);
          if (this.checkJokerPiecePosition(neighborName[0], piece, side1, side2)) {
            card = new Card(false, side2, side1, position);
          }
        } else {
          if (piece.side1 === side1 || piece.side2 === side2) {
            card = new Card(false, side2, side1, position);
          } else {
            card = new Card(false, side1, side2, position);
          }
        }
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
}

export default Home;
