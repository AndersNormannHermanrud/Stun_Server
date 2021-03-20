const app = Vue.createApp({
    data() {
        return {
            room: undefined,
            username: undefined,
            rooms: []
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