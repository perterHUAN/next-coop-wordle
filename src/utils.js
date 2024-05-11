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
export function generateNewState(notification, gameState) {
  if (notification === undefined || gameState === undefined) {
    throw new Error("notification or gameState is undefined");
  }
  return { notification, gameState };
}

const ENALBE_LOG = true;
export function log(...args) {
  if (ENALBE_LOG) console.log(...args);
}
const keyBoardColors = [
  "--key-bg-correct",
  "--key-bg-present",
  "--key-bg-absent",
  "--key-bg",
];
const boardColor = [
  "--key-bg-correct",
  "--key-bg-present",
  "--key-bg-absent",
  "--color-tone-7",
];
export function keyBoardStateToBgColorVariable(num) {
  return `var(${keyBoardColors[num]})`;
}
export function boardStateToBgColorVariable(num) {
  return `var(${boardColor[num]})`;
}

export function generateCellStyle(value, evalution) {
  if (value === "") {
    return {
      border: "2px solid var(--color-tone-4)",
    };
  } else if (evalution === 3) {
    return {
      border: "2px solid var(--color-tone-3)",
      color: "var(--key-text-color)",
    };
  } else {
    return {
      backgroundColor: boardStateToBgColorVariable(evalution),
      color: "var(--tile-text-color)",
    };
  }
}

export function getSearchParams(searchStr) {
  if (!searchStr) return {};
  return Object.fromEntries(
    searchStr
      .slice(1)
      .split("&")
      .map((e) => e.split("="))
  );
}
