'use strict';

class Game {
  static possibleStatus = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
    this.status = Game.possibleStatus.IDLE;
    this.score = 0;
    this.dimensions = 4;
  }

  moveLeft() {}
  moveRight() {}
  moveUp() {}
  moveDown() {}

  moveTo(direction) {
    if (this.status !== Game.possibleStatus.PLAYING) {
      return false;
    }

    const needSwap = direction === 'up' || direction === 'down';
    const swapDirection =
      direction === 'up' || direction === 'left' ? 'left' : 'right';
    const newState = this.state.matrix((row) => [...row]);

    let matrix = newState;

    if (needSwap) {
      matrix = this.swap(newState);
    }

    const didSwap = this.swapRows(swapDirection, matrix);
    const didMerge = this.combineRows(swapDirection, matrix);

    if (didMerge) {
      this.swapDirection(swapDirection, matrix);
    }

    if (didSwap || didMerge) {
      if (needSwap) {
        this.state = this.swap(matrix);
      } else {
        this.state = matrix;
      }

      this.generate();
      this.checkStatus();

      return true;
    }

    return false;
  }

  swapRows(direction, matrix = this.state) {
    let isChaged = false;

    for (const row of matrix) {
      const filteredRow = row.filter((num) => num);
      const missing = this.dimensions - filteredRow.length;
      const zeros = Array(missing).fill(0);
      const newRow =
        direction === 'left'
          ? filteredRow.concat(zeros)
          : zeros.concat(filteredRow);

      if (row.toString() !== newRow.toString()) {
        isChaged = true;

        for (let i = 0; i < this.dimensions; i++) {
          row[i] = newRow[i];
        }
      }
    }

    return isChaged;
  }

  combineRows(direction, matrix = this.state) {
    let isChanged = false;

    for (const row of matrix) {
      if (direction === 'left') {
        for (let i = 0; i < this.dimensions; i++) {
          if (row[i] !== 0 && row[i] === row[i + 1]) {
            if (row[i] === 1024) {
              this.status = Game.possibleStatus.WIN;
            }

            isChanged = true;
            row[i] *= 2;
            row[i + 1] = 0;
            this.score += row[i];
            i++;
          }
        }
      } else {
        for (let i = this.dimensions; i >= 0; i--) {
          if (row[0] !== 0 && row[i] === row[i - 1]) {
            if (row[i] === 1024) {
              this.status = Game.possibleStatus.WIN;
            }

            isChanged = true;
            row[i] *= 2;
            row[i - 1] = 0;
            this.score += row[i];
            i--;
          }
        }
      }
    }

    return isChanged;
  }

  swap(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  generate() {
    const emptyCells = [];

    for (let i = 0; i < this.dimensions; i++) {
      for (let j = 0; j < this.dimensions; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return false;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][col] = Math.random() * 0.9 ? 2 : 4;

    return true;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = Game.possibleStatus.IDLE;
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.status = Game.possibleStatus.PLAYING;
    this.score = 0;
  }
}

module.exports = Game;
