import { generateUniquePort } from "@/utils";
import GameStateManager from "./GameStateManager";
import ServerManager from "./ServerManager";
function createServerSocket() {
  const gameStateManager = new GameStateManager();
  const serverManager = new ServerManager(gameStateManager);

  const port = generateUniquePort();
  serverManager.start(port);
  return port;
}

export default createServerSocket;
