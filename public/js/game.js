import { socket } from "./socket.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let center = { beta: 0, gamma: 0 };
let pos = { x: canvas.width / 2, y: canvas.height / 2 };

socket.emit("clientType", { type: "game" });

socket.on("gyroData", (data) => {
  if (data.isStart) {
    center.beta = data.beta;
    center.gamma = data.gamma;
    return;
  }

  const betaDelta = data.beta - center.beta;   // y
  const gammaDelta = data.gamma - center.gamma; // x

  const maxAngle = 20; // ±20° → voller Ausschlag

  const normX = Math.max(-1, Math.min(1, gammaDelta / maxAngle));
  const normY = Math.max(-1, Math.min(1, betaDelta / maxAngle));

  pos.x = canvas.width / 2 + normX * (canvas.width / 2);
  pos.y = canvas.height / 2 + normY * (canvas.height / 2);
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
  ctx.fill();
  requestAnimationFrame(draw);
}
draw();
