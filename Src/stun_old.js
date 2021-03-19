const dgram = require("dgram");
const message = require("message.js")
class stun {
    constructor ({port = 3478, udp4 = true, udp6 = true, log = console.log, err = console.error, sw = true} = {}) {
        this.udp4 = udp4;
        this.udp6 = udp6;
        this.port = port;
        this.log = log;
        this.err = err;
        this.sw = sw;
        this.socket = dgram.createSocket(port);

        this.socket.on("message",function (msg,INFOOMAVSENDER) {
            message.Message()
        });
    }
    start() {
        return new Promise((resolve, reject) => {
            
            //Skal vi støtte IPv6? Vi tar det senrer
            /* if (this.udp4 && this.udp6) {
				this.socket = dgram.createSocket("udp6");
			} else if (this.udp4) {
				this.socket = dgram.createSocket("udp4");
			} else {
				this.socket = dgram.createSocket({type: "udp6", ipv6Only: true});
			} */
            this.socket = dgram.createSocket("udp4");

			this.socket.on("listening", () => {
				const addr = this.socket.address();
				//this._lout(`Listening for STUN clients on ${addr.address}:${addr.port}\n`);
				resolve();//Koden som sender STUN Svar
			});

			this.socket.on("message", this._onMessage.bind(this));
			this.socket.bind(this.port);
			//this._lout(`ministun starting...\n`);
		}); 
	}
    _onMessage(msg, rinfo) {
		const inMsg = MStunMsg.from(msg);

		if (inMsg === null) {
			return;
		}

		//Logging this._lout(`${Object.keys(MStunHeader.K_MSG_TYPE)[MStunHeader._decType(inMsg.hdr.type).type]} received from ${rinfo.address}:${rinfo.port}\n`);

		// For compliance with RFCs 5389 and 3489, we return an error response for any unknown comprehension required attrs
		const badAttrTypes = [];

		inMsg.attrs.forEach((attr) => {
			if (MStunAttr._decType(attr.type).type === MStunAttr.K_ATTR_TYPE.MALFORMED && MStunAttr._isCompReq(attr.type)) {
				badAttrTypes.push(attr.type);
			}
		});

		if (badAttrTypes.length > 0) {
			const attrs = [
				new MStunAttr({
					type: MStunAttr.K_ATTR_TYPE.ERROR_CODE, 
					args: [420]
				}),
				new MStunAttr({
					type: MStunAttr.K_ATTR_TYPE.UNKNOWN_ATTRIBUTES, 
					args: [badAttrTypes]
				})
			];

			const outHdr = new MStunHeader({
				type: MStunHeader.K_MSG_TYPE.BINDING_ERROR_RESPONSE, 
				len: MStunMsg._attrByteLength(attrs), 
				id: inMsg.hdr.id
			});

			const outMsg = new MStunMsg({
				hdr: outHdr, 
				attrs: attrs
			});

			this._send(outMsg, rinfo);
		}

		if (MStunHeader._decType(inMsg.hdr.type).type === MStunHeader.K_MSG_TYPE.BINDING_REQUEST) {
			const mtype = !inMsg.rfc3489 ? MStunAttr.K_ATTR_TYPE.XOR_MAPPED_ADDRESS : MStunAttr.K_ATTR_TYPE.MAPPED_ADDRESS;

			const attrs = [
				new MStunAttr({
					type: mtype, 
					args: [MStunAttr.K_ADDR_FAMILY[rinfo.family], rinfo.address, rinfo.port, !inMsg.rfc3489, inMsg.hdr.id]
				})
			];

			if (this.sw) {
				attrs.push(new MStunAttr({type: MStunAttr.K_ATTR_TYPE.SOFTWARE}));
			}
			
			const outHdr = new MStunHeader({
				type: MStunHeader.K_MSG_TYPE.BINDING_SUCCESS_RESPONSE, 
				len: MStunMsg._attrByteLength(attrs), 
				id: inMsg.hdr.id
			});

			const outMsg = new MStunMsg({
				hdr: outHdr, 
				attrs: attrs
			});

			this._send(outMsg, rinfo);
		}
	}
    
    
}



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