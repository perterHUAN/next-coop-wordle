import React from "react";
import createPlayRoom from "@/socket/createPlayRoom";
function useTwoPlayer(setRoomId, notify) {
  const [twoPlayer, setTwoPlayer] = React.useState(false);
  function toggleTwoPlayer() {
    if (!twoPlayer) {
      createPlayRoom()
        .then(({ roomId }) => {
          setRoomId(roomId);
          setTwoPlayer(!twoPlayer);
          notify(
            "create play room successful!! playroom url will be found on the right sidebar."
          );
        })
        .catch((error) => {
          console.error("error: ", error);
          notify("createRoom failed");
        });
    } else {
      notify("close playroom!!!");
      setTwoPlayer(!twoPlayer);
    }
  }

  return [twoPlayer, toggleTwoPlayer];
}

export default useTwoPlayer;
