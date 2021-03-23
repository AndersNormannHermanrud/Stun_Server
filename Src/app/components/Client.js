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
            console.log("Clicked client: " + client.id)
        },

        //Shows either the name if the user has one, or its ip
        displayNames() {
            let display = [];
            for (let i in this.clients) {
                let c = this.clients[i];
                let name = c.name;
                if (name !== "unnamed") {
                    display.push(name);
                } else {
                    display.push(c.ip);
                }
            }
            return display;
        },
        displayName(client) {
            let name = client.name;
            if (name !== "unnamed") {
                return client.name;
            }
            return client.ip;
        },
    },
    computed: {
    },
})
