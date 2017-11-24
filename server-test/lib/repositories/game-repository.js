const	Repository				= require("./repository.js"),
		playerRepository		= require("./player-repository.js"),
		log 					= require("./../log.js")(__filename),
		injector				= require("./../container/injector.js"),
		tournamentRepository	= require("./tournament-repository.js");

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
			currentPlayer: null,
			time: null,
		    state: null,
		    moves: []
        };
		this.collection().push(game).write();
		playerRepository.addGame(whiteId, game.id);
		playerRepository.addGame(blackId, game.id);
		return game;
	}
	start(gameId) {
		const	game = this.get(gameId).value(),
				gameController = injector.get("GameController");
		log.info("The game #" + gameId + " (the match #" + game.matchId + ") has been started");
		playerRepository.setCurrentGame(game.white, game.id);
		playerRepository.setCurrentGame(game.black, game.id);
		this.get(gameId).assign(this._.assign(game, {
			currentPlayer: gameController.whoFirst(),
			startedAt: (new Date()).getTime()
		})).write();
		// Finish a game immediately if players are offline
		if (playerRepository.isOnline(game.white) === false && playerRepository.isOnline(game.black) === false) {
			this.finish(gameId, null, null);
		} else if (playerRepository.isOnline(game.white) === false) {
			playerRepository.write(game.black, "232"); // disconnect win for black
			this.finish(gameId, game.black, game.white);
		} else if (playerRepository.isOnline(game.black) === false) {
			playerRepository.write(game.white, "232"); // disconnect win for white
			this.finish(gameId, game.white, game.black);
		} else {
			playerRepository.write(game.white, "200 white " + gameController.getGameDescription());
			playerRepository.write(game.black, "200 black " + gameController.getGameDescription());
			const timeLimit = tournamentRepository.get().value().timeLimit;
			this.get(gameId).assign(this._.assign(game, {
				time: (new Date()).getTime() + timeLimit
			})).write();
		}
	}
	move(gameId, player, move) {
		const 	game 			= this.get(gameId).value(),
				gameController 	= injector.get("GameController");
		if (game.startedAt === null || game.finishedAt !== null) {
			playerRepository.write(player, "999 The game is not started or it is finished already");
			return false;
		}
		if (
			(game.white === player && game.currentPlayer === "black")
			|| (game.black === player && game.currentPlayer === "white")
		) {
			playerRepository.write(game.white === player ? game.black : game.white, "230"); // win if player makes a move not during his turn
			playerRepository.write(player, "240");
			this.finish(game.id, game.white === player ? game.black : game.white, player);
			return true;
		}
		if ((new Date()).getTime() > game.time) {
			playerRepository.write(game.white === player ? game.black : game.white, "231"); // win if player makes a move after the time limit
			playerRepository.write(player, "241");
			this.finish(game.id, game.white === player ? game.black : game.white, player);
			return true;
		}
		const state = gameController.move(game.state, game.white === player ? "white" : "black", move);
		if (state === false) { // means move is not acceptable
			playerRepository.write(game.white === player ? game.black : game.white, "230"); // win if player makes a move not during his turn
			playerRepository.write(player, "240");
			this.finish(game.id, game.white === player ? game.black : game.white, player);
			return true;
		} else {
			this.get(gameId).assign(this._.assign(game, {
				currentPlayer: game.currentPlayer === "white" ? "black" : "white",
				state: state,
			    moves: game.moves.concat(move)
			})).write();
		}
		if (gameController.isFinished(state, game.currentPlayer === "white" ? "black" : "white")) {
			playerRepository.write(player, "230"); // win if player makes a move not during his turn
			playerRepository.write(game.white === player ? game.black : game.white, "240");
			this.finish(game.id, player, game.white === player ? game.black : game.white);
			return true;
		} else {
			playerRepository.write(game.white === player ? game.black : game.white, "220 " + move.join(" "));
			this.get(gameId).assign(this._.assign(game, {
				time: (new Date()).getTime() + tournamentRepository.get().timeLimit
			})).write();
			return true;
		}
	}
	finish(gameId, winner, loser) {
		const	game 			= this.get(gameId).value(),
				startedAt 		= game.startedAt,
				finishedAt 		= (new Date()).getTime(),
				matchRepository	= require("./match-repository.js");
		log.colors("yellow").info("The game #" + gameId + " (the match #" + game.matchId + ") has been finished");
		playerRepository.setCurrentGame(game.white, null);
		playerRepository.setCurrentGame(game.black, null);
		this.get(gameId).assign(this._.assign(game, {
			winner: winner,
			loser: loser,
			finishedAt: finishedAt,
			duration: finishedAt - startedAt
		})).write();
		if (winner !== null) {
			require("./match-repository.js").addPoints(game.matchId, winner, 1);
		} else {
			require("./match-repository.js").addPoints(game.matchId, game.white, 0.5);
			require("./match-repository.js").addPoints(game.matchId, game.black, 0.5);
		}
		// Start the next game of finish the match
		require("./match-repository.js").startUncompletedGame(game.matchId);
	}
}

module.exports = new GameRepository();
