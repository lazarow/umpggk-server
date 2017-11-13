const
    Repository  = require("./repository.js"),
    injector    = require("./../container/injector.js");

class PlayerRepository extends Repository
{
    namespace() {
        return "players";
    }
    register(name) {
        return this.db().get("players").push({
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
    }
    reconnect(name, socketId) {
        return this.db().get("players").find({name: name}).assign({
	        socketId: socketId,
	        connected: true,
	        connectedAt: (new Date()).getTime(),
        }).write();
    }
    disconnect(socketId) {
        return this.db().get("players").find({socketId: socketId}).assign({
	        socketId: null,
	        connected: false,
	        connectedAt: null,
        }).write();
    }
	isRegistered(name) {
        return this.db().get("players").find({name: name}).value() !== undefined;
    }
	addMatch(name, matchId) {
		const player = this.db().get("players").find({name: name});
		const matches = player.value().matches;
		matches.push(matchId);
		return player.assign({matches: matches}).write();
	}
	addGame(name, gameId) {
		const player = this.db().get("players").find({name: name});
		const games = player.value().games;
		games.push(gameId);
		return player.assign({games: games}).write();
	}
	addOpponent(name, opponentId) {
		const player = this.db().get("players").find({name: name});
		const opponents = player.value().opponents;
		opponents.push(opponentId);
		return player.assign({opponents: opponents}).write();
	}
	getSocketId(name) {
		return this.db().get("players").find({name: name}).value().socketId;
	}
}

module.exports = new PlayerRepository();
