var config = require("config")
    container = require('./lib/container.js'),
    competitionServer = require("./lib/competition-server.js"),
    webAppServer = require("./lib/webapp-server.js");

container.value("codes", {
    "NPLY": '100',    // connect a new player
    "MMOV": '210'     // make a move
});
container.value("Command", require("./lib/command.js"));

competitionServer.start(config.get("CompetitionServer"));
webAppServer.start(config.get("WebAppServer"));
