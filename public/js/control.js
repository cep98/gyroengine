import { requestGyroPermission } from "../lib/gyro-utils.js";
import { socket } from "./socket.js";

let sending = false;
let center = { alpha: 0, beta: 0 };

// Gyro-Freigabe beim Start einholen
(async () => {
  await requestGyroPermission();
})();

const button = document.getElementById("laser-button");

button.addEventListener("touchstart", (e) => {
  e.preventDefault();
  sending = true;

  const calibrate = (e) => {
    center.alpha = e.alpha ?? 0;
    center.beta = e.beta ?? 0;

    socket.emit("gyroData", {
      alpha: center.alpha,
      beta: center.beta,
      gamma: 0,
      dirX: 0,
      dirY: 0,
      isStart: true
    });

    window.removeEventListener("deviceorientation", calibrate);
  };
  window.addEventListener("deviceorientation", calibrate);
});

button.addEventListener("touchend", () => {
  sending = false;
});

window.addEventListener("deviceorientation", (e) => {
  if (!sending) return;

  const delta = {
    x: Math.sin((e.alpha - center.alpha) * Math.PI / 180),
    y: -Math.sin((e.beta - center.beta) * Math.PI / 180)
  };

  socket.emit("gyroData", {
    alpha: e.alpha,
    beta: e.beta,
    gamma: e.gamma,
    dirX: delta.x,
    dirY: delta.y,
    isStart: false
  });
});
