const express = require('express');
const server = require('http').createServer(express);
const app = express();

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname});
});

server.on('request', app);
server.listen(3000, () => {
    console.log('Express server listening on port %d ', 3000);
});

// Begin Webscocket server
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({server: server});

wss.on('connection', function connection(ws) {
    const numCLients = wss.clients.size;
    console.log('Number of clients connected: ' + numCLients);
    
    wss.broadcast(`Curent visitors: ${numCLients}`);

    if(ws.readyState === ws.OPEN) {
        ws.send('Welcome to my server!');
    }

    ws.on('close', function close() {
        wss.broadcast(`Curent visitors: ${numCLients}`);
        console.log('A client has disconnected');
    });
});

wss.broadcast = function broadcast(msg) {
    wss.clients.forEach(function each(client) {
        client.send(msg);
    });
}
