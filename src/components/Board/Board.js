import React from "react";
import { range } from "@/utils";
import FlipCell from "./FlipCell";
import { generateCellStyle } from "@/utils";
function Board({ gameState }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {range(6).map((row) => {
        return (
          <div key={row} className="flex flex-row items-center gap-2">
            {range(5).map((col) => {
              const value =
                col < gameState.boardState[row].length
                  ? gameState.boardState[row][col]
                  : "";
              const evaluation = gameState.evaluation[row][col];
              const style1 = generateCellStyle(value, 3);
              const style2 = generateCellStyle(value, evaluation);
              const flip = evaluation !== 3;
              return (
                <div
                  key={col}
                  className={`w-14 h-14 select-none grid place-content-center uppercase font-bold text-2xl`}
                >
                  <FlipCell
                    value={value}
                    style1={style1}
                    style2={style2}
                    flip={flip}
                    delay={col * 100}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Board;
