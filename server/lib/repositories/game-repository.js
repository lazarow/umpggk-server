const
	Repository	= require("./repository.js"),
	injector	= require("./../container/injector.js");

class GameRepository extends Repository
{
	namespace() {
        return "games";
    }
	create(whiteId, blackId) {
		return this.db().get("games").push({
			id: this.idGenerator.next().value,
			white: whiteId,
		    black: blackId,
		    winner: null,
		    loser: null,
		    startedAt: null,
		    finishedAt: null,
		    duration: null,
		    state: null,
		    moves: []
        }).write();
	}
	start(gameId) {
		const game = this.db().get("games").find({id: gameId});
		// todo: checking if players are connected, if not then resolvce a game immediately
		// todo: send messages to the players that the game is started
		return game.assign({startedAt: (new Date()).getTime()}).write();
	}
	finish(gameId) {
		const
			finishedAt = (new Date()).getTime(),
			game = this.db().get("games").find({id: gameId}),
			startedAt = game.value().startedAt;
		return game.assign({finishedAt: finishedAt, duration: finishedAt - startedAt}).write();
	}
	isStarted(gameId) {
		return this.db().get("games").find({id: gameId}).value().startedAt === null;
	}
	isUnifinished(gameId) {
		return this.db().get("games").find({id: gameId}).value().finishedAt === null;
	}
	addMove(gameId, move) {
		const
			game = this.db().get("games").find({id: gameId}),
			moves = game.value().matches;
		moves.push(move);
		return game.assign({moves: moves}).write();
	}
	setWinner(gameId, winner) {
		return this.db().get("games").find({id: gameId}).assign({winner: winner}).write();
	}
	setLoser(gameId, loser) {
		return this.db().get("games").find({id: gameId}).assign({loser: loser}).write();
	}
	setState(gameId, state) {
		return this.db().get("games").find({id: gameId}).assign({state: state}).write();
	}
	getState(gameId) {
		return this.db().get("games").find({id: gameId}).value().state;
	}
}

module.exports = new GameRepository();
