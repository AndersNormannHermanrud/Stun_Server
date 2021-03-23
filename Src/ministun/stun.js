const dgram = require("dgram");
const {Message} = require("./message.js")



class Stun {
	constructor({port = 3478, udp4 = true} = {}) {
		this.udp4 = udp4;
		this.port = port;
		this.socket = null;
	}

	start() {
		return new Promise(() => { 
			this.socket = dgram.createSocket("udp4");
            //this.socket.on("listening", console.log('socket listening on '+this.port));
			this.socket.on("message", this.sendMessage.bind(this));
			this.socket.bind(this.port);
			console.log('starting stunserver');
		}); 
	}

    send() {
        this.socket.send('test', 3478, '127.0.0.1');
    }

	stop() {
		return new Promise(() => {
			this.socket.on("close", console.log('socket closed'));	
			this.socket.close();
		});
	}
	sendMessage(msg, rinfo) {
		this.socket.send(Message.encode(msg, rinfo.address, rinfo.port), rinfo.port, rinfo.address);	
	}
}

module.exports.Stun = Stun;

//RFC kommentarer
/*                      +--------+
                        |  Test  |
                        |   I    |
                        +--------+
                             |
                             |
                             V
                            /\              /\
                         N /  \ Y          /  \ Y             +--------+
          UDP     <-------/Resp\--------->/ IP \------------->|  Test  |
          Blocked         \ ?  /          \Same/              |   II   |
                           \  /            \? /               +--------+
                            \/              \/                    |
                                             | N                  |
                                             |                    V
                                             V                    /\
                                         +--------+  Sym.      N /  \
                                         |  Test  |  UDP    <---/Resp\
                                         |   II   |  Firewall   \ ?  /
                                         +--------+              \  /
                                             |                    \/
                                             V                     |Y
                  /\                         /\                    |
   Symmetric  N  /  \       +--------+   N  /  \                   V
      NAT  <--- / IP \<-----|  Test  |<--- /Resp\               Open
                \Same/      |   I    |     \ ?  /               Internet
                 \? /       +--------+      \  /
                  \/                         \/
                  |                           |Y
                  |                           |
                  |                           V
                  |                           Full
                  |                           Cone
                  V              /\
              +--------+        /  \ Y
              |  Test  |------>/Resp\---->Restricted
              |   III  |       \ ?  /
              +--------+        \  /
                                 \/
                                  |N
                                  |       Port
                                  +------>Restricted

                 Figure 2: Flow for type discovery process 
   
   To determine the binding lifetime, the client first sends a Binding
   Request to the server from a particular socket, X.  This creates a
   binding in the NAT.  The response from the server contains a MAPPED-
   ADDRESS attribute, providing the public address and port on the NAT.
   Call this Pa and Pp, respectively.  The client then starts a timer
   with a value of T seconds.  When this timer fires, the client sends
   another Binding Request to the server, using the same destination
   address and port, but from a different socket, Y.  This request
   contains a RESPONSE-ADDRESS address attribute, set to (Pa,Pp).  This
   will create a new binding on the NAT, and cause the STUN server to
   send a Binding Response that would match the old binding, if it still
   exists.  If the client receives the Binding Response on socket X, it
   knows that the binding has not expired.  If the client receives the
   Binding Response on socket Y (which is possible if the old binding
   expired, and the NAT allocated the same public address and port to
   the new binding), or receives no response at all, it knows that the
   binding has expired.*/