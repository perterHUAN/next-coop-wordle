function PlayersStatus({ players, turn, me }) {
  return (
    <div className="w-10 h-10 relative" data-testid="players-status">
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

export default PlayersStatus