class ClientList {
    constructor() {
        this.clients = [];
    }

    get_data() {
        let data = [];
        for (let i in this.clients) {
            let c = this.clients[i];
            data.push(JSON.stringify({
                ip: c.ip,
                name: c.name,
                id: c.id
            }));
        }
        return data;
    }

    push(client) {
        this.setId(client)
        this.clients.push(client);
    }

    setId(client){
        while(true){
            let id = Math.floor(Math.random()*100000)
            let unique = true;
            for(let c in this.clients){
                if(c.id === id){
                    unique = false;
                    break;
                }
            }
            if(unique){
                client.id = id;
                break;
            }
        }
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

    get_id_of(connection) {
        let i = this.indexOf(connection);
        return this.clients[i].id;
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

    sendToOneUser(targetId, msg) {
        for (let i = 0; i < this.clients.length; i++) {
            if (this.clients[i].id === targetId) {
                this.clients[i].connection.send(msg);
                break;
            }
        }
    }
}

module.exports = ClientList