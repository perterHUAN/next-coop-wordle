import { generateNewState } from "@/utils";
import { isWord, generateRandomAnswer } from "@/data";
import { keyboard, guessTimes, wordLength } from "@/constants";

class GameStateManager {
  constructor() {
    this.gameState = generateInitalGameState();
  }
  addLetter(data) {
    if (this.gameState.boardState[this.gameState.rowIdx].length >= 5)
      return { notification: "", gameState: this.gameState };
    this.gameState.boardState[this.gameState.rowIdx] += data;
    return generateNewState("", this.gameState);
  }

  removeLetter() {
    if (this.gameState.boardState[this.gameState.rowIdx].length === 0)
      return generateNewState("", this.gameState);
    this.gameState.boardState[this.gameState.rowIdx] =
      this.gameState.boardState[this.gameState.rowIdx].slice(0, -1);
    return generateNewState("", this.gameState);
  }

  check() {
    const word = this.gameState.boardState[this.gameState.rowIdx].toUpperCase();
    const answer = this.gameState.answer.toUpperCase();
    console.log(word, answer);
    if (word.length < 5) {
      return generateNewState("Not enough letters", this.gameState);
    }
    if (!isWord(word)) {
      return generateNewState("Not in word list", this.gameState);
    }

    const st = {};
    for (let i = 0; i < answer.length; ++i) {
      if (answer[i] === word[i]) {
        this.gameState.evaluation[this.gameState.rowIdx][i] = 0;
        st[word[i]] = 0;
      }
    }
    for (let i = 0; i < answer.length; ++i) {
      const ch = word[i];
      if (this.gameState.evaluation[this.gameState.rowIdx][i] === 0) continue;
      let res = 3;
      if (!answer.includes(ch)) {
        res = 2;
      } else {
        const cnt1 = answer
          .split("")
          .reduce((acc, cur) => acc + (cur === ch ? 1 : 0), 0);
        const cnt2 = word
          .slice(0, i + 1)
          .split("")
          .reduce((acc, cur) => acc + (cur === ch ? 1 : 0), 0);
        if (cnt2 <= cnt1) res = 1;
        else res = 2;
      }
      this.gameState.evaluation[this.gameState.rowIdx][i] = res;

      st[ch] = Math.min(st[ch] === undefined ? 3 : st[ch], res);
    }
    for (const key in st) {
      this.gameState.keyboardState[key.toLowerCase()] = st[key];
    }
    this.gameState.rowIdx++;

    // check win or lose
    const isWin = this.gameState.evaluation[this.gameState.rowIdx - 1].every(
      (e) => e === 0
    );
    if (isWin) {
      this.gameState.gameStatus = false;
      this.gameState.result = "win";
      return generateNewState("You win", this.gameState);
    }
    if (this.gameState.rowIdx >= 6 && !isWin) {
      this.gameState.gameStatus = false;
      this.gameState.result = "lose";
      return generateNewState("You lose", this.gameState);
    }
    this.gameState.turn = (this.gameState.turn + 1) % this.playersCount();
    return generateNewState("", this.gameState);
  }

  addPlayer(id) {
    if (this.playersCount() >= 2)
      return generateNewState("Add Room Failed", generateInitalGameState());
    for (const k of [0, 1]) {
      if (!(k in this.gameState.players)) {
        this.gameState.players[k] = id;
        break;
      }
    }
    console.log("add player", id);
    return generateNewState("Add Room Successful!", this.gameState);
  }
  removePlayer(id) {
    let key = null;
    for (const [k, v] of Object.entries(this.gameState.players)) {
      if (id === v) {
        key = k;
        break;
      }
    }
    if (key) delete this.gameState.players[key];
    return generateNewState("", this.gameState);
  }
  currentPlayer() {
    return this.gameState.players[this.gameState.turn];
  }
  playersCount() {
    return Object.entries(this.gameState.players).length;
  }
  playersIds() {
    return Object.entries(this.gameState.players).map((player) => player[1]);
  }

  checkValidPlayer(id) {
    return this.playersIds().includes(id);
  }
}
export function generateInitalGameState() {
  return {
    boardState: Array.from({ length: guessTimes }, () => ""),
    evaluation: Array.from({ length: guessTimes }, () =>
      Array.from({ length: wordLength }, () => 3)
    ),
    keyboardState: keyboard.flat().reduce((pre, cur) => {
      pre[cur] = 3;
      return pre;
    }, {}),
    rowIdx: 0,
    answer: generateRandomAnswer(),
    gameStatus: false,
    turn: 0,
    players: {},
    result: "none",
  };
}
export default GameStateManager;
