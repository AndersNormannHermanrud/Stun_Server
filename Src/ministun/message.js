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

var IPv4 = 0x01;
var AttributeLength = 0x08;

function Message(type, transactionid, body) {
    this.type = type;
    this.body = body;
    this.transactionid = transactionid;
};

module.exports.Message = Message;

/* Decode funktionen er ikke iplementerad
Messsage.decode = function (message){
    var type = message.readUInt16BE(4);
    var lenght = message.readUInt16BE(2);
    var transactionid = message.slice(8,20);
    if (lenght<596){
        this.body = new Array(lenght+1).join('A');
        var stunMessage = new Message(type, transactionid, this.body);
        return transactionid;
    }
} 
*/
Message.encode = function(message, ip, port){
    console.log(ip + ' ' + port);
    var messageSplit = message.slice(4, 20);
    var ipAsBytes = getByteArrayFromIP(ip);
    //console.log(ipSplit);
    var portByte = intToHex(port);
    //console.log(portHex); 
    //Vi koder in kun en type STUN melding med MAPPED_ADDRESS
    var bytes = [
        Message.ATTRIBUTES.RESERVED,        //0 0x0000
        Message.ATTRIBUTES.MAPPED_ADDRESS,  //1 0x0001
        Message.ATTRIBUTES.RESERVED,        //0 0x0000
        AttributeLength,                    //8 0x08
        Message.ATTRIBUTES.RESERVED,        //0 0x0000
        IPv4                                //1 0x01
    ];
    console.log(bytes);
    var msgAsBuffer = Buffer.from(bytes);
    var bindingSuccess = Buffer.from(Message.TYPE.BINDING_SUCCESS_RESPONSE);
    var arrmsg = [bindingSuccess, messageSplit, msgAsBuffer, portByte, ipAsBytes ];
    return Buffer.concat(arrmsg);
};

//Atributer som kan brukes til STUN
Message.ATTRIBUTES = {
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

    SOFTWARE:           0x8022, //0x8022: SOFTWARE
    ALTERNATE_SERVER:   0x8023, //0x8023: ALTERNATE-SERVER
    FINGERPRINT:        0x8028  //0x8028: FINGERPRINT
};
//Types som kan brukes plus binding success
Message.TYPE = {
    REQUEST: 0x00,
    ERROR: 0x01,
    UPDATE: 0x02,
    BINDING_SUCCESS_RESPONSE:[0x01,0x01,0x00,0x0c],
}
Message.MAGIC_COOKIE = 0x2112A442;

//Gør om IP adressen til byte/hex format
function  getByteArrayFromIP(ip){
    var numArray = ip.split('.');
    var bytes = [];
    for (let index = 0; index < numArray.length; index++) {
        bytes.push(numArray[index]);
    }
    return Buffer.from(bytes);
};

//Gør om integer til byte/hex format
function intToHex(int){
    var buffer = Buffer.allocUnsafe(2);
    buffer.writeUInt16BE(int);
    return buffer;
};
