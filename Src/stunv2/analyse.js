//var buffertools = require('buffertools');

var binding = {
    'request':0x0001,
    'indication':0x0011,
    'success':0x0101,
    'error':0x0111
};
var Attributes = require('./attributes');

exports.Attributes;

exports.decodePacket = function(packet){
    var header = this.decodeHeader(packet)
    var attributes = this.decodeAttributes(packet.slice(20));
    return {header, attributes};
}

exports.decodeHeader = function(packet){
    var start = packet.slice(0,1);
    var type = packet.slice(0, 2);
    var length = packet.slice(2,4);
    var magicCookie = packet.slice(4,8);
    var transactionId = packet.slice(8,20);
    if (!start.equals(0x00.toString())){
        console.log('ikke STUN pakke');
        throw "Ikke STUN";
    }else{
        return{
            'start':start,
            'type':type,
            'lenght':length,
            'magicCookie':magicCookie,
            'transactionId':transactionId,
            'error':null
        }
    }
}
exports.decodeAttributes = function(attributes){
    return attributes;
}
exports.encodePacket = function(packet){
    var header = new Buffer(20);
}