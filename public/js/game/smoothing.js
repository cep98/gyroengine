export function smooth(current, target, factor) {
  if (factor <= 0) return { ...target };
  return {
    x: current.x + (target.x - current.x) * factor,
    y: current.y + (target.y - current.y) * factor,
  };
}
