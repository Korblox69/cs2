const WebSocket = require('ws');
const express = require('express');
const app = express();
const server = app.listen(8080, () => console.log('Server running on port 8080'));
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    ws.on('message', message => {
        let data = JSON.parse(message);
        if (data.type === 'playerUpdate') {
            // Broadcast player position to other clients
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }
    });
});
