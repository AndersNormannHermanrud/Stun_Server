const socket = io("ws://localhost:80");
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
            allClients: [],
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
        },

        call(client) {
            let stream = this.$refs.video.stream;
            console.log("Typeof stream when call in application is called: " + Object.prototype.toString.call(stream))
            console.log(stream.id)
            let myId = this.$refs.video.myid;
            this.socket.send(JSON.stringify({
                code: 4,
                targetId: client.id,
                id: myId,
                stream: stream,
            }));
            this.socket.send(stream);
        }

    },
    computed: {},
    mounted() {
        let vm = this;
        this.socket = socket;
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
                    let arr = [];
                    for (let i in msg.data) {
                        let d = JSON.parse(msg.data[i]);
                        arr.push(new ClassClient(d.ip, d.name, d.id))
                    }
                    vm.allClients = arr;
                    break
                case 2: //Recieving additional data from server (currently only rooms)
                    vm.rooms = msg.data;
                    vm.$refs.video.myid = msg.id;
                    console.log("My id: " + msg.id)
                    break
                case 4: //Accept private (ice) message
                    vm.$refs.video.connectMessage(msg.id);
                    break
                default:
                    break
            }
        });
    }
})
