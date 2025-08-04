import { requestGyroPermission } from "../lib/gyro-utils.js";
import { socket } from "./socket.js";

let sending = false;
let center = { alpha: 0, beta: 0 };

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
      isStart: true,
      alpha: center.alpha,
      beta: center.beta,
      gamma: 0 // wichtig: immer gamma mitschicken
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

  socket.emit("gyroData", {
    isStart: false,
    alpha: e.alpha,
    beta: e.beta,
    gamma: e.gamma // → wird für admin mitgesendet
  });
});
