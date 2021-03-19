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

function Message(type, transactionid, body) {
    this.type = type;
    this.body = body;
    this.transactionid = transactionid;
};
module.exports = Message;

Message.encodeMessage = function(message, transactionid, ip, port){
    //const type = hexStringToByte(0x0101);
    var messageSplit = message.slice(4, 20);

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
}

function hexStringToByte(str) {
    if (!str) {
        return new Uint8Array();
    }

    var a = [];
    for (var i = 0, len = str.length; i < len; i+=2) {
        a.push(parseInt(str.substr(i,2),16));
    }
    return new Uint8Array(a);
  }