import { requestGyroPermission, handleOrientation } from "../lib/gyro-utils.js";
import { socket } from "./socket.js";

document.getElementById("start").addEventListener("click", async () => {
  await requestGyroPermission();
  window.addEventListener("deviceorientation", (e) => {
    const { alpha, beta, gamma } = handleOrientation(e);
    socket.emit("gyroData", { alpha, beta, gamma });
  });
});