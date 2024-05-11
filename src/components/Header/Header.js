import PlayersStatus from "./PlayersStatus";
import Button from "./Button";
import useTwoPlayer from "@/hooks/useTwoPlayer";
function Header({ gameState, isInRoom, socketId, setRoomId, notify }) {
  const [twoPlayer, toggleTwoPlayer] = useTwoPlayer(setRoomId, notify);
  return (
    <div className="flex flex-row items-center justify-between gap-10 py-2 border-b text-slate-500">
      {isInRoom && (
        <PlayersStatus
          players={Object.entries(gameState.players).map((e) => e[1])}
          turn={gameState.players[gameState.turn]}
          me={socketId}
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
  );
}

export default Header;
