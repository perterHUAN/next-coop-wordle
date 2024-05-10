import React from "react";
function useNotify() {
  const [message, setMessage] = React.useState("");
  function notify(message) {
    setMessage(message);
    setTimeout(() => setMessage(""), 2000);
  }
  return [message, notify];
}
export default useNotify;
