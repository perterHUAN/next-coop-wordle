import { io } from "socket.io-client";
function createClientSocket(url) {
  const socket = io(url);
  socket.on("connect", () => {
    console.log("connect");
  });
  return socket;
}
export default createClientSocket;
