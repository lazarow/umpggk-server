const Repository = require("./Repository.js");
        injector = require("./../container/injector.js");


class PlayerRepository extends Repository {
    isRegistered(name) {
        return this.db.get('players').find({name: name}).value() !== undefined;
    }
    register(name, socketId) {
        this.db.get("players").push({
            name: name,
            socketId: socketId,
            connected: false,
            connectedAt: null,
            points: 0,
            currentGame: null,
            currentOpponent: null,
            currentMatch: null,
            deadline: null,
            games: [],
            matches: [],
            opponents: []
        }).write();

        this.emitChange("players", "push", {
            name,
            socketId
        })
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

module.exports = new PlayerRepository();
