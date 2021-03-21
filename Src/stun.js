const crypto = require('crypto');
const util = require('util');
const Message = require('./Message');
const net = require('dgram');
const socket = net.createSocket('udp4');

socket.on('message', (message, rinfo)=>{
    const newMessage = Message.decode(message);
    console.log('Från klient : ' , message);
    console.log(rinfo);
    const rMessage = Message.encodeMessage(message, newMessage, rinfo.address, rinfo.port);
    const client = net.createSocket('udp4');
    client.send(rMessage, rinfo.port, rinfo.address);
    console.log(rMessage);
});


/* function Server(options) {
    options = options || {};

    this.type = options.type || Server.TYPE.TLS;
    const adress = options.server.address();
    
    this.server = options.server;
    this.port = adress.port;
    this.host = adress.host || adress.address; 
};
module.exports  = Server;

Server.prototype.start = function(){
    this.server.bind(this.port, this.host, )
}
Server.TYPE = {
    TLS: 0,
    TCP: 0,
    UDP: 1
}; */