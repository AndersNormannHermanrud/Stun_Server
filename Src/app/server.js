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
            sock.send(data);
        }
    }
}
clients.get_ip = function (data, except){
    let ip = [];
    for(let c of this){
        ip.push(c.remoteAddress)
    }
    return ip;
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
            case 1: //Client wants connection and server info
                console.log("New client added to broadcast list, IP:" + connection.remoteAddress + " : " + connection.port)
                let broad_msg =JSON.stringify({
                    code: 2,
                    ip: connection.remoteAddress,
                    port:connection.remotePort,
                    message: "New client connected"
                });
                let client_ip = clients.get_ip();
                let return_msg = JSON.stringify({
                    code: 1,
                    clients: client_ip,
                    message:"Connected"});
                clients.broadcast(broad_msg);
                connection.send(return_msg)
                clients.push(connection);
        }
    });

    connection.on('close', function (connection) {
        console.log("Client disconnected, IP: " + connection.remoteAddress)
        clients.splice(clients.indexOf(connection),1)
    });
});