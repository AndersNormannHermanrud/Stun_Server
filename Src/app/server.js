//We need a small server to manage and send info to the client. Communication between the clients will still be p2p
const ClientList = require("./ClientList");
const Client = require("./Client");
const http = require("http");
const ws = require('websocket')
const fs = require('fs').promises;
const host = 'localhost';
const port = 80;


let indexFile;
let applicationFile;

let clients = new ClientList();
let WebSocketServer = ws.server;

let rooms = ["Planning poker", "Football talk", "Meetings", "Study group"] //Todo, make rooms classes

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

//Reading files into memory for faster sending
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
                console.log("New client added to broadcast list, IP:" + connection.remoteAddress + " : " + connection.remotePort)
                clients.push(new Client(connection, ""));
                let client_ip = clients.get_ip();
                let return_msg = JSON.stringify({
                    code: 1,    //Notify client of all connections
                    data: client_ip,
                    message: "Ip adressess of all users"
                });
                clients.broadcast(return_msg);
                let room_msg = JSON.stringify({
                    code: 2,    //Info when joining, rooms etc
                    data: rooms
                });
                connection.send(room_msg);
                break
            case 3: //client changing username
                console.log(connection.remoteAddress + " is changing username to " + msg.data);
                let c = clients.indexOf(connection);
                clients.clients[c].name = msg.data;
                break;
        }
    });

    connection.on('close', function (connection) {
        console.log("Client disconnected, IP: " + connection.remoteAddress)
        clients.removeAt(clients.indexOf(connection.remoteAddress))
        let client_ip = clients.get_ip();
        let return_msg = JSON.stringify({
            code: 1,//Notify client of all connections
            data: client_ip,
            message: "Ip adressess of all users"
        });
        clients.broadcast(return_msg);
    });
});