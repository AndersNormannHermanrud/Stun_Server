const app = Vue.createApp({
    data() {
        return {
            room: undefined,
            username: undefined,
            rooms: [],
            socket: undefined
        }
    },
    methods: {
        openWebSocketConnection(){
            if(this.socket === undefined) {
                this.socket = new WebSocket('ws://localhost:80');
                //Socket events
                this.socket.onopen = () => this.socket.send(JSON.stringify({
                    code: 1,
                    message: this.socket.url
                }))
                this.socket.on("message", function (message) {
                    document.getElementById("send").value = "message recieved";
                    msg = JSON.parse(message.utf8Data)
                    switch (msg.code){
                        case 1:
                            document.getElementById("receive").value = msg.message;
                            break
                    }
                });
            }
        },
        /*const: onConnection = (socket) => {
            socket.on('joinRoom', ({ username, room }) => {
                socket.join(room, () => {
                    users[room].push({ username: username, privateChat: false })
                    namespace.in(room).emit('newUser', users[room]);
                });
            });
        }*/
    },
    computed: {}
})