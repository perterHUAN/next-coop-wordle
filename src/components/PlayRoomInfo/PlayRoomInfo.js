import React from "react";
import { CircleCheckBig } from "lucide-react";
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
        <p className="bg-slate-200 py-1 px-2" data-testid="room-url">
          {url}
        </p>
        <p
          className="bg-slate-400 py-1 px-2 cursor-pointer"
          onClick={handlePaste}
          data-testid="paste-url"
        >
          {!paste ? "copy link" : <CircleCheckBig />}
        </p>
      </div>
      <div
        className={`absolute w-8 h-8 rounded-full bg-gray-300 text-slate-700 left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer ${
          show ? "hidden" : "block"
        }`}
        onClick={() => setShow(true)}
        data-testid="show-room-url"
      ></div>
    </div>
  );
}

export default PlayRoomInfo;
