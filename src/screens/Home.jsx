import React from "react";
import Board from "../components/Board.jsx";
import Cart from "../components/Cart.jsx";
import Timer from "../components/Timer.jsx";
import "../style/HomeStyle.css";
import Card, {
  setInitialBoard,
  setInitialCart,
  DominoStackLogic,
  secondsToTime
} from "../utilities/Manager";
import Stats from "../components/Stats.jsx";

const getInitialState = () => {
  const initialBoard = setInitialBoard(57);
  const initialCart = setInitialCart();
  const initialState = {
    boardMap: initialBoard,
    cartMap: initialCart,
    selectedCard: null,
    currentScore: 0,
    turn: 0,
    withdrawals: 0,
    average: { minutes: 0, seconds: 0 },
    timeToDisplay: null
  };
  return initialState;
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = getInitialState();
    this.restartGame = this.restartGame.bind(this);
    this.handlePrevButton = this.handlePrevButton.bind(this);
    this.handleNextButton = this.handleNextButton.bind(this);
    this.convertTimeToSecs = this.convertTimeToSecs.bind(this);
    this.getTurnDuration = this.getTurnDuration.bind(this);
    this.statsObj = this.statsObj.bind(this);
    this.cleanAllFlags = this.cleanAllFlags.bind(this);
    this.getNextAverageTurn = this.getNextAverageTurn.bind(this);
    this.getAverageDiffInSecs = this.getAverageDiffInSecs.bind(this);

    this.isGameRunning = true;
    this.isWin = false;
    this.cartEmptyFlag = false;
    this.validLocationsArray = this.createEmptyValidLocations();
    this.isDataTimerNeeded = false;
    this.currentTime = { minutes: 0, seconds: 0 };
    this.lastPieceTime = { minutes: 0, seconds: 0 };
    this.isTimerResetNeeded = false;
    this.movesHistory = new Array(0);
    this.redoMoves = new Array(0);
  }

  cleanAllFlags() {
    this.movesHistory = new Array(0);
    this.redoMoves = new Array(0);
    this.validLocationsArray = this.createEmptyValidLocations();
    this.isDataTimerNeeded = false;
    this.currentTime = { minutes: 0, seconds: 0 };
    this.lastPieceTime = { minutes: 0, seconds: 0 };
    this.isPiecePlaceOnBoard = false;
    this.isTimerResetNeeded = true;
    this.isGameRunning = true;
    this.isWin = false;
    this.cartEmptyFlag = false;
  }

  restartGame() {
    DominoStackLogic.reset();
    this.setState(() => getInitialState());
    this.cleanAllFlags();
  }

  isCartEmpty() {
    const { cartMap } = this.state;
    const { index } = this.state.selectedCard;
    let isEmpty = true;
    for (let i = 0; i < cartMap.length; i++) {
      if (i !== index && cartMap[i].side1 !== undefined) {
        isEmpty = false;
      }
    }
    return isEmpty;
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
      if (this.isCartEmpty()) {
        this.isGameRunning = false;
        this.isWin = true;
      }
      return {
        cartMap: newCartMap
      };
    });
  }

  getCartMapAfterRemoveCard(index, cartMap) {
    cartMap[index] = new Card(false);
    return cartMap;
  }

  calculateAverageOfTurn() {
    this.lastPieceTime = this.currentTime;
    let seconds = this.lastPieceTime.minutes * 60 + this.lastPieceTime.seconds;
    let averageInSecondsFormat = seconds / (this.state.turn + 1);
    return secondsToTime(averageInSecondsFormat);
  }

  locatePieceOnBoard(row, col, card) {
    if (card.side1 === card.side2) {
      card.isLaying = !card.isLaying;
    }
    this.removeValidLocation(row, col, card);
    this.updateValidLocationsByNumber(row, col, card);
    this.removePieceFromCart();

    let scoreAddition = card.side1 + card.side2;
    this.isDataTimerNeeded = true;
    this.isTimerResetNeeded = false;
    const average = this.calculateAverageOfTurn();

    this.isPiecePlaceOnBoard = true;
    this.setState(prevState => {
      const newBoardMap = this.getUpdatedBoard(
        [...prevState.boardMap],
        card,
        row,
        col
      );
      const newScore = this.getUpdatedScore(
        prevState.currentScore,
        scoreAddition
      );
      const newTurn = prevState.turn + 1;
      return {
        boardMap: newBoardMap,
        currentScore: newScore,
        turn: newTurn,
        average: average
      };
    });
  }

  getBoardAfterRemovePiece(board, row, col) {
    board[row][col] = new Card(false);
    return board;
  }
  getCartAfterAddPiece(cart, card, indexCart) {
    card.valid = undefined;
    cart[indexCart] = card;
    return cart;
  }
  getCartAfterRemovePiece(cart, indexCart) {
    cart[indexCart] = new Card(false);
    return cart;
  }

  handlePrevButton() {
    const prevMoveObj = this.movesHistory.pop();
    if (prevMoveObj) {
      const { cardInBoard, lastPulledCard, stats } = prevMoveObj;
      this.redoMoves.push(prevMoveObj);

      let averageSecsFormat = this.convertTimeToSecs(this.state.average);
      this.currentTime = {
        minutes:
          this.currentTime.minutes - prevMoveObj.stats.turnLength.minutes,
        seconds: this.currentTime.seconds - prevMoveObj.stats.turnLength.seconds
      };

      this.setState(prevState => {
        let newCartMap,
          newBoardMap,
          obj = null;
        if (cardInBoard) {
          newBoardMap = this.getBoardAfterRemovePiece(
            [...prevState.boardMap],
            cardInBoard.row,
            cardInBoard.col
          );
          newCartMap = this.getCartAfterAddPiece(
            [...prevState.cartMap],
            cardInBoard.card,
            cardInBoard.indexCart
          );

          obj = {
            boardMap: newBoardMap,
            cartMap: newCartMap,
            turn: prevState.turn - prevMoveObj.stats.turns,
            withdrawals: prevState.withdrawals - prevMoveObj.stats.withdrawals,
            currentScore: prevState.currentScore - prevMoveObj.stats.scoreToAdd,
            average: secondsToTime(
              averageSecsFormat - prevMoveObj.stats.averageTurnInSecsToAdd
            ),
            timeToDisplay: this.currentTime
          };
        } else if (lastPulledCard) {
          newCartMap = this.getCartAfterRemovePiece(
            [...prevState.cartMap],
            lastPulledCard.indexInCart
          );
          obj = {
            cartMap: newCartMap,
            turn: prevState.turn - prevMoveObj.stats.turns,
            withdrawals: prevState.withdrawals - prevMoveObj.stats.withdrawals,
            currentScore: prevState.currentScore - prevMoveObj.stats.scoreToAdd,
            average: secondsToTime(
              averageSecsFormat - prevMoveObj.stats.averageTurnInSecsToAdd
            ),
            timeToDisplay: this.currentTime
          };
        }
        return obj;
      });
    }
  }

  handleNextButton() {
    const nextMoveObj = this.redoMoves.pop();
    if (nextMoveObj) {
      const { cardInBoard, lastPulledCard, stats } = nextMoveObj;
      this.movesHistory.push(nextMoveObj);
      let averageSecsFormat = this.convertTimeToSecs(this.state.average);
      this.currentTime = {
        minutes:
          this.currentTime.minutes + nextMoveObj.stats.turnLength.minutes,
        seconds: this.currentTime.seconds + nextMoveObj.stats.turnLength.seconds
      };
      this.setState(prevState => {
        let newCartMap,
          newBoardMap,
          obj = null;
        if (cardInBoard) {
          newBoardMap = this.getUpdatedBoard(
            [...prevState.boardMap],
            cardInBoard.card,
            cardInBoard.row,
            cardInBoard.col
          );
          newCartMap = this.getCartAfterRemovePiece(
            [...prevState.cartMap],
            cardInBoard.indexCart
          );

          obj = {
            boardMap: newBoardMap,
            cartMap: newCartMap,
            turn: prevState.turn + nextMoveObj.stats.turns,
            withdrawals: prevState.withdrawals + nextMoveObj.stats.withdrawals,
            currentScore: prevState.currentScore + nextMoveObj.stats.scoreToAdd,
            average: secondsToTime(
              averageSecsFormat + nextMoveObj.stats.averageTurnInSecsToAdd
            ),
            timeToDisplay: this.currentTime
          };
        } else if (lastPulledCard) {
          newCartMap = this.getCartAfterAddPiece(
            [...prevState.cartMap],
            lastPulledCard.card,
            lastPulledCard.indexInCart
          );
          obj = {
            cartMap: newCartMap,
            turn: prevState.turn + nextMoveObj.stats.turns,
            withdrawals: prevState.withdrawals + nextMoveObj.stats.withdrawals,
            currentScore: prevState.currentScore + nextMoveObj.stats.scoreToAdd,
            average: secondsToTime(
              averageSecsFormat + nextMoveObj.stats.averageTurnInSecsToAdd
            ),
            timeToDisplay: this.currentTime
          };
        }
        return obj;
      });
    }
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

  getTurnDuration() {
    const turnLength = {
      minutes: this.currentTime.minutes - this.lastPieceTime.minutes,
      seconds: this.currentTime.seconds - this.lastPieceTime.seconds
    };

    return turnLength;
  }

  getNextAverageTurn() {
    let currentTurnLength = this.getTurnDuration();
    let nextAverage = this.convertTimeToSecs(
      secondsToTime(
        this.convertTimeToSecs({
          minutes: currentTurnLength.minutes + this.lastPieceTime.minutes,
          seconds: currentTurnLength.seconds + this.lastPieceTime.seconds
        }) /
          (this.state.turn + 1)
      )
    );
    return nextAverage;
  }

  getAverageDiffInSecs() {
    const currAverage = this.getNextAverageTurn();
    const prevAverage = this.convertTimeToSecs(this.state.average);
    return currAverage - prevAverage;
  }

  runMove(row, col) {
    const { boardMap } = this.state;

    if (this.state.selectedCard) {
      const { side1, side2 } = this.state.selectedCard["value"];

      let averageTurnInSecsToAdd = this.getAverageDiffInSecs();

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

      const moveObj = {
        cardInBoard: {
          indexCart: this.state.selectedCard.index,
          row: row,
          col: col,
          card: card
        },
        lastPulledCard: null,
        stats: new this.statsObj(
          0,
          1,
          side1 + side2,
          turnLength,
          averageTurnInSecsToAdd
        )
      };

      this.movesHistory.push(moveObj);
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
    if (this.isGameRunning) {
      console.log("clicked" + indexCart);
      this.isTimerResetNeeded = false;
      this.setState(prevState => {
        const boardMap = this.getBoardWithSignsCells(
          [...prevState.boardMap],
          card
        );
        const obj = this.getUpdatedCart([...prevState.cartMap], indexCart);
        const cartMap = obj.cartMap;
        const turn = obj.turn;
        const withdrawals = DominoStackLogic.getNumOfWithdrawals();
        if (DominoStackLogic.getNumOfPieces() === 0) {
          this.isGameRunning = false;
          this.isWin = false;
        }
        return {
          boardMap: boardMap,
          cartMap: cartMap,
          selectedCard: { value: card, index: indexCart },
          turn: turn,
          withdrawals: withdrawals
        };
      });
    }
  }

  getBoardWithSignsCells(board, card) {
    if (this.state.selectedCard !== null) {
      let prevSelectedCard = this.state.selectedCard["value"];
      this.updateValidCellsInBoard(board, prevSelectedCard, false);
    }
    this.updateValidCellsInBoard(board, card, true);
    return board;
  }

  convertTimeToSecs(time) {
    return time.minutes * 60 + time.seconds;
  }

  statsObj(withdrawals, turns, scoreToAdd, turnLength, averageTurn) {
    this.withdrawals = withdrawals;
    this.turns = turns;
    this.scoreToAdd = scoreToAdd;
    this.turnLength = turnLength;
    this.averageTurnInSecsToAdd = averageTurn;
  }

  getUpdatedCart(cartMap, indexCart) {
    for (let i = 0; i < cartMap.length; i++) {
      if (cartMap[i].valid) cartMap[i].valid = undefined;
    }
    cartMap[indexCart].valid = true;
    let numOfTurnsToAdd = 0;
    this.isPiecePlaceOnBoard = false;
    let turnLength = {
      minutes: 0,
      seconds: 0
    };
    while (
      !this.isTheFirstTurn() &&
      !this.isExistPieceForValidSquares(cartMap) &&
      DominoStackLogic.getNumOfPieces() > 0
    ) {
      let domino = DominoStackLogic.getCard();
      if (domino) {
        cartMap.push(domino);
        numOfTurnsToAdd++;
        const moveObj = {
          cardInBoard: null,
          lastPulledCard: { card: domino, indexInCart: cartMap.length - 1 },
          stats: new this.statsObj(1, 1, 0, turnLength, 0)
        };
        this.movesHistory.push(moveObj);
      }
    }
    return {
      cartMap: cartMap,
      turn: this.state.turn + numOfTurnsToAdd
    };
  }

  saveCurrentTime(m, s) {
    this.currentTime = { minutes: m, seconds: s };
  }

  render() {
    let newGameButton,
      prevButton,
      nextButton = null;
    let gameDoneSentence = null;
    if (!this.isGameRunning) {
      newGameButton = <button onClick={this.restartGame}>newGame</button>;
      prevButton = <button onClick={this.handlePrevButton}> Prev</button>;
      nextButton = <button onClick={this.handleNextButton}> Next</button>;

      if (this.isWin) {
        gameDoneSentence = <p>YOU WINNER!!!</p>;
      } else {
        gameDoneSentence = <p>YOU LOSER...</p>;
      }
    }

    return (
      <div id="homeContainer">
        <div id="statsFrame">
          <Timer
            id="timer"
            sendCurrentTime={(m, s) => this.saveCurrentTime(m, s)}
            isDataTimerNeeded={this.isDataTimerNeeded}
            isResetNeeded={this.isTimerResetNeeded}
            isGameRunning={this.isGameRunning}
            timeToDisplay={this.state.timeToDisplay}
          />
          <Stats
            id="statistics"
            currentScore={this.state.currentScore}
            turn={this.state.turn}
            withdrawals={this.state.withdrawals}
            average={this.state.average}
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
        {newGameButton}
        {prevButton}
        {nextButton}
        {gameDoneSentence}
      </div>
    );
  }
}

export default Home;
