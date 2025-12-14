import { PicoColor } from "./types";

export const PLAYERS = [
  "Andre",
  "Andy",
  "Cyrus",
  "Edwin",
  "Houchen",
  "Jason",
  "Junhao",
  "Kevin",
  "Simon",
  "Weinuo",
] as const;

export const PICO_COLORS: PicoColor[] = [
  "Blue",
  "Gray",
  "Green",
  "Orange",
  "Pink",
  "Purple",
  "Red",
  "Yellow",
];

export const COLOR_HEX: Record<PicoColor, string> = {
  Orange: "#FF6B35",
  Red: "#E63946",
  Yellow: "#FFD166",
  Green: "#06D6A0",
  Pink: "#FF69B4",
  Purple: "#9B5DE5",
  Blue: "#00BBF9",
  Gray: "#8D99AE",
};

export const COLOR_DARK: Record<PicoColor, string> = {
  Orange: "#CC5529",
  Red: "#B82D38",
  Yellow: "#CCA852",
  Green: "#05AB80",
  Pink: "#CC5490",
  Purple: "#7C4AB7",
  Blue: "#0096C7",
  Gray: "#71798B",
};

export const ADMIN_PASSWORD = "picopark8588";

export const VOTING_DURATION = 10000; // 10 seconds in milliseconds
