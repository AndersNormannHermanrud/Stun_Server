const app = Vue.createApp({
    data() {
        return {
            room: undefined,
            username: undefined,
            time_stamp: undefined,
            rooms: [],
            chat: [{
                username: this.username, time_stamp: this.time_stamp
            }]
        }
    },
    methods: {
        const: onConnection = (socket) => {
            socket.on('joinRoom', ({ username, room }) => {
                socket.join(room, () => {
                    users[room].push({ username: username, privateChat: false })
                    namespace.in(room).emit('newUser', users[room]);
                });
            });
        }


    },
    computed: {}
})