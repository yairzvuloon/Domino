class DominoStack {
  constructor() {
    this.indexesCardsBox = this.createShuffledArray(28);
    this.piecesAmount = 28;
    this.indexesCardsBoxIndex = 27;
    this.cardsArray = this.createCardsArray();
    //because of the initial state of stack
    this.numberOfDrawnFromStack = -7;
    this.getNumOfWithdrawals = this.getNumOfWithdrawals.bind(this);
    this.getNumOfPieces = this.getNumOfPieces.bind(this);
    this.reset = this.reset.bind(this);
  }

  getNumOfWithdrawals() {
    return this.numberOfDrawnFromStack;
  }

  getNumOfPieces() {
    return this.piecesAmount;
  }

  getCard() {
    let ret = null;
    if (this.indexesCardsBoxIndex > 0) {
      this.numberOfDrawnFromStack++;
      this.piecesAmount--;
      let cardIndex = this.indexesCardsBox.pop();
      ret = this.cardsArray[cardIndex];
      this.indexesCardsBoxIndex--;
      console.log("in getCard()");
      console.log("card: " + ret.side1 + ", " + ret.side2);
    }
    return ret;
  }

  createShuffledArray(size) {
    let a = new Array(size);
    for (let i = 0; i < size; i++) {
      a[i] = i;
    }
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  createCardsArray() {
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
  }

  reset() {
    this.indexesCardsBox = this.createShuffledArray(28);
    this.indexesCardsBoxIndex = 27;
    this.cardsArray = this.createCardsArray();
    //because of the initial state of stack
    this.numberOfDrawnFromStack = -7;
  }
}

export const DominoStackLogic = new DominoStack();
