const dgram = require("dgram");
class stun {
    constructor ({port = 3478, udp4 = true, udp6 = true, log = console.log, err = console.error, sw = true} = {}) {
        this.udp4 = udp4;
        this.udp6 = udp6;
        this.port = port;
        this.log = log;
        this.err = err;
        this.sw = sw;
        this.socket = null;
    }
}