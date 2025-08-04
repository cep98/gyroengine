import { socket } from "./socket.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pos = { x: canvas.width / 2, y: canvas.height / 2 };

socket.on("gyroData", (data) => {
  const { beta, gamma } = data;
  pos.x += gamma || 0;
  pos.y += beta || 0;

  pos.x = Math.max(0, Math.min(canvas.width, pos.x));
  pos.y = Math.max(0, Math.min(canvas.height, pos.y));
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
  ctx.fill();
  requestAnimationFrame(draw);
}
draw();