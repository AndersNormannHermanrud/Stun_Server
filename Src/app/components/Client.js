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
<div class="grid-container">
    <div class="list-of-connected-users">
    
        <ul id="connected_users">
            <li>Connected users</li>
            <li v-for="(client, index) in clients" :key="index">{{displayName(client)}}
            <button @click="call(client)">Call placeholder</button>
            </li>
        </ul>
    </div>
</div>
         `
    ,
    methods: {
        call(client) {
            //this.$emit('call-client', client);
            this.$root.call(client);
            console.log("Client id: " + client.id + "\tMy id: " + this.$root.$refs.video.myid)
        },
        displayName(client) {
            let name = client.name;
            if (name !== "unnamed") {
                return client.name;
            }
            return client.id;
        },
    },
    computed: {},
})
