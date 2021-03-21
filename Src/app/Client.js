class Client{
    constructor(connection, name) {
        this.ip = connection.remoteAddress;
        this.name = name;
        this.connection = connection;
    }

    send(msg){
        this.connection.send(msg);
    }
}
module.exports = Client