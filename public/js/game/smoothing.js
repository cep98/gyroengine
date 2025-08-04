export function smooth(current, target, factor) {
  return {
    x: current.x * (1 - factor) + target.x * factor,
    y: current.y * (1 - factor) + target.y * factor
  };
}
