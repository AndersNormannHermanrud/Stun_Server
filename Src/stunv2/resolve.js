//var buffertools = require('buffertools')
var Analyse = require('./analyse')


var binding = {
    'request':0x0001,
    'indication':0x0011,
    'success':0x0101,
    'error':0x0111
};

var errors = {};

exports = module.exports = Resolve;

function Resolve(options){
    this.options  = options;
}

Resolve.prototype.resolve = function(packet,  source){
    var analysePacket = Analyse.decodePacket(packet)
}

