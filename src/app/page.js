"use client";
import React from "react";
import Notification from "@/components/Notification";
import { useSearchParams } from "next/navigation";
import { log } from "@/utils";
import useSocket from "@/hooks/useSocket";
import useNotify from "@/hooks/useNotify";
import Header from "@/components/Header";
import PlayRoomInfo from "@/components/PlayRoomInfo";
import Board from "@/components/Board";
import Keyboard from "@/components/Keyboard";
import { generateInitalGameState } from "@/socket/GameStateManager";

export default function Home() {
  const searchParams = useSearchParams();
  const [message, notify] = useNotify();
  const [gameState, setGameState] = React.useState(generateInitalGameState);
  const [playRoomUrl, socketId, setRoomId] = useSocket(
    searchParams.get("roomId") || "",
    setGameState,
    notify
  );

  log("gameState: ", gameState);

  const isInRoom =
    socketId &&
    gameState &&
    Object.entries(gameState.players).some((player) => player[1] === socketId);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header
        gameState={gameState}
        isInRoom={isInRoom}
        setRoomId={setRoomId}
        notify={notify}
        socketId={socketId}
      />
      <Board gameState={gameState} />
      <Keyboard gameState={gameState} />
      {message && <Notification message={message} />}
      {playRoomUrl && <PlayRoomInfo url={playRoomUrl} />}
    </main>
  );
}
