//We need a small server to manage and send info to the client. Communication between the clients will still be p2p
const http = require("http");

const host = 'localhost';
const port = 80;

const requestListener = function (req, res) {};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});