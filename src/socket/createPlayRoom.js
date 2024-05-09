function createPlayRoom() {
  return fetch("/two-player").then((res) => res.json());
}

export default createPlayRoom;
