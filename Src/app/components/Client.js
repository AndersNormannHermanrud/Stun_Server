class ClassClient {
    constructor(ip, name, id) {
        this.ip = ip;
        this.name = name;
        this.id = id;
    }
}

app.component('Client', {
    props: {
        clients: {
            type: [],
            required: true
        }
    },
    template:
    /*html*/
        `
        <ul id="connected_users">
            <li>Connected users</li>
            <li v-for="client in clients">{{displayName(client)}}<button @click="call(client)">Call placeholder</button></li>
        </ul>
         `
    ,
    methods: {
        call(client) {
            this.$root.$refs.video.connectToNewUser(client);
        },
        displayName(client) {
            let name = client.name;
            if (name !== "unnamed") {
                return client.name;
            }
            return client.ip;
        },
    },
    computed: {},
})
