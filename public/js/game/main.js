import { socket } from "../socket.js";
import { calibrate, computeNormalizedPosition } from "./position.js";
import { smooth } from "./smoothing.js";
import { clearCanvas, drawPointer } from "./draw.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pos = { x: canvas.width / 2, y: canvas.height / 2 };
let target = { ...pos };
let smoothingFactor = 0;

socket.emit("clientType", { type: "game" });

socket.on("updateConfig", (config) => {
  if (config.smoothing !== undefined) {
    smoothingFactor = Math.max(0, Math.min(1, config.smoothing / 100));
    console.log("Neuer Glättungsfaktor:", smoothingFactor);
  }
});

socket.on("gyroData", (data) => {
  if (data.isStart) {
    calibrate(data);
    return;
  }

  target = computeNormalizedPosition(data, canvas);
});

function draw() {
  if (smoothingFactor <= 0) {
    pos = { ...target };
  } else {
    pos = smooth(pos, target, smoothingFactor);
  }

  clearCanvas(ctx, canvas);
  drawPointer(ctx, pos);
  requestAnimationFrame(draw);
}

draw();
