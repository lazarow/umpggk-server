const	config              	= require("config"),
		db						= require("./lib/database/db.js"),
		tournamentRepository	= require("./lib/repositories/tournament-repository.js"),
		playerRepository		= require("./lib/repositories/player-repository.js"),
		roundRepository			= require("./lib/repositories/round-repository.js"),
		matchRepository			= require("./lib/repositories/match-repository.js"),
		gameRepository			= require("./lib/repositories/game-repository.js"),
		container				= require("./lib/container/container.js");

// Set a round compositor
container.value('round-compositor', require("./lib/services/round-robin-compositor.js"));

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
playerRepository.register("Mew");
playerRepository.reconnect("Mew", 5);

tournamentRepository.startNextRound();

//console.log(JSON.stringify(db.value()));
console.log(db.value().matches);

process.exit();
