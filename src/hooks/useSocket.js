import React from "react";
import createClientSocket from "@/socket/createClientSocket";
import { log, generateConnectUrl, generatePlayRoomUrl } from "@/utils";
import { keyboard } from "@/constants";
function useSocket(intialRoomId, setGameState, notify) {
  const [socket, setSocket] = React.useState(null);
  const [roomId, setRoomId] = React.useState(intialRoomId);

  log("roomId: ", roomId);
  const connectUrl = !roomId ? "" : generateConnectUrl(roomId);
  const playRoomUrl = !roomId ? "" : generatePlayRoomUrl(roomId);

  React.useEffect(() => {
    if (connectUrl) {
      const socket = createClientSocket(connectUrl);
      setSocket(socket);
      return () => {
        log("clear current socket");
        socket.disconnect();
        setSocket(null);
        setRoomId("");
      };
    }
  }, [connectUrl]);

  // client -> server
  React.useEffect(() => {
    if (socket) {
      function handleKeyDown(event) {
        const key = event.key;
        log("key: ", key);
        if (!keyboard.flat().includes(key)) return;

        socket.emit("type", key);
      }
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [socket]);

  // server -> client
  React.useEffect(() => {
    if (socket) {
      function response(data) {
        notify(data.notification);
        setGameState(data.gameState);
      }
      for (const event of ["type", "start game", "add player", "leave"]) {
        socket.on(event, response);
      }
    }
  }, [socket, setGameState, notify]);
  const socketId = socket ? socket.id : "";
  return [playRoomUrl, socketId, setRoomId];
}
export default useSocket;
