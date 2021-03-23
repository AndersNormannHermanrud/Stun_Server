const { Stun } = require("./stun.js");

const config = {
	udp4: true,
	port: 3478
};

const server = new Stun(config);

async function startServer() {
	await server.start();
}

async function stopServer() {
	await server.stop();
}

startServer();
//server.send();