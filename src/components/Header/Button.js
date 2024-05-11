function Button({ enable, toggle }) {
  return (
    <div
      className={`${
        enable ? "bg-green-600 border-green-600" : "bg-gray-300 border-gray-300"
      } w-10 h-5 rounded-full border-2 box-content relative cursor-pointer`}
      onClick={toggle}
      data-testid="two-player-button"
    >
      <div
        className={`bg-white w-5 h-5 rounded-full absolute top-0 transition-transform ${
          enable ? "translate-x-full" : ""
        }`}
      ></div>
    </div>
  );
}
export default Button;
