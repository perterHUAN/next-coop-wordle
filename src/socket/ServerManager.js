import { Server } from "socket.io";
import { log, generateNewState } from "@/utils";
class ServerManager {
  constructor(gameStateManager) {
    this.io = new Server({
      cors: {
        origin: "http://localhost:3000",
      },
    });
    this.idToSocket = new Map();
    this.gameStateManager = gameStateManager;
    this.initial();
  }
  start(port) {
    this.io.listen(port);
  }
  enterRoom(socket) {
    log(socket.id, "enter Room");
    const res = this.gameStateManager.addPlayer(socket.id);
    this.idToSocket[socket.id] = socket;

    socket.emit("add player", res);
    socket.broadcast.emit("add player", generateNewState("", res.gameState));

    if (
      this.gameStateManager.playersCount() === 2 &&
      !this.gameStateManager.gameState.gameStatus
    ) {
      console.log("players: ", this.gameStateManager.gameState.players);
      this.gameStateManager.gameState.gameStatus = true;
      this.emitToAllPlayers(
        "start game",
        generateNewState("", this.gameStateManager.gameState)
      );
    }
  }
  leaveRoom(socket) {
    console.log(socket.id, "leave room");
    const len = this.gameStateManager.playersCount();
    this.gameStateManager.removePlayer(socket.id);
    if (len !== this.gameStateManager.playersCount())
      this.emitToAllPlayers(
        "leave",
        generateNewState("", this.gameStateManager.gameState)
      );
  }
  type(socket, data) {
    log(socket.id, "type", data);
    if (this.gameStateManager.currentPlayer() !== socket.id) {
      return socket.emit(
        "type",
        generateNewState("Not Your Turn", this.gameStateManager.gameState)
      );
    }
    if (!this.gameStateManager.gameState.gameStatus) {
      return socket.emit(
        "type",
        generateNewState(
          "Players are not all present, unable to start the game.",
          this.gameStateManager.gameState
        )
      );
    }
    let res = null;
    if (this.gameStateManager.checkValidPlayer(socket.id)) {
      if (data === "Enter") {
        res = this.gameStateManager.check();
      } else if (data === "Backspace") {
        res = this.gameStateManager.removeLetter();
      } else {
        res = this.gameStateManager.addLetter(data);
      }
    } else {
      res = generateNewState("invalid player", this.gameStateManager.gameState);
    }
    this.emitToAllPlayers("type", res);
  }
  initial() {
    this.io.on("connection", (socket) => {
      this.enterRoom(socket);
      socket.on("disconnect", () => {
        this.leaveRoom(socket);
      });
      socket.on("type", (data) => {
        this.type(socket, data);
      });
    });
  }

  emitToAllPlayers(eventName, data) {
    for (const id of this.gameStateManager.playersIds()) {
      const sk = this.idToSocket[id];
      sk.emit(eventName, data);
    }
  }
}

export default ServerManager;
