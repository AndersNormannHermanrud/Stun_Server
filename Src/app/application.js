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
            connected_users: []
        }
    },
    methods: {
        setUserName() {
            console.log("sending change username request")
            name = document.getElementById("setUsernameField").value
            this.username = name;
            this.socket.send(JSON.stringify({
                code: 3,//Change username
                data: name
            }))
        }
    },
    computed: {
        displayNames: function () {
            let display = [];
            for (let client in this.connected_users) {
                name = client.name;
                if (name !== "") {
                    display.push(name);
                }
                display.push(client.ip);
            }
            return display;
        }
    },
    components:{
        'Client': Client,
        //'dialogue-display': dialogueDisplay
    },
    created() {
        let vm = this;
        if (this.socket === undefined) {
            this.socket = new WebSocket('ws://localhost:80');
            //Socket events
            this.socket.addEventListener("open", function () {
                this.send(JSON.stringify({
                    code: 1,
                    data: this.url
                }))
            });
            this.socket.addEventListener("message", function (message) {
                let msg = JSON.parse(message.data)
                switch (msg.code) {
                    case 1: //Receive info about other user
                        console.log("Recieving user data")
                        vm.connected_users = [];
                        for (let m in msg.data) {
                            let c = JSON.parse(m);
                            vm.connected_users.push(new Client(c.ip, c.name));
                        }
                        vm.connected_users = msg.data;
                        break
                    case 2:
                        vm.rooms = msg.data;
                    default:
                        break
                }
            });
        }
    }
})