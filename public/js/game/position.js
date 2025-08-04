import { config } from "./config.js";

let center = { alpha: 0, beta: 0 };

export function calibrate({ alpha, beta }) {
  center.alpha = alpha;
  center.beta = beta;
}

export function computeNormalizedPosition({ alpha, beta }, canvas) {
  const alphaDelta = ((alpha - center.alpha + 540) % 360) - 180;
  const betaDelta = beta - center.beta;

  const normX = Math.max(-1, Math.min(1, -alphaDelta / config.maxAngle));
  const normY = Math.max(-1, Math.min(1, -betaDelta / config.maxAngle));

  return {
    x: canvas.width / 2 + normX * (canvas.width / 2),
    y: canvas.height / 2 + normY * (canvas.height / 2)
  };
}
