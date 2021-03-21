const Client = require("Client");
class ClientList {
    constructor() {
        this.clients = [];
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

    indexOf(connection){
        for(let i = 0; i < this.clients.length;i++){
            if(this.clients[i].connection === connection)
                return i;
        }
    }
}