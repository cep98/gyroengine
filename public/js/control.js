import { requestGyroPermission } from "../lib/gyro-utils.js";
import { socket } from "./socket.js";

let sending = false;
let center = { alpha: 0, beta: 0 };

const button = document.getElementById("laser-button");

// Gyro-Zugriff sofort beim ersten Aufruf anfordern
(async () => {
  await requestGyroPermission();
})();

// Kalibrieren bei erstem Druck
button.addEventListener("touchstart", (e) => {
  e.preventDefault();
  sending = true;

  // aktuelle Ausrichtung als Mitte definieren
  const calibrate = (e) => {
    center.alpha = e.alpha ?? 0;
    center.beta = e.beta ?? 0;
    window.removeEventListener("deviceorientation", calibrate);
  };
  window.addEventListener("deviceorientation", calibrate);
});

// Stoppen beim Loslassen
button.addEventListener("touchend", () => {
  sending = false;
});

// Gyro-Daten senden (nur bei sending = true)
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
    dirY: delta.y
  });
});
