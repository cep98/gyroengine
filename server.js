const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Weiterleiten von Gyro-Daten an alle
  socket.on("gyroData", (data) => {
    io.emit("gyroData", { id: socket.id, ...data });
  });

  // Erkennen von Client-Typen (z. B. game)
  socket.on("clientType", (data) => {
    data.id = socket.id;
    io.emit("clientType", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
