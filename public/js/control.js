import { socket } from "./socket.js";
import { requestGyroPermission } from "../lib/gyro-utils.js";

let sending = false;
let calibrated = false;
let center = { alpha: 0, beta: 0 };

const button = document.getElementById("laser-button");

// Bei iOS: Bewegungserlaubnis einholen
window.addEventListener("load", async () => {
  await requestGyroPermission();
});

// Kalibrierung mit aktuellem Wert
function calibrate(alpha, beta) {
  center.alpha = alpha;
  center.beta = beta;
  calibrated = true;
  console.log("Kalibriere:", center);
}

// Bewegung senden
function sendGyro(e) {
  if (!sending || !e.alpha || !e.beta) return;

  const data = {
    alpha: e.alpha,
    beta: e.beta,
    gamma: e.gamma,
    isStart: false,
  };

  if (!calibrated) {
    calibrate(e.alpha, e.beta);
    data.isStart = true;
  }

  socket.emit("gyroData", data);
}

// Button gedrückt halten = senden
button.addEventListener("touchstart", (e) => {
  e.preventDefault();
  sending = true;
});

button.addEventListener("touchend", (e) => {
  e.preventDefault();
  sending = false;
});

window.addEventListener("deviceorientation", sendGyro);

