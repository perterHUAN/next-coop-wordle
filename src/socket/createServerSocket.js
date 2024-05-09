import { generateUniquePort } from "@/utils";
import { Server } from "socket.io";
import GameStateManager from "./GameStateManager";
import { generateNewState } from "@/utils";
function createServerSocket() {
  const gameStateManager = new GameStateManager();
  const idToSocket = new Map();
  const io = new Server({
    cors: {
      origin: "http://localhost:3000",
    },
  });
  function emitToAllPlayers(eventName, data) {
    for (const id of Object.entries(gameStateManager.gameState.players).map(
      (e) => e[1]
    )) {
      const sk = idToSocket[id];
      sk.emit(eventName, data);
    }
  }

  io.on("connection", (socket) => {
    const res = gameStateManager.addPlayer(socket.id);
    idToSocket[socket.id] = socket;
    console.log("res", res);

    socket.emit("add player", res);
    socket.broadcast.emit("add player", generateNewState("", res.gameState));

    if (
      gameStateManager.playersCount() === 2 &&
      !gameStateManager.gameState.gameStatus
    ) {
      console.log("players: ", gameStateManager.gameState.players);
      gameStateManager.gameState.gameStatus = true;
      emitToAllPlayers(
        "start game",
        generateNewState("", gameStateManager.gameState)
      );
    }
    socket.on("disconnect", () => {
      // console.log("disconnect: ", gameStateManger.gameState);
      console.log("before disconnect:", gameStateManager.gameState.players);
      const len = gameStateManager.playersCount();
      gameStateManager.removePlayer(socket.id);
      if (len !== gameStateManager.playersCount())
        emitToAllPlayers(
          "leave",
          generateNewState("", gameStateManager.gameState)
        );
      console.log("disconnect", gameStateManager.gameState.players);
    });
    socket.on("type", (data) => {
      if (gameStateManager.currentPlayer() !== socket.id) {
        return socket.emit(
          "type",
          generateNewState("Not Your Turn", gameStateManager.gameState)
        );
      }
      if (!gameStateManager.gameState.gameStatus) {
        return socket.emit(
          "type",
          generateNewState(
            "Players are not all present, unable to start the game.",
            gameStateManager.gameState
          )
        );
      }
      console.log("type: ", data);
      let res = null;
      if (gameStateManager.checkValidPlayer(socket.id)) {
        if (data === "Enter") {
          res = gameStateManager.check();
        } else if (data === "Backspace") {
          res = gameStateManager.removeLetter();
        } else {
          res = gameStateManager.addLetter(data);
        }
      } else {
        res = generateNewState("invalid player", gameStateManager.gameState);
      }
      emitToAllPlayers("type", res);
    });
  });
  const port = generateUniquePort();
  io.listen(port);
  return port;
}

export default createServerSocket;
