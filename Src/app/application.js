const socket = io("ws://localhost:80");
const app = Vue.createApp({
    data() {
        return {
            room: undefined,
            username: undefined,
            time_stamp: undefined,
            rooms: [],
            chat: [],
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
            let stream = this.$refs.video.peer.id;
            let myId = this.$refs.video.myid;
            this.socket.send(JSON.stringify({
                code: 4,
                targetId: client.id,
                id: myId,
                stream: stream,
            }));
        },

        sendMsg() {
            let data = document.getElementById("chatField").value;
            if(data !== "") {
                this.socket.send(JSON.stringify({
                    code: 6,
                    data: data
                }));
            }
        },


        muteAudio(){
            //TODO make mute
        }

    },
    computed: {},
    mounted() {
        let vm = this;
        this.socket = socket;
        this.socket.on("message", function (message) {
            let msg = JSON.parse(message)
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
                    console.log("Ice message recieved from: " + msg.id)
                    vm.$refs.video.connectToNewUser(msg.id, msg.stream);
                    break
                case 6:
                    vm.chat.push(msg.data)
                default:
                    break
            }
        });
    }
})
