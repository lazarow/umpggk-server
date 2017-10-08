const Repository = require("./Repository.js");
        injector = require("./../container/injector.js");


class PlayersRepository extends Repository {
    isRegistered(name) {
        return this.db.get('players').find({name: name}).value() !== undefined;
    }
    register(name, socketId) {
        return this.db.get("players").push({
            name: name,
            socketId: socketId,
            connected: true,
            connectedAt: (new Date()).getTime(),
            points: 0,
            games: [],
            opponents: []
        }).write();
    }
    reconnect(name, socketId) {
        return this.db.get('players').find({name: name}).assign({
            socketId: socketId,
            connected: true,
            connectedAt: (new Date()).getTime(),
        }).write();
    }
    disconnect(socketId) {
        return this.db.get('players').find({socketId: socketId}).assign({
            socketId: null,
            connected: false,
            connectedAt: null,
        }).write();
    }
}

module.exports = new PlayersRepository();
