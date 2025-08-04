import { config } from "./config.js";

export function clearCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function drawPointer(ctx, pos) {
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, config.pointerRadius, 0, 2 * Math.PI);
  ctx.fill();
}
