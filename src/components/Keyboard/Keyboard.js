import { Delete } from "lucide-react";
import { keyboard } from "@/constants";
import { keyBoardStateToBgColorVariable } from "@/utils";
import React from "react";
function Keyboard({ gameState }) {
  return (
    <div className="flex flex-col items-center gap-2 pb-2">
      {keyboard.map((row, rowIdx) => {
        return (
          <div key={rowIdx} className="flex flex-row items-center gap-2">
            {row.map((col, colIdx) => {
              const evaluation = gameState.keyboardState[col];
              return (
                <div
                  key={colIdx}
                  className="px-3 py-3 grid place-content-center uppercase font-bold bg-gray-400 rounded select-none cursor-pointer transition-colors delay-1000"
                  data-key={col}
                  style={{
                    color:
                      evaluation !== 3
                        ? "var(--key-evaluated-text-color)"
                        : "var(--key-text-color)",
                    backgroundColor: keyBoardStateToBgColorVariable(evaluation),
                  }}
                >
                  {col === "Backspace" ? <Delete /> : col}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Keyboard;
