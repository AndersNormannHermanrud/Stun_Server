const app = Vue.createApp({
    data() {
        return {
            room: undefined,
            username: undefined,
            time_stamp: undefined,
            rooms: [{

            }],
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
        }
    },
    computed: {},
    components: {
        //'client': Client
        //'dialogue-display': dialogueDisplay
    },
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
                        arr.push(new ClassClient(d.ip, d.name))
                    }
                    vm.allClients = arr;
                    //vm.$refs.client.setClients(msg.data);//Call method of component that has ref="client"
                    break
                case 2:
                    vm.rooms = msg.data;
                default:
                    break
            }
        });
    }
})