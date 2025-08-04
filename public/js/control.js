import { requestGyroPermission } from "../lib/gyro-utils.js";
import { socket } from "./socket.js";

let listening = false;
let center = { alpha: 0, beta: 0 }; // Kalibrierung
let handler = null;

const button = document.getElementById("toggle");

button.addEventListener("click", async () => {
  if (!listening) {
    await requestGyroPermission();
    button.textContent = "Stop";

    window.addEventListener("deviceorientation", handler = (e) => {
      const { alpha, beta } = e;

      const delta = {
        x: Math.sin((alpha - center.alpha) * Math.PI / 180),
        y: -Math.sin((beta - center.beta) * Math.PI / 180)
      };

      socket.emit("gyroData", {
        dirX: delta.x,
        dirY: delta.y,
        isStart: false
      });
    });

    // Kalibrierung senden
    window.addEventListener("deviceorientation", function calibrate(e) {
      center.alpha = e.alpha ?? 0;
      center.beta = e.beta ?? 0;

      socket.emit("gyroData", {
        dirX: 0,
        dirY: 0,
        isStart: true // Signal für Zentrierung im game
      });

      window.removeEventListener("deviceorientation", calibrate);
    });

    listening = true;
  } else {
    window.removeEventListener("deviceorientation", handler);
    handler = null;
    button.textContent = "Start";
    listening = false;
  }
});
