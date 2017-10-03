var config = require("config"),
    competitionServer = require("./lib/competition-server.js"),
    webAppServer = require("./lib/webapp-server.js");

competitionServer.start(config.get("CompetitionServer"));
webAppServer.start(config.get("WebAppServer"));
