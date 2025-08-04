const express = require("express");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));

// WebSocket-Server
const server = app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("Neuer Client verbunden (IP:", ws._socket.remoteAddress, ")");
    
    ws.on("message", (data) => {
        console.log("Empfangene Daten:", data.toString()); // Debug-Log
        
        // Broadcast an ALLE Clients (inkl. Admin)
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data.toString());
            }
        });
    });

    ws.on("close", () => console.log("Client getrennt"));
});
