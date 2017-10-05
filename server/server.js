const config = require("config")
    container = require('./lib/container.js'),
    competitionServer = require("./lib/competition-server.js"),
    webAppServer = require("./lib/webapp-server.js"),
    low = require('lowdb')
    DbAdapter = require('./lib/db-adapter.js');

container.value("codes", {
    "NPLY": '100',    // connect a new player
    "MMOV": '210'     // make a move
});
container.value("Command", require("./lib/command.js"));

competitionServer.start(config.get("CompetitionServer"));
webAppServer.start(config.get("WebAppServer"));

// Creating a database connector
const adapter = new DbAdapter('./db.json'); // TODO: Generacja nazwy
const db = low(adapter)
db.defaults({
    tournament: {},
    players: [],
    rounds: [],
    matches: [],
    games: []
}).write();
container.value("db", db);

// TODO: Tworzenie turnieju, koniecznie po uruchomieniu WebApp
