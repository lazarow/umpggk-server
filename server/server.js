const
    config              	= require("config"),
    container           	= require('./lib/container/container.js'),
    competitionServer   	= require("./lib/servers/competition-server.js"),
    webAppServer        	= require("./lib/servers/webapp-server.js"),
	adminServer        		= require("./lib/servers/admin-server.js"),
    databaseService     	= require("./lib/db/database-service.js"),
	tournamentRepository	= require("./lib/repositories/tournament-repository.js"),
	args					= process.argv.slice(2);

// Load commands protocol
container.value("Command", require("./lib/protocol/command.js"));

// Start servers
competitionServer.start(config.get("TournamentServer"));
webAppServer.start(config.get("WebAppServer"));
adminServer.start(config.get("AdminServer"));

// Creating a database connector (the previous data can be loaded)
if (typeof args[0] !== "undefined") {
	databaseService.createConnector(args[0]);
	databaseService.reloadCurrentDatabase();
} else {
	databaseService.createConnector(databaseService.createFilepath());
	databaseService.createEmptyDatabase();
	// Creates a new tournament based on the configuration
	tournamentRepository.create(config.get("Tournament"));
}
