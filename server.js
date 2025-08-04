const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Statische Dateien aus dem public-Ordner bereitstellen
app.use(express.static("public"));

// WebSocket-Verbindung
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Gyro-Daten empfangen und an alle Clients weiterleiten
  socket.on("gyroData", (data) => {
    io.emit("gyroData", { id: socket.id, ...data });
  });

  // Empfangen von clientType ("game", "control", etc.)
  socket.on("clientType", (data) => {
    data.id = socket.id;
    io.emit("clientType", data);
  });

  // Empfangen und Weiterleiten des Glättungswerts (0.0 – 1.0)
  socket.on("smoothing", (value) => {
    io.emit("smoothing", value);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Server starten
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
