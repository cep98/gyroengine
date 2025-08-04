const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Server starten
const server = app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});

// WebSocket-Server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Neue Client-Verbindung');

    ws.on('message', (data) => {
        try {
            // Broadcast an ALLE Clients
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data.toString());
                }
            });
        } catch (err) {
            console.error('Broadcast-Fehler:', err);
        }
    });

    ws.on('close', () => console.log('Client getrennt'));
});
