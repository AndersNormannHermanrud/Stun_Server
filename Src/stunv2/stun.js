var dgram = require('dgram')
var net = require('net')
var Resolve = require('./resolve')

exports = module.exports = Stun;

function Stun(options){
    options.protocol = 'udp4';
    options.port = 19302;
    this.options  = options;
    this.Resolver = new Resolve(this.options)
}

Stun.prototype.createStunServer = function(){
    var udpServer = dgram.createSocket('udp4');
    udpServer.on('message', function(message,  rinfo){
        console.log('udp  connecton'+ rinfo.address + ' '+ rinfo.port);
        var resolveValue = this.Resolve.resolve(message, rinfo);
        console.log('sending respons');
        udpServer.send(resolveValue, 0, resolveValue.length, rinfo.port, rinfo.address, function(error, bytes){
            console.log('errors: '+error);
            console.log('bytes: '+bytes);
        });
    });
    udpServer.on('listening', function(){
      var udpAddress = udpServer.address();
      console.log('udp server lytter på adress og port '+udpAddress.address+' '+ udpAddress.port);
    });

    udpServer.bind(this.options.port);
}
