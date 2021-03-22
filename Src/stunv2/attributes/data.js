exports.type = 0x0013;
exports.name = 'Data';
exports.encode = function(data, fn){
    fn(this.tvl_encode(this.type, data.lenght, data));
}

exports.tlv_encode = function(type, length, value){
    var val = this.padBuffer(value); 

    var buf = new Buffer(4+val.length); 
    buf.writeUInt16BE(type, 0); 
    buf.writeUInt16BE(length, 2); 
    val.copy(buf, 4); 
    return buf;
} 
exports.decode = function(data, fn){
    fn(data);
}