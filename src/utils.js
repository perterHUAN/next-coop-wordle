export function range(start, end, step = 1) {
  if (start === undefined) throw new Error("must pass at least one parameter");
  if (end === undefined) {
    end = start;
    start = 0;
  }
  const res = [];
  while (start < end) {
    res.push(start);
    start += step;
  }
  return res;
}
const usedPorts = [3000];
function generatePort() {
  return 4000 + Math.floor(Math.random() * 1000);
}
export function generateUniquePort() {
  let port = generatePort();
  while (usedPorts.includes(port)) {
    port = generatePort();
  }
  usedPorts.push(port);
  return port;
}
export function generatePlayRoomUrl(roomId) {
  return `http://localhost:3000/?roomId=${roomId}`;
}
export function generateConnectUrl(roomId) {
  return `http://localhost:${roomId}`;
}

export function generateRandomAnswer() {
  // todo
  return "words";
}

export function isWord(str) {
  // todo
  return true;
}

export function generateNewState(notification, gameState) {
  return { notification, gameState };
}
