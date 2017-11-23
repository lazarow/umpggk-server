const
    config              	= require("config"),
    container           	= require('./lib/container/container.js'),
    competitionServer   	= require("./lib/servers/competition-server.js"),
    webAppServer        	= require("./lib/servers/webapp-server.js"),
	adminServer	        	= require("./lib/servers/admin-server.js"),
    db				     	= require("./lib/database/db.js"),
	tournamentRepository	= require("./lib/repositories/tournament-repository.js"),
	args					= process.argv.slice(2);

// Start servers
competitionServer.start(config.get("TournamentServer"));
webAppServer.start(config.get("WebAppServer"));
adminServer.start(config.get("AdminServer"));

// Creates an empty database
db.createEmptyDatabase();
// Creates a new tournament based on the configuration
tournamentRepository.create(config.get("Tournament"));

// Load commands protocol
container.value("Command", require("./lib/protocol/command.js"));
// Set a round compositor
container.value('RoundCompositor', require("./lib/services/round-robin-compositor.js"));
// Set a game controller
container.value('GameController', require("./lib/game-controller.js"));
