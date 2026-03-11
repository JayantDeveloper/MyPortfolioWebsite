export const INIT_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const SQ = 1;
export const N_SQ = 8;
export const BORDER = 0.6;
export const BOARD_PLAY = N_SQ * SQ;
export const BOARD_TOTAL = BOARD_PLAY + BORDER * 2;
export const FRAME_H = 0.34;
export const OFF = -(BOARD_PLAY / 2);
export const BOARD_DEPTH_OFFSET = 0.45;
export const CAMERA_VIEW = { x: 0, y: 8.8, z: 5.1 };
export const INIT_TIME = 3 * 60 * 1000;

export const BOARD_FRAME_COLOR = "#2e1805";
export const LIGHT_SQUARE_COLOR = "#a0703f";
export const DARK_SQUARE_COLOR = "#6f4321";
export const SELECTED_LIGHT_SQUARE_COLOR = "#d4aa5a";
export const SELECTED_DARK_SQUARE_COLOR = "#b08040";
export const LAST_MOVE_LIGHT_SQUARE_COLOR = "#c8963c";
export const LAST_MOVE_DARK_SQUARE_COLOR = "#9a6428";
export const PREMOVE_LIGHT_SQUARE_COLOR = "#7c82cb";
export const PREMOVE_DARK_SQUARE_COLOR = "#5d62a7";
export const BOARD_NAME_LINES = ["JAYANT", "MAHESHWARI"];
export const BOARD_TEXT_PROPS = {
  font: "/fonts/helvetiker_bold.typeface.json",
  size: 0.62,
  height: 0.028,
  curveSegments: 12,
  bevelEnabled: true,
  bevelThickness: 0.007,
  bevelSize: 0.004,
};
export const BOARD_TEXT_MATERIAL = {
  color: "#c8902a",
  roughness: 0.18,
  metalness: 0.82,
  emissive: "#a06010",
  emissiveIntensity: 0.35,
  polygonOffset: true,
  polygonOffsetFactor: -1.4,
  polygonOffsetUnits: -2,
};

export const LATHE = {
  P: [
    [0, 0],
    [0.16, 0],
    [0.16, 0.05],
    [0.1, 0.1],
    [0.07, 0.2],
    [0.1, 0.3],
    [0.1, 0.35],
    [0.13, 0.4],
    [0.13, 0.45],
    [0.08, 0.5],
    [0.08, 0.55],
    [0.11, 0.6],
    [0.11, 0.64],
    [0, 0.64],
  ],
  Q: [
    [0, 0],
    [0.21, 0],
    [0.21, 0.05],
    [0.14, 0.12],
    [0.09, 0.26],
    [0.13, 0.42],
    [0.11, 0.59],
    [0.13, 0.7],
    [0.11, 0.77],
    [0.07, 0.86],
    [0.09, 0.93],
    [0.07, 0.98],
    [0.08, 1.02],
    [0.065, 1.05],
    [0, 1.05],
  ],
  K: [
    [0, 0],
    [0.2, 0],
    [0.2, 0.05],
    [0.13, 0.1],
    [0.08, 0.2],
    [0.12, 0.36],
    [0.1, 0.53],
    [0.12, 0.65],
    [0.1, 0.76],
    [0.08, 0.87],
    [0, 0.87],
  ],
};

export const LATHE_RADIUS = { P: 0.72, Q: 0.74, K: 0.78 };
export const PIECE_SCALE = { P: 1.48, N: 1.5, B: 1.87, R: 1.254, Q: 1.78, K: 1.9 };

export function squareCenter(index) {
  return OFF + index + 0.5;
}
