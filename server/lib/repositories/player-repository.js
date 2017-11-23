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
            socketId: null,
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
		const player = this.db().get("players").find({name: name});
        return player.assign(this._.assign(player.value(), {
	        socketId: socketId,
	        connected: true,
	        connectedAt: (new Date()).getTime()
        })).write();
    }
    disconnect(socketId) {
		const player = this.db().get("players").find({socketId: socketId});
        return player.assign(this._.assign(player.value(), {
			socketId: null,
	        connected: false,
	        connectedAt: null
        })).write();
    }
	isRegistered(name) {
        return this.db().get("players").find({name: name}).value() !== undefined;
    }
	addMatch(name, matchId) {
		const player = this.db().get("players").find({name: name});
		const matches = player.value().matches;
		matches.push(matchId);
		return player.assign(this._.assign(player.value(), {matches: matches})).write();
	}
	addGame(name, gameId) {
		const player = this.db().get("players").find({name: name});
		const games = player.value().games;
		games.push(gameId);
		return player.assign(this._.assign(player.value(), {games: games})).write();
	}
	addOpponent(name, opponentId) {
		const player = this.db().get("players").find({name: name});
		const opponents = player.value().opponents;
		opponents.push(opponentId);
		return player.assign(this._.assign(player.value(), {opponents: opponents})).write();
	}
	getSocketId(name) {
		return this.db().get("players").find({name: name}).value().socketId;
	}
    isOnline(name) {
        return this.db().get("players").find({name: name}).value().connected;
    }

    /*Should be get players  cus it return whole player object not only name ?*/
    getNames() {
        return Object.keys(this.db().get("players").value());
    }

	setCurrentGame(name, gameId) {
		const player = this.db().get("players").find({name: name});
		return player.assign(this._.assign(player.value(), {currentGame: gameId})).write();
	}

	playedWith(player,opponent){
        const player = this.db().get("players").find({name: name});
        return false;
        /*TODO*/
    }
    hadFreeGame(player){
	    /*TODO*/
	    return false;
    }

}

module.exports = new PlayerRepository();
