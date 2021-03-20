const app = Vue.createApp({
    data() {
        return {
            room: undefined,
            username: undefined,
            time_stamp: undefined,
            rooms: [],
            chat: [{
                username: this.username, time_stamp: this.time_stamp
            }],
            socket: undefined
        }
    },
    methods: {
        openWebSocketConnection() {
            if (this.socket === undefined) {
                this.socket = new WebSocket('ws://localhost:80');
                //Socket events
                this.socket.addEventListener("open", function () {
                    this.send(JSON.stringify({
                        code: 1,
                        message: this.url
                    }))
                });
                this.socket.addEventListener("message", function (message) {
                    document.getElementById("send").value = "message recieved";
                    let msg = JSON.parse(message.data)
                    switch (msg.code) {
                        case 1:
                            document.getElementById("receive").value = msg.message;
                            break
                        default:
                            document.getElementById("receive").value = msg.message + " could not parse";
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