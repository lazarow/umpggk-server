var config = require("config");
var competitionServer = require("./lib/competition-server.js");
var webAppServer = require("./lib/webapp-server.js");

competitionServer.start(config.get("CompetitionServer.port"));
webAppServer.start(config.get("WebAppServer.port"));
