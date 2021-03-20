//We need a small server to manage and send info to the client. Communication between the clients will still be p2p
const http = require("http");
const fs = require('fs').promises;
const host = 'localhost';
const port = 80;

let indexFile;


const requestListener = function (req, res) {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(indexFile);
};

const server = http.createServer(requestListener);
fs.readFile(__dirname + "/index.html")
    .then(contents => {
        indexFile = contents;
    })


server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});