const express = require("express");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));

// HTTPS-Umleitung (wichtig für iOS-Gyroskop)
app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https" && process.env.NODE_ENV === "production") {
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
});

// Server starten
const server = app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});

// WebSocket-Server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        // Broadcast an alle Clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data.toString());
            }
        });
    });
});
