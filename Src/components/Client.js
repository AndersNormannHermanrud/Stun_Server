app.component(
    class Client {
        constructor(ip, name) {//TODO add more features
            this.ip = ip;
            this.name = name;
        }

        static clientFromJson(json) {
            let m = JSON.parse(json);
            return new Client(m.ip, m.name);
        }
    })