let center = { alpha: 0, beta: 0 };

export function calibrate(data) {
  center.alpha = data.alpha;
  center.beta = data.beta;
}

export function computeNormalizedPosition(data, canvas) {
  const maxAngle = 20;

  let deltaX = data.alpha - center.alpha;
  let deltaY = data.beta - center.beta;

  deltaX = Math.max(-maxAngle, Math.min(maxAngle, deltaX));
  deltaY = Math.max(-maxAngle, Math.min(maxAngle, deltaY));

  const normX = (deltaX + maxAngle) / (2 * maxAngle);
  const normY = (deltaY + maxAngle) / (2 * maxAngle);

  return {
    x: normX * canvas.width,
    y: normY * canvas.height,
  };
}
