var net = require("net"),
    config = require("config"),
    injector = require("./injector.js"),
    shortid = require('shortid');

var CompetitionServer = function () {};

CompetitionServer.prototype.start = function (options) {
    this.server = net.createServer();
    this.server.listen(options.port);
    this.server.on("connection", function (socket) {
        var remote = socket.remoteAddress + ":" + socket.remotePort;
        socket.id = shortid.generate();
        console.log("A new connection: " + remote);
        // TODO: Handle a new connection
        socket.on("data", function(data) {
            const message = Buffer.isBuffer(data) ? data.toString().trim() : data.trim(),
                splitted = message.split(" ");
            console.log("The message from " + remote, message);
            if (injector.get('Command').execute.apply(splitted) !== true) {
                console.log("The provided command is unknown: " + splitted[0]);
            }
            socket.write("OK");
        });
        socket.on("close", function(data) {
            console.log("The connection is closed: " + remote);
        });
    });
    console.log("The competition server is listening on " + this.server.address().address + ":"
        + this.server.address().port);
};

module.exports = new CompetitionServer();
