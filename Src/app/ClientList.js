class ClientList {
    constructor() {
        this.clients = [];
    }

    get_data() {
        let data = [];
        for (let c in this.clients) {
            data.push(JSON.stringify({
                ip: c.ip,
                name: c.name
            }));
        }
        return data;
    }

    push(client) {
        this.clients.push(client);
    }

    broadcast(data) {
        for (let client of this.clients) {
            client.send(data);
        }
    }

    get_ip() {
        let ip = [];
        for (let c of this.clients) {
            ip.push(c.ip)
        }
        return ip;
    }

    set_name(name, connection) {
        let i = this.indexOf(connection);
        if (i !== undefined)
            this.clients[i].name = name;
    }

    indexOf(connection) {
        for (let i = 0; i < this.clients.length; i++) {
            if (this.clients[i].connection === connection)
                return i;
        }
    }

    removeAt(index) {
        this.clients.splice(index, 1);
    }
}

module.exports = ClientList