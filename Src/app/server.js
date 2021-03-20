//We need a small server to manage and send info to the client. Communication between the clients will still be p2p
const http = require("http");
const ws = require('websocket')
const fs = require('fs').promises;
const host = 'localhost';

//Websocket codes
const newClient = 1;

const port = 80;

let indexFile;
let applicationFile;
let bundleFile;

let clients = [];
let WebSocketServer = ws.server;

clients.broadcast = function (data, except) {
    for (let sock of this) {
        if (sock !== except) {
            sock.write(data);
        }
    }
}

const requestListener = function (req, res) {
    //console.log("URL: " + req.url)
    switch (req.url) {
        case"/":
            res.setHeader("Content-Type", "text/html");
            console.log("Sending html file")
            res.writeHead(200);
            res.end(indexFile, applicationFile);
            break
        case "/application.js":
            res.setHeader("Content-Type", "text/javascript");
            console.log("Sending application.js")
            res.writeHead(200);
            res.end(applicationFile)
            break
        default:
            break
    }
}

const server = http.createServer(requestListener);
fs.readFile(__dirname + "/index.html")
    .then(contents => {
        indexFile = contents;
    })
fs.readFile(__dirname + "/application.js")
    .then(contents => {
        applicationFile = contents;
    })

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

// create the websocketserver
wsServer = new WebSocketServer({
    httpServer: server,
});

// WebSocket server
wsServer.on('request', function (request) {
    let connection = request.accept(null, request.origin);

    connection.on('message', function (message) {
        let msg = JSON.parse(message.utf8Data);
        switch (msg.code) {
            case 1:
                clients.push(connection);
                console.log("New client added to broadcast list, IP:" + connection.remoteAddress)
                let return_msg = JSON.stringify({
                    code: 1,
                    message:"General Kenobi"})
                connection.send(return_msg)
        }
    });

    connection.on('close', function (connection) {
        console.log("Client disconnected, IP: " + connection.remoteAddress)
        clients.splice(clients.indexOf(connection),1)
    });
});