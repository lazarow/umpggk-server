const	config              	= require("config"),
		db						= require("./lib/database/db.js"),
		tournamentRepository	= require("./lib/repositories/tournament-repository.js"),
		playerRepository		= require("./lib/repositories/player-repository.js"),
		roundRepository			= require("./lib/repositories/round-repository.js"),
		matchRepository			= require("./lib/repositories/match-repository.js"),
		gameRepository			= require("./lib/repositories/game-repository.js"),
		container				= require("./lib/container/container.js"),
		sockets					= require("./lib/servers/sockets.js");

// Set a round compositor
container.value('round-compositor', require("./lib/services/round-robin-compositor.js"));

sockets[1] = { remoteAddress: "1" };
sockets[2] = { remoteAddress: "2" };
sockets[3] = { remoteAddress: "3" };
sockets[4] = { remoteAddress: "4" };

db.createEmptyDatabase();
tournamentRepository.create(config.get("Tournament"));
playerRepository.register("Pikachu");
playerRepository.reconnect("Pikachu", 1);
playerRepository.register("Bulbasaur");
playerRepository.reconnect("Bulbasaur", 2);
playerRepository.register("Charmander");
playerRepository.reconnect("Charmander", 3);
playerRepository.register("Zubat");
playerRepository.reconnect("Zubat", 4);

tournamentRepository.startNextRound();
gameRepository.finish(0);
gameRepository.finish(1);
gameRepository.finish(2);
gameRepository.finish(3);
tournamentRepository.startNextRound();

console.log(JSON.stringify(db.value()));

process.exit();
