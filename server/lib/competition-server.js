var net = require("net"),
    config = require("config"),
    injector = require("./injector.js"),
    shortid = require('shortid');

var CompetitionServer = function () {};

CompetitionServer.prototype.start = function (options) {
    this.server = net.createServer();
    this.server.listen(options.port);
    this.server.on("connection", function (socket) {
        var initiator = socket.remoteAddress + ":" + socket.remotePort;
        /*
            Add an ID to every new socket connection.
            The ID will be used to associate a socket with a player. 
        */
        socket.id = shortid.generate();
        // sockets[socket.id] = socket
        console.log(
            "The new connection has been established by the initiator " + initiator,
            "The initiator has get the ID " + socket.id
        );
        /*
            Handles received data.
        */
        socket.on("data", function(data) {
            const message = Buffer.isBuffer(data) ? data.toString().trim() : data.trim(),
                splitted = message.split(" "),
                code = splitted[0]
                options = splitted.slice(1);
            console.log("The message from " + initiator, message);
            if (injector.get('Command').execute.apply(injector.get('Command'), [code, this.id].concat(options)) !== true) {
                console.log("The provided command is unknown: " + splitted[0]);
            }
            socket.write("OK");
        });
        /*
            Handles the connection lost.
        */
        socket.on("close", function() {
            console.log("The connection is lost from the initiator" + initiator);
        });
    });
    console.log("The competition server is listening on " + this.server.address().address + ":"
        + this.server.address().port);
};

module.exports = new CompetitionServer();
