class Client{
    constructor(connection, name) {
        this.ip = connection.remoteAddress;
        this.name = name;
        this.connection = connection;
        this.id = 0;
    }

    send(msg){
        this.connection.send(msg);
    }
}
module.exports = Client