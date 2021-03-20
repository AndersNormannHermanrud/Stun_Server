//We need a small server to manage and send info to the client. Communication between the clients will still be p2p
const http = require("http");
const ws = require('websocket')
const fs = require('fs').promises;
const host = 'localhost';
const port = 80;


class Client{
    constructor(connection, name) {//TODO add more features
        this.ip = connection.remoteAddress;
        this.name = name;
        this.connection = connection;
    }

    send(msg){
        this.connection.send(msg);
    }

    findClientByConnection(connection){
        if(this.connection===connection){
            return this
        }
    }
}

class ClientList {
    constructor() {
        this.clients = [];
    }

    push(client) {
        this.clients.push(client);
    }

    broadcast(data) {
        for (let client of this.clients) {
                client.send(data);
        }
    }

    get_ip() {
        let ip = [];
        for (let c of this.clients) {
            ip.push(c.ip)
        }
        return ip;
    }
}

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
                    clients: client_ip,
                    message: "Ip adressess of all users"
                });
                clients.broadcast(return_msg);
                let room_msg = JSON.stringify({
                    code: 2,    //Info when joining, rooms etc
                    rooms: rooms
                });
                connection.send(room_msg);
        }
    });

    connection.on('close', function (connection) {
        console.log("Client disconnected, IP: " + connection.remoteAddress)
        clients.splice(clients.indexOf(connection.remoteAddress), 1)
        let client_ip = clients.get_ip();
        let return_msg = JSON.stringify({
            code: 1,//Notify client of all connections
            clients: client_ip,
            message: "Ip adressess of all users"
        });
        clients.broadcast(return_msg);
    });
});