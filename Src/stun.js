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
    promise = new Promise((resolve, reject) =>{

    })
    
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