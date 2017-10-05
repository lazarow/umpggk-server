const
    config              = require("config"),
    container           = require('./lib/container/container.js'),
    competitionServer   = require("./lib/servers/competition-server.js"),
    webAppServer        = require("./lib/servers/webapp-server.js"),
    databaseService     = require("./lib/db/database-service.js");

// Load commands protocol
container.value("Command", require("./lib/protocol/command.js"));

// Start servers
competitionServer.start(config.get("CompetitionServer"));
webAppServer.start(config.get("WebAppServer"));

// Creating a database connector
databaseService.createConnector();
databaseService.createEmptyDatabase();

// TODO: Tworzenie turnieju, koniecznie po uruchomieniu WebApp
