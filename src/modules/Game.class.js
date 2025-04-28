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
