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

        sendIceRequest(data){
            this.socket.send(JSON.stringify({
                code: 99999,
                data: data
            }))
        },
        call(client){
            this.$refs.video.invite(client);
        }

    },
    computed: {},
    mounted() {
        let vm = this;
        this.socket = new WebSocket('ws://localhost:80');
        vm.$refs.video.createConnection(this.socket);
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
                    let arr = [];
                    for (let i in msg.data) {
                        let d = JSON.parse(msg.data[i]);
                        arr.push(new ClassClient(d.ip, d.name, d.id))
                    }
                    vm.allClients = arr;
                    break
                case 2: //Recieving additional data from server (currently only rooms)
                    vm.rooms = msg.data;
                    vm.$refs.video.set_id(msg.id);
                    break
                case 4: //Accept private (ice) message
                    let data = JSON.parse(msg.data);
                    switch (data.type){
                        case "video-offer":
                            console.log("Receiving video offer");
                            vm.$refs.video.handleVideoOfferMsg(data);
                            break
                        case "new-ice-candidate":
                            console.log("Receiving ice canidate message");
                            vm.$refs.video.handleNewICECandidateMsg(data);
                            break
                        case "video-answer":
                            console.log("Sending video answer");
                            break
                        case "hang-up":
                            console.log("Other user hung up");
                            vm.$refs.video.closeVideoCall();
                            break
                        default:
                            break
                    }
                    break
                default:
                    break
            }
        });
    }
})
