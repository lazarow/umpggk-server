const	Repository				= require("./repository.js"),
		playerRepository		= require("./player-repository.js"),
		log 					= require("./../log.js")(__filename),
		injector				= require("./../container/injector.js"),
		config              	= require("config");

class GameRepository extends Repository
{
	constructor() {
		super("games");
		this.timeChecker = null;
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
			wonBy: null,
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
		// Players' flags
		playerRepository.onTheMove(game[gameController.whoFirst()], true);
		playerRepository.setCurrentGame(game.white, game.id);
		playerRepository.setCurrentGame(game.black, game.id);
		// Game's statistics
		this.get(gameId).assign(this._.assign(game, {
			currentPlayer: gameController.whoFirst(),
			state: gameController.getInitialState(),
			startedAt: (new Date()).getTime()
		})).write();
		// Finish a game immediately if players are offline
		if (playerRepository.isOnline(game.white) === false && playerRepository.isOnline(game.black) === false) {
			this.finish(gameId, null, null, "Brak połączenia");
		} else if (playerRepository.isOnline(game.white) === false) {
			playerRepository.write(game.black, "232", "Brak połączenia"); // disconnect win for black
			this.finish(gameId, game.black, game.white);
		} else if (playerRepository.isOnline(game.black) === false) {
			playerRepository.write(game.white, "232", "Brak połączenia"); // disconnect win for white
			this.finish(gameId, game.white, game.black);
		} else {
			// Real game start
			playerRepository.write(game.white, "200 white " + gameController.getGameDescription());
			playerRepository.write(game.black, "200 black " + gameController.getGameDescription());
			this.get(gameId).assign(this._.assign(game, {
				time: (new Date()).getTime() + config.get("Tournament").timeLimit
			})).write();
		}
	}
	move(gameId, player, move) {
		const 	game 			= this.get(gameId).value(),
				gameController 	= injector.get("GameController"),
				currentPlayer	= game.currentPlayer;
		// Checks game's statistics
		if (game.startedAt === null || game.finishedAt !== null) {
			playerRepository.write(player, "999 The game is not started or it is finished already");
			return false;
		}
		// Chacks players' turns
		if (
			(game.white === player && currentPlayer === "black")
			|| (game.black === player && currentPlayer === "white")
		) {
			playerRepository.write(game.white === player ? game.black : game.white, "230"); // win if player makes a move not during his turn
			playerRepository.write(player, "240");
			this.finish(game.id, game.white === player ? game.black : game.white, player, "Wykonanie niedozwolonego ruchu");
			return true;
		}
		// Checks time limit
		if ((new Date()).getTime() > game.time) {
			playerRepository.write(game.white === player ? game.black : game.white, "231"); // win if player makes a move after the time limit
			playerRepository.write(player, "241");
			this.finish(game.id, game.white === player ? game.black : game.white, player, "Przekroczenie czasu");
			return true;
		}
		// Checks a move
		const state = gameController.move(game.state, game.white === player ? "white" : "black", move);
		if (state === false) { // means move is not acceptable
			playerRepository.write(game.white === player ? game.black : game.white, "230"); // win if player makes a move not during his turn
			playerRepository.write(player, "240");
			this.finish(game.id, game.white === player ? game.black : game.white, player, "Wykonanie niedozwolonego ruchu");
			return true;
		} else {
			// Move is OK, play it
			playerRepository.onTheMove(game[currentPlayer], false);
			playerRepository.onTheMove(game[currentPlayer === "white" ? "black" : "white"], true);
			this.get(gameId).assign(this._.assign(game, {
				currentPlayer: currentPlayer === "white" ? "black" : "white",
				state: state,
			    moves: game.moves.concat([move])
			})).write();
		}
		// Checks if game's finished
		if (gameController.isFinished(state, currentPlayer === "white" ? "black" : "white")) {
			playerRepository.write(player, "230"); // win
			playerRepository.write(game.white === player ? game.black : game.white, "240");
			this.finish(game.id, player, game.white === player ? game.black : game.white, "Wygrana zgodnie z zasadami gry");
			return true;
		} else {
			// or wait for teh next move
			playerRepository.write(game.white === player ? game.black : game.white, "220 " + move.join(" "));
			this.get(gameId).assign(this._.assign(game, {
				time: (new Date()).getTime() + config.get("Tournament").timeLimit
			})).write();
			return true;
		}
	}
	// Called when a player is disconnected
	disconnect(gameId, player) {
		playerRepository.write(game.white === player ? game.black : game.white, "232");
		this.finish(game.id, game.white === player ? game.black : game.white, player, "Rozłączenie się zawodnika");
	}
	finish(gameId, winner, loser, wonBy = "") {
		const	game 			= this.get(gameId).value(),
				startedAt 		= game.startedAt,
				finishedAt 		= (new Date()).getTime(),
				matchRepository	= require("./match-repository.js");
		log.colors("yellow").info("The game #" + gameId + " (the match #" + game.matchId + ") has been finished");
		playerRepository.onTheMove(game.white, false);
		playerRepository.onTheMove(game.black, false);
		playerRepository.setCurrentGame(game.white, null);
		playerRepository.setCurrentGame(game.black, null);
		if (winner !== null) {
			require("./match-repository.js").addPoints(game.matchId, winner, 1);
		} else {
			require("./match-repository.js").addPoints(game.matchId, game.white, 0.5);
			require("./match-repository.js").addPoints(game.matchId, game.black, 0.5);
		}
		this.get(gameId).assign(this._.assign(game, {
			winner: winner,
			loser: loser,
			wonBy: wonBy,
			finishedAt: finishedAt,
			duration: finishedAt - startedAt
		})).write();
		// Start the next game of finish the match
		setTimeout(function () {
			require("./match-repository.js").startUncompletedGame(game.matchId);
		}, 25);
	}
	startTimeChecker() {
		if (this.timeChecker !== null) {
			return;
		}
		const $this = this;
		this.timeChecker = setInterval(function () {
			let checked = 0;
			$this.collection().value().forEach(function (game) {
				const currentPlayer = game.currentPlayer;
				if (game.finishedAt === null && game.startedAt !== null) {
					if ((new Date()).getTime() > game.time) {
						playerRepository.write(game[currentPlayer === "white" ? "black" : "white"], "231");
						playerRepository.write(game[currentPlayer], "241");
						this.finish(
							game.id,
							game[currentPlayer === "white" ? "black" : "white"],
							game[currentPlayer],
							"Przekroczenie czasu"
						);
					}
					checked++;
				}
			}, $this);
			log.debug("Checking time limits for ongoing games (" + checked + ")");
		}, 2000);
	}
}

module.exports = new GameRepository();
