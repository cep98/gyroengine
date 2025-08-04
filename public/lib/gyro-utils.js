export async function requestGyroPermission() {
  if (typeof DeviceOrientationEvent?.requestPermission === "function") {
    const response = await DeviceOrientationEvent.requestPermission();
    if (response !== "granted") {
      alert("Zugriff auf Bewegung verweigert");
    }
  }
}

export function handleOrientation(event) {
  return {
    alpha: event.alpha ?? 0,
    beta: event.beta ?? 0,
    gamma: event.gamma ?? 0
  };
}