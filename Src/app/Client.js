export default class Client{
    constructor(connection, name) {//TODO add more features
        this.ip = connection.remoteAddress;
        this.name = name;
        this.connection = connection;
    }

    send(msg){
        this.connection.send(msg);
    }

    findClientByConnection(connection){
        if(this.connection===connection){
            return this
        }
    }
}