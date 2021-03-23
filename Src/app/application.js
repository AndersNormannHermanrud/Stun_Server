const app = Vue.createApp({
    data() {
        return {
            room: undefined,
            username: undefined,
            time_stamp: undefined,
            rooms: [{}],
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
            this.$ref.video.invite(client);
        }

    },
    computed: {},
    mounted() {
        let vm = this;
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
                    let arr = [];
                    for (let i in msg.data) {
                        let d = JSON.parse(msg.data[i]);
                        arr.push(new ClassClient(d.ip, d.name, d.id))
                    }
                    this.allClients = arr;
                    //vm.$refs.client.setClients(msg.data);//Call method of component that has ref="client"
                    break
                case 2:
                    vm.rooms = msg.data;
                    break
                case 4: //Accept private (ice) message
                    let data = JSON.parse(msg.data);
                    switch (data.type){
                        case "video-offer":
                            vm.$refs.video.handleVideoOfferMsg(msg.data)
                            break
                        case "new-ice-candidate":
                            vm.$refs.video.handleNewICECandidateMsg(msg.data)
                            break
                        case "video-answer":
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
