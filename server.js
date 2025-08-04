import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

const clients = new Map();

io.on("connection", (socket) => {
  console.log("🟢 Verbunden:", socket.id);
  clients.set(socket.id, { id: socket.id });

  socket.on("disconnect", () => {
    console.log("🔴 Getrennt:", socket.id);
    clients.delete(socket.id);
  });

  socket.on("clientType", (data) => {
    io.emit("clientType", { id: socket.id, type: data.type });
  });

  socket.on("gyroData", (data) => {
    io.emit("gyroData", { ...data, id: socket.id });
  });

  socket.on("updateConfig", (data) => {
    io.emit("updateConfig", data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});
