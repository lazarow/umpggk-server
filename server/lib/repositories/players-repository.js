const Repository = require("./repository.js");
        injector = require("./../container/injector.js");


class PlayerRepository extends Repository {


    /*return player latest id or undefined*/
    latestGame(playerName){

        return this.db.get("games").filter(game => game.white === playerName || game.black === playerName).last().value();


    }

    getName(socketId){
        return this.db.get("players").find({socketId: socketId}).get("name").value();
    }

    isRegistered(name) {
        return this.db.get('players').find({name: name}).value() !== undefined;
    }
    register(name, socketId) {
        let playerObj = {
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
        };

        this.db.get("players").push(playerObj).write();

        this.emitChange({
            table: "players",
            action: "push",
            data: playerObj
        });
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
