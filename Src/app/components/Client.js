class ClassClient {
    constructor(ip, name) {
        this.ip = ip;
        this.name = name;
    }
}

app.component('Client', {
    props: {
        clients: {
            type: Array,
            required: true
        }
    },
    template:
    /*html*/
        `
        <ul id="connected_users">
            <li>Connected users</li>
            <li v-for="client in displayNames()">{{client}}</li>
        </ul>
         `
    ,
    methods: {
        displayNames() {
            let display = [];
            for (let i = 0; i < this.clients.length; i++) {
                let c = this.clients[i];
                let name = c.name;
                if (name !== "unnamed") {
                    display.push(name);
                }
                display.push(c.ip);
            }
            return display;
        }
    },
    computed: {
    },
})
