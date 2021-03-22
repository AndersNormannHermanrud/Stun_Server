class ClassClient {
    constructor(ip, name) {
        this.ip = ip;
        this.name = name;
    }
}

class ClassClients {
    constructor(clients) {
        this.clients = clients;
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
            <li v-for="client in displayNames()" :click="call({{client}})">{{client}}</li>
        </ul>
         `
    ,
    methods: {
        call(client) {

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
        }
    },
    computed: {},
})
