//We need a small server to manage and send info to the client. Communication between the clients will still be p2p
const ClientList = require("./ClientList");
const Client = require("./Client");
const http = require("http");
const requestListener = function (req, res) {
    //console.log("URL: " + req.url)
    switch (req.url) {
        case"/":
            res.setHeader("Content-Type", "text/html");
            console.log("Sending html file");
            res.writeHead(200);
            res.end(indexFile);
            break
        case "/application.js":
            res.setHeader("Content-Type", "text/javascript");
            console.log("Sending application.js");
            res.writeHead(200);
            res.end(applicationFile);
            break
        case "/style.css":
            res.setHeader("Content-Type", "text/css");
            console.log("Sending style.css");
            res.writeHead(200);
            res.end(css);
            break
        default:
            let urlSplit = req.url.split("/");
            let filename = urlSplit[urlSplit.length - 1];
            console.log("url: " + req.url + "\tfilename: " + filename);
            for (let index in components) {
                let comp = components[index];
                if (comp.name === filename) {
                    res.setHeader("Content-Type", "text/javascript");
                    console.log("Sending " + comp.name);
                    res.writeHead(200);
                    res.end(comp.file);
                }
            }
            //res.writeHead(204);
            break;
    }
}
const server = http.createServer(requestListener);
const fs = require('fs').promises;
const host = 'localhost';
let io = require('socket.io')(server, {});

const port = 80;


let indexFile;
let applicationFile;
let css;
let components;

let clients = new ClientList();

let rooms = ["Planning poker", "Football talk", "Meetings", "Study group"] //Todo, make rooms classes


//Reading files into memory for faster sending
fs.readFile(__dirname + "/index.html")
    .then(contents => {
        indexFile = contents;
    })
fs.readFile(__dirname + "/application.js")
    .then(contents => {
        applicationFile = contents;
    })
fs.readFile(__dirname + "/style.css")
    .then(contents => {
        css = contents;
    })
/*fs.readFile(__dirname + "/../../node_modules/socket.io/socket.io.js")
    .then(contents => {
        socketIO = contents;
    })*/
components = readFiles("app/components/")


server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

// create the websocketserver


let lastKnownId;
let lastKnownSender;
// WebSocket server

//const httpserver = http.createServer();
//let socketserver = io.;
io.on('connection', function (connection) {
    connection.on("message", function (message) {
            let msg = JSON.parse(message);
            switch (msg.code) {
                case 1: //Client wants connection and server info
                    console.log("New client added to broadcast list, IP:" + connection.remoteAddress + " : " + connection.remotePort)
                    clients.push(new Client(connection, "unnamed"));
                    clients.broadcast(update_clients_message());
                    connection.send(JSON.stringify({
                        code: 2,    //Info when joining, rooms etc
                        data: rooms,
                        id: clients.get_id_of(connection)
                    }));
                    break
                case 3: //client changing username
                    console.log(connection.remoteAddress + " is changing username to " + msg.data);
                    clients.set_name(msg.data, connection);
                    clients.broadcast(update_clients_message());
                    break;
                case 4: //Client wants to call somebody, Do ICE server functionality
                    console.log("Sending rtc request to " + msg.targetId + " from: " + msg.id + "\tStream is type: " + Object.prototype.toString.call(msg.stream));
                    lastKnownId = msg.targetId;
                    lastKnownSender = msg.id;
                    let retMsg = JSON.stringify({
                        code: 4,
                        id: msg.id,
                        stream: msg.stream
                    });
                    clients.sendToOneUser(msg.targetId, retMsg);
                    break
                default:
                    break
            }
    })
})
;
io.on('disconnect', function (connection) {
    console.log("Client disconnected, IP: " + connection.remoteAddress)
    clients.removeAt(clients.indexOf(connection.remoteAddress))
    clients.broadcast(update_clients_message());
});

io.on('connection', function (connection, message) {
    console.log("New client added to broadcast list, IP:" + connection.remoteAddress + " : " + connection.remotePort)
    clients.push(new Client(connection, "unnamed"));
    clients.broadcast(update_clients_message());
    connection.send(JSON.stringify({
        code: 2,    //Info when joining, rooms etc
        data: rooms,
        id: clients.get_id_of(connection)
    }));
});

function update_clients_message() {
    let data = clients.get_data();
    return JSON.stringify({
        code: 1,//Notify client of all connections
        data: data,
        message: "Ip adressess of all users"
    });
}

//For reading all components; Currently not adequate for reuse
function readFiles(dir) {
    let myFiles = [];
    fs.readdir(dir)
        .then(namesNotString => { //pathAllNames is {'pathAllNames/file1,file2,...,fileN'}
            let pathAllName = namesNotString.toString();//Some casting to get the file names
            let files = pathAllName.split(",")
            console.log("Reading directory, found files: " + pathAllName)
            for (let index in files) {
                let file = files[index];
                let directory = __dirname + "\\components\\" + file;
                console.log("Trying to read file: " + directory)
                fs.readFile(directory)
                    .then(contents => {
                        console.log("Reading file: " + file + "from: " + directory)
                        myFiles.push(new File(file, contents));
                    });
            }
        });
    return myFiles;
}

class File {
    constructor(name, file) {
        this.name = name;
        this.file = file;
    }
}
