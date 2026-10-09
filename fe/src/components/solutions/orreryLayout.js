// Geometry for the hero orrery: radii, lean and starting angles of the rings.
// Units are arbitrary world units; Orrery.jsx projects them onto the stage.

export const RING_R = [1.15, 1.95, 2.75]; // risk, time, outer orbit
export const TILT = [0.42, -0.3, 0.16]; // how far each ring leans (rad)
export const PREC = [0.22, -0.15, 0.09]; // how fast each ring's lean turns (rad/s)
export const SPEED = [0.3, -0.2, 0.08]; // orbit speed of the bodies on each ring (rad/s)
export const BASE_PITCH = Math.asin(0.55); // how far the whole thing is tipped toward the viewer

const OUTER_START = (20 * Math.PI) / 180;
const STEP = (2 * Math.PI) / 3;
export const START_ANGLE = {
  risk: (270 * Math.PI) / 180,
  time: (60 * Math.PI) / 180,
  domestic: OUTER_START,
  international: OUTER_START + STEP,
  fixed: OUTER_START + 2 * STEP,
};

export const VB = { w: 600, h: 500, cx: 300, cy: 250, unit: 98 }; // stage space
export const CAM = 9; // camera distance, for the perspective
