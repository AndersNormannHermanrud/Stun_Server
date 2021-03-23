/* All STUN messages comprise a 20-byte header followed by zero or more
attributes.  The STUN header contains a STUN message type, message
length, magic cookie, and transaction ID.

   0                   1                   2                   3
   0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  |0 0|     STUN Message Type     |         Message Length        |
  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  |                         Magic Cookie                          |
  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  |                                                               |
  |                     Transaction ID (96 bits)                  |
  |                                                               |
  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

               Figure 2: Format of STUN Message Header

The most significant 2 bits of every STUN message MUST be zeroes.
This can be used to differentiate STUN packets from other protocols
when STUN is multiplexed with other protocols on the same port. 

The STUN Message Type field is decomposed further into the following
   structure:

                       0                 1
                       2  3  4 5 6 7 8 9 0 1 2 3 4 5
                      +--+--+-+-+-+-+-+-+-+-+-+-+-+-+
                      |M |M |M|M|M|C|M|M|M|C|M|M|M|M|
                      |11|10|9|8|7|1|6|5|4|0|3|2|1|0|
                      +--+--+-+-+-+-+-+-+-+-+-+-+-+-+

                Figure 3: Format of STUN Message Type Field
*/
Message.MAGIC_COOKIE = 0x2112A442;
var IPv4 = 0x01;
var AttributeLength = 0x08;

function Message(type, transactionid, body) {
    this.type = type;
    this.body = body;
    this.transactionid = transactionid;
};
module.exports.Message = Message;
/* 
Messsage.decode = function (message){
    var type = message.readUInt16BE(4);
    var lenght = message.readUInt16BE(2);
    var transactionid = message.slice(8,20);
    if (lenght<596){
        this.body = new Array(lenght+1).join('A');
        var stunMessage = new Message(type, transactionid, this.body);
        return transactionid;
    }
} */
Message.encode = function(message, ip, port){
    //var type = hexStringToByte(0x0101);
    console.log(ip + ' ' + port);
    var messageSplit = message.slice(4, 20);
    var ipSplit = getByteArrayIP(ip);
    console.log(ipSplit);
    var portHex = tohex(port);
    console.log(portHex);
    //var startArray = [0x01, 0x01, 0x00, 0x0c];
    //var thisIp = [0x4a, 0x7d, 0xc8, 0x7f];
    //console.log(thisIp);
    //var thisIp = getByteFromIPArray(ip);
    //var thisPort = [0xd7, 0x34];
    
    //var thisReserve = 0x00;
    
    //var thisAttrType = 0x01;
    //var bytes = [thisReserve, thisAttrType, 0x00, thisAttrlen, thisReserve, thisIPv4];
    var bytes = [
        Message.ATTRIBUTES.RESERVED,
        Message.ATTRIBUTES.MAPPED_ADDRESS,
        Message.ATTRIBUTES.RESERVED,
        AttributeLength,
        Message.ATTRIBUTES.RESERVED,
        IPv4
    ]
    /* 
    for (let index = 0; index < thisPort.length; index++) {
        bytes.push(thisPort[index]);
    }
    for (let index = 0; index < ipSplit.length; index++) {
        bytes.push(ipSplit[index])
    } */
    console.log(bytes);
    var msg1 = Buffer.from(bytes);
    var arrmsg = [Buffer.from(Message.TYPE.BINDING_SUCCESS_RESPONSE), messageSplit, msg1, portHex, ipSplit ]
    return Buffer.concat(arrmsg)
}


Message.ATTRIBUTES = {
    //Comprehension-required range (0x0000-0x7FFF):
    RESERVED:           0x0000, //0x0000: (Reserved)
    MAPPED_ADDRESS:     0x0001, //0x0001: MAPPED-ADDRESS
    RESPONSE_ADDRESS:   0x0002, //0x0002: (Reserved; was RESPONSE-ADDRESS)
    CHANGE_ADDRESS:     0x0003, //0x0003: (Reserved; was CHANGE-ADDRESS)
    SOURCE_ADDRESS:     0x0004, //0x0004: (Reserved; was SOURCE-ADDRESS)
    CHANGED_ADDRESS:    0x0005, //0x0005: (Reserved; was CHANGED-ADDRESS)
    USERNAME:           0x0006, //0x0006: USERNAME
    PASSWORD:           0x0007, //0x0007: (Reserved; was PASSWORD)
    MESSAGE_INTEGRITY:  0x0008, //0x0008: MESSAGE-INTEGRITY
    ERROR_CODE:         0x0009, //0x0009: ERROR-CODE
    UNKNOWN_ATTRIBUTES: 0x000A, //0x000A: UNKNOWN-ATTRIBUTES
    REFLECTED_FROM:     0x000B, //0x000B: (Reserved; was REFLECTED-FROM)
    REALM:              0x0014, //0x0014: REALM
    NONCE:              0x0015, //0x0015: NONCE
    XOR_MAPPED_ADDRESS: 0x0020, //0x0020: XOR-MAPPED-ADDRESS

    //Comprehension-optional range (0x8000-0xFFFF)
    SOFTWARE:           0x8022, //0x8022: SOFTWARE
    ALTERNATE_SERVER:   0x8023, //0x8023: ALTERNATE-SERVER
    FINGERPRINT:        0x8028  //0x8028: FINGERPRINT
};

Message.TYPE = {
    REQUEST: 0x00,
    ERROR: 0x01,
    UPDATE: 0x02,
    BINDING_SUCCESS_RESPONSE:[0x01,0x01,0x00,0x0c],
}
function  getByteArrayIP(ip){
    var numArray = ip.split('.');
    var bytes = [];
    for (let index = 0; index < numArray.length; index++) {
        bytes.push(numArray[index])
        
    }
    return Buffer.from(bytes);
}
function tohex(int){
    var buf = Buffer.allocUnsafe(2);
    buf.writeUInt16BE(int);
    return buf;
}
