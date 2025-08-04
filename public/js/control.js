window.addEventListener("deviceorientation", (e) => {
  const { alpha, beta, gamma } = e;

  // alpha (Kompass-Rotation), beta (nach vorne kippen), gamma (seitlich kippen)
  // Wir behandeln alpha als Richtung, beta als Neigung

  // Umwandlung in Vektor (optional für später)
  const direction = {
    x: Math.sin(alpha * Math.PI / 180),
    y: -Math.sin(beta * Math.PI / 180)
  };

  socket.emit("gyroData", {
    alpha,
    beta,
    gamma,
    dirX: direction.x,
    dirY: direction.y
  });
});
