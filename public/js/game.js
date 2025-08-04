import { socket } from "./socket.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let center = { alpha: 0, beta: 0 };
let target = { x: canvas.width / 2, y: canvas.height / 2 };
let pos = { x: target.x, y: target.y };

let smoothingFactor = 0; // 0–1

// Empfange Smoothing-Wert vom Admin
socket.on("smoothing", (value) => {
  smoothingFactor = Math.max(0, Math.min(1, value));
});

socket.emit("clientType", { type: "game" });

socket.on("gyroData", (data) => {
  if (data.isStart) {
    center.alpha = data.alpha;
    center.beta = data.beta;
    return;
  }

  const alphaDelta = ((data.alpha - center.alpha + 540) % 360) - 180;
  const betaDelta = data.beta - center.beta;

  const maxAngle = 20;

  const normX = Math.max(-1, Math.min(1, -alphaDelta / maxAngle)); // Invertiertes alpha
  const normY = Math.max(-1, Math.min(1, -betaDelta / maxAngle)); // Invertiertes beta

  target.x = canvas.width / 2 + normX * (canvas.width / 2);
  target.y = canvas.height / 2 + normY * (canvas.height / 2);
});

function draw() {
  pos.x = pos.x * (1 - smoothingFactor) + target.x * smoothingFactor;
  pos.y = pos.y * (1 - smoothingFactor) + target.y * smoothingFactor;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
  ctx.fill();
  requestAnimationFrame(draw);
}
draw();
