import React from "react";

function Notification({ message }) {
  return (
    <div
      className="fixed inset-0 grid place-content-center opacity-70"
      style={{ backgroundColor: "var(--modal-content-bg)" }}
    >
      <p
        className="text-lg max-w-72 font-bold"
        style={{
          color: "var(--color-tone-1)",
        }}
      >
        {message}
      </p>
    </div>
  );
}

export default Notification;
