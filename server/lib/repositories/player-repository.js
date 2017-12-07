const	Repository		= require("./repository.js"),
		sockets			= require("./../servers/sockets.js"),
		socketsService	= require("./../services/socket-service.js");

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

class PlayerRepository extends Repository
{
	constructor() {
		super("players")
	}
	get(name) {
		return this.collection().find({ name: name });
	}
	getBySocketId(socketId) {
		return this.collection().find({ socketId: socketId });
	}
	// Connection
	isRegistered(name) {
        return this.get(name).value() !== undefined;
    }
    register(name) {
		const player = {
			// Id
            name: name,
			// Connection
            socketId: null,
			remoteAddress: null,
            connected: false,
            connectedAt: null,
			// Statistics
            points: 0,
			sos: 0,
			sosos: 0,
			sodos: 0,
			// Collection
			opponents: [],
			defetedOpponents: [],
			matches: [],
			games: [],
			// Flags
			currentOpponent: null,
			currentMatch: null,
            currentGame: null,
			onTheMove: false, // Checks if we wait for a player's move
			hasBye: false
        };
        this.collection().push(player).write();
		return player;
    }
	isOnline(name) {
    	return this.get(name).value().connected;
    }
    reconnect(name, socketId) {
        this.get(name).assign(this._.assign(this.get(name).value(), {
	        socketId: socketId,
			remoteAddress: sockets[socketId].remoteAddress,
	        connected: true,
	        connectedAt: (new Date()).getTime()
        })).write();
    }
    disconnect(socketId) {
		const player = this.collection().find({socketId: socketId});
		if (player.value() == undefined) {
			return;
		}
		if (player.value().currentGame !== null) {
			// Finish the current game
			require("./game-repository.js").disconnect(player.value().currentGame, player.value().name);
		}
		player.assign(this._.assign(player.value(), {
			socketId: null,
			remoteAddress: null,
	        connected: false,
	        connectedAt: null
        })).write();
    }
	// Setters
	addOpponent(name, opponentId) {
		this.get(name).assign(this._.assign(
			this.get(name).value(),
			{ opponents: this.get(name).value().opponents.concat(opponentId).filter(onlyUnique) }
		)).write();
	}
	addDefetedOpponent(name, opponentId) {
		this.get(name).assign(this._.assign(
			this.get(name).value(),
			{ defetedOpponents: this.get(name).value().defetedOpponents.concat(opponentId).filter(onlyUnique) }
		)).write();
	}
	addMatch(name, matchId) {
		this.get(name).assign(this._.assign(
			this.get(name).value(),
			{ matches: this.get(name).value().matches.concat(matchId) }
		)).write();
	}
	addGame(name, gameId) {
		this.get(name).assign(this._.assign(
			this.get(name).value(),
			{ games: this.get(name).value().games.concat(gameId) }
		)).write();
	}
	setCurrentOpponent(name, opponentId) {0
		this.get(name).assign(this._.assign(
			this.get(name).value(),
			{ currentOpponent: opponentId }
		)).write();
	}
	setCurrentMatch(name, matchId) {
		this.get(name).assign(this._.assign(
			this.get(name).value(),
			{ currentMatch: matchId }
		)).write();
	}
	setCurrentGame(name, gameId) {
		this.get(name).assign(this._.assign(
			this.get(name).value(),
			{ currentGame: gameId }
		)).write();
	}
	onTheMove(name, isOnTheMove) {
		this.get(name).assign(this._.assign(
			this.get(name).value(),
			{ onTheMove: isOnTheMove }
		)).write();
	}
	bye(name) {
		this.addPoints(name, 1); // one point for bye
		this.get(name).assign(this._.assign(
			this.get(name).value(),
			{ hasBye: true }
		)).write();
	}
	// Points and tie-breakers
	addPoints(name, points) {
		this.get(name).assign(this._.assign(this.get(name).value(), {
			points: this.get(name).value().points + points
		})).write();
	}
	computeSumOfOpponentsScores(name) {
		this.get(name).assign(this._.assign(this.get(name).value(), {
			sos: this.get(name).value().opponents.reduce(sumUpPoints, 0)
		})).write();
	}
	computeSumOfOpponentsSos(name) {
		this.get(name).assign(this._.assign(this.get(name).value(), {
			sosos: this.get(name).value().opponents.reduce(sumUpSumOfOpponentsScores, 0)
		})).write();
	}
	computeSumOfDefetedOpponentsScores(name) {
		this.get(name).assign(this._.assign(this.get(name).value(), {
			sodos: this.get(name).value().defetedOpponents.reduce(sumUpSumOfOpponentsScores, 0)
		})).write();
	}
	// Helpers
	getAllPlayersNames() {
		const names = [];
		this.collection().value().forEach((player) => {
			names.push(player.name);
		});
		return names;
    }
	write(name, message) {
		socketsService.write(this.get(name).value().socketId, message);
	}
}

function sumUp(what, sum, who) {
	return sum + this.get(who).value()[what];
}

const playerRepository  = new PlayerRepository();

const sumUpPoints = sumUp.bind(playerRepository, "points");
const sumUpSumOfOpponentsScores = sumUp.bind(playerRepository, "sos");

module.exports = playerRepository;
