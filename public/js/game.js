import { socket } from "./socket.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pos = { x: canvas.width / 2, y: canvas.height / 2 };
let dir = { x: 0, y: 0 };

// Melde dich beim Server als "game"
socket.emit("clientType", { type: "game" });

socket.on("gyroData", (data) => {
  if (data.isStart) {
    pos = {
      x: canvas.width / 2,
      y: canvas.height / 2
    };
  } else {
    dir.x = data.dirX ?? 0;
    dir.y = data.dirY ?? 0;
  }
});

function draw() {
  pos.x += dir.x * 5;
  pos.y += dir.y * 5;

  pos.x = Math.max(0, Math.min(canvas.width, pos.x));
  pos.y = Math.max(0, Math.min(canvas.height, pos.y));

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
  ctx.fill();

  requestAnimationFrame(draw);
}
draw();
