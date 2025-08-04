let pos = { x: canvas.width / 2, y: canvas.height / 2 };
let dir = { x: 0, y: 0 };

socket.on("gyroData", (data) => {
  dir.x = data.dirX || 0;
  dir.y = data.dirY || 0;
});

function draw() {
  // Bewegung simulieren (z. B. 5 Pixel pro Frame)
  pos.x += dir.x * 5;
  pos.y += dir.y * 5;

  // Begrenzung
  pos.x = Math.max(0, Math.min(canvas.width, pos.x));
  pos.y = Math.max(0, Math.min(canvas.height, pos.y));

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
  ctx.fill();

  requestAnimationFrame(draw);
}
draw();
