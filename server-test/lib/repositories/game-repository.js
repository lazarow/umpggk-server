const	Repository			= require("./repository.js"),
		playerRepository	= require("./player-repository.js"),
		log 				= require("./../log.js")(__filename);

class GameRepository extends Repository
{
	constructor() {
		super("games")
	}
	get(gameId) {
		return this.collection().find({ id: gameId });
	}
	create(matchId, whiteId, blackId) {
		const game = {
			// Ids
			id: this.idGenerator.next().value,
			matchId: matchId,
			white: whiteId,
		    black: blackId,
			// Statistics
		    winner: null,
		    loser: null,
		    startedAt: null,
		    finishedAt: null,
		    duration: null,
			// Game state and history
		    state: null,
		    moves: []
        };
		this.collection().push(game).write();
		playerRepository.addGame(whiteId, game.id);
		playerRepository.addGame(blackId, game.id);
		return game;
	}
	start(gameId) {
		const game = this.get(gameId).value();
		log.info("The game #" + gameId + " (the match #" + game.matchId + ") has been started");
		playerRepository.setCurrentGame(game.white, game.id);
		playerRepository.setCurrentGame(game.black, game.id);
		this.get(gameId).assign(this._.assign(game, {
			startedAt: (new Date()).getTime()
		})).write();
	}
	finish(gameId) {
		const game = this.get(gameId).value(), startedAt = game.startedAt, finishedAt = (new Date()).getTime();
		log.colors("yellow").info("The game #" + gameId + " (the match #" + game.matchId + ") has been finished");
		this.get(gameId).assign(this._.assign(game, {
			finishedAt: finishedAt,
			duration: finishedAt - startedAt
		})).write();
		// Start the next game of finish the match
		require("./match-repository.js").startUncompletedGame(game.matchId);
	}
}

module.exports = new GameRepository();
