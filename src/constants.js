export const keyboard = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
];

export const guessTimes = 6;
export const wordLength = 5;
export const domain =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://next-coop-wordle-jdevne7io-peterhuans-projects.vercel.app";

export const hostname =
  process.env.NODE_ENV === "development"
    ? "http://localhost"
    : "https://next-coop-wordle-jdevne7io-peterhuans-projects.vercel.app";
