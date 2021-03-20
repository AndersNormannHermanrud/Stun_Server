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
            socket: undefined,
            connected_users: ["empty ip"]
        }
    },
    methods: {
    },
    computed: {},
    created() {
        var vm = this;
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
                document.getElementById("send").value = "message received";
                let msg = JSON.parse(message.data)
                switch (msg.code) {
                    case 1: //Connected to server, receive server info
                        vm.connected_users = msg.clients;
                        document.getElementById("receive").value = msg.message;
                        break
                    case 2: //New (other) client available
                        vm.connected_users.push(msg.ip)
                        break
                    default:
                        break
                }
            });
        }
    }
})