import { requestGyroPermission } from "../lib/gyro-utils.js";
import { socket } from "./socket.js";

let sending = false;
let center = { beta: 0, gamma: 0 };

(async () => {
  await requestGyroPermission();
})();

const button = document.getElementById("laser-button");

button.addEventListener("touchstart", (e) => {
  e.preventDefault();
  sending = true;

  const calibrate = (e) => {
    center.beta = e.beta ?? 0;
    center.gamma = e.gamma ?? 0;

    socket.emit("gyroData", {
      isStart: true,
      beta: center.beta,
      gamma: center.gamma
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
    beta: e.beta,
    gamma: e.gamma
  });
});
