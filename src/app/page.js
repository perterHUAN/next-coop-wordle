"use client";
import React from "react";
import { Delete, CircleCheckBig } from "lucide-react";
import { keyboard } from "@/constants";
import Notification from "@/components/Notification";
import createPlayRoom from "@/socket/createPlayRoom";
import { useSearchParams } from "next/navigation";
import { generatePlayRoomUrl, generateConnectUrl, range } from "@/utils";
import createClientSocket from "@/socket/createClientSocket";

export default function Home() {
  const searchParams = useSearchParams();
  const [message, setMessage] = React.useState("");
  const [socket, setSocket] = React.useState("");
  const [roomId, setRoomId] = React.useState(searchParams.get("roomId") || "");
  const [twoPlayer, setTwoPlayer] = React.useState(false);
  console.log("roomId", roomId);
  const playRoomUrl = !roomId ? "" : generatePlayRoomUrl(roomId);
  const connectUrl = !roomId ? "" : generateConnectUrl(roomId);
  const [gameState, setGameState] = React.useState(null);

  function notify(message) {
    setMessage(message);
    setTimeout(() => setMessage(""), 2000);
  }

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
  console.log("playroomurl: ", playRoomUrl, "connectUrl: ", connectUrl);
  React.useEffect(() => {
    if (connectUrl) {
      console.log("link");
      const socket = createClientSocket(connectUrl);
      setSocket(socket);
      return () => {
        console.log("remove");
        setSocket(null);
        setRoomId("");
      };
    } else {
      console.log("in: ", connectUrl);
    }
  }, [connectUrl]);

  console.log("socket", socket);
  React.useEffect(() => {
    if (socket) {
      function handleKeyDown(event) {
        const key = event.key;
        console.log("key", key);
        if (!keyboard.flat().includes(key)) return;

        socket.emit("type", key);
      }
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [socket]);

  React.useEffect(() => {
    if (socket) {
      socket.on("type", ({ notification, gameState }) => {
        notify(notification);
        setGameState(gameState);
      });

      socket.on("start game", ({ gameState }) => {
        setGameState(gameState);
        notify("start game");
      });

      socket.on("add player", ({ notification, gameState }) => {
        // console.log("add player: ", data);
        notify(notification);
        setGameState(gameState);
      });
      socket.on("leave", ({ gameState }) => {
        setGameState(gameState);
      });
    }
  }, [socket]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-row items-center justify-between gap-10 py-2 border-b text-slate-500">
        {gameState && (
          <PlayersStatus
            players={Object.entries(gameState.players).map((e) => e[1])}
            turn={gameState.players[gameState.turn]}
            me={socket.id}
          />
        )}
        <p className="font-semibold text-4xl tracking-widest uppercase select-none">
          wordle
        </p>
        <div className="flex flex-col gap-2 font-bold items-center">
          Two Player
          <Button enable={twoPlayer} toggle={toggleTwoPlayer} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        {range(6).map((row) => {
          return (
            <div key={row} className="flex flex-row items-center gap-2">
              {range(5).map((col) => {
                return (
                  <div
                    key={col}
                    className={`w-14 h-14 select-none grid place-content-center uppercase font-bold text-2xl border`}
                  ></div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-center pb-2 gap-1">
        {keyboard.map((row, rowIdx) => {
          return (
            <div key={rowIdx} className="flex flex-row items-center gap-2">
              {row.map((col, colIdx) => {
                return (
                  <div
                    key={colIdx}
                    className="px-4 py-3 grid place-content-center uppercase font-bold bg-gray-400 rounded select-none cursor-pointer transition-colors delay-1000"
                    data-key={col}
                  >
                    {col === "Backspace" ? <Delete /> : col}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {message && <Notification message={message} />}
      {playRoomUrl && <PlayRoomInfo url={playRoomUrl} />}
    </main>
  );
}
function Button({ enable, toggle }) {
  return (
    <div
      className={`${
        enable ? "bg-green-600 border-green-600" : "bg-gray-300 border-gray-300"
      } w-10 h-5 rounded-full border-2 box-content relative cursor-pointer`}
      onClick={toggle}
    >
      <div
        className={`bg-white w-5 h-5 rounded-full absolute top-0 transition-transform ${
          enable ? "translate-x-full" : ""
        }`}
      ></div>
    </div>
  );
}

function PlayRoomInfo({ url }) {
  const [paste, setPaste] = React.useState(false);
  const [show, setShow] = React.useState(false);
  function handlePaste() {
    navigator.clipboard.writeText(url).then(
      () => {
        setPaste(true);
        setTimeout(() => {
          setPaste(false);
          setShow(false);
        }, 500);
      },
      (error) => {
        console.error("error", error);
      }
    );
  }
  return (
    <div
      className={`fixed right-0 top-1/2 -translate-y-1/2 grid place-content-center h-20 ${
        !show ? "translate-x-full" : ""
      }`}
    >
      <div className="flex flex-row items-center justify-between rounded overflow-hidden">
        <p className="bg-slate-200 py-1 px-2">{url}</p>
        <p
          className="bg-slate-400 py-1 px-2 cursor-pointer"
          onClick={handlePaste}
        >
          {!paste ? "copy link" : <CircleCheckBig />}
        </p>
      </div>
      <div
        className={`absolute w-8 h-8 rounded-full bg-gray-300 text-slate-700 left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer ${
          show ? "hidden" : "block"
        }`}
        onClick={() => setShow(true)}
      ></div>
    </div>
  );
}
function PlayersStatus({ players, turn, me }) {
  return (
    <div className="w-10 h-10 relative">
      {players.map((player, idx) => {
        return (
          <div
            className={`absolute left-0 top-0 w-10 h-10 ${
              me === player ? "bg-green-200" : "bg-slate-200"
            } rounded-full ${idx == 1 ? "translate-x-3" : ""} ${
              turn === player ? "shadow-lg z-10" : ""
            }`}
            key={idx}
          ></div>
        );
      })}
    </div>
  );
}
