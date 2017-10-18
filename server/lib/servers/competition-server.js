const
    net                 = require("net"),
    config              = require("config"),
    shortid             = require('shortid'),
    injector            = require("./../container/injector.js"),
    sockets             = require("./sockets.js"),
    playersRepository   = require("./../repositories/players-repository.js");

const CompetitionServer = function () {};

CompetitionServer.prototype.start = function (options) {
    this.server = net.createServer();
    this.server.listen(options.port);
    this.server.on("connection", function (socket) {
        /*
            Add an ID to every new socket connection.
            The ID will be used to associate a socket with a player.
        */
        socket.id = shortid.generate();
        const initiator = socket.id + "@" + socket.remoteAddress + ":" + socket.remotePort;
        sockets[socket.id] = socket;
        console.log("The new connection has been established by the initiator " + initiator);
        /*
            Handles received data.
        */
        socket.on("data", function(data) {
            const message = Buffer.isBuffer(data) ? data.toString().trim() : data.trim(),
                splitted = message.split(" "),
                code = splitted[0],
                options = splitted.slice(1);
            console.log("The message from the " + initiator + ": " + message);
            if (injector.get('Command').execute.apply(injector.get('Command'), [code, this.id].concat(options)) !== true) {
                socket.write("999 The transmitted command is unknown");
                console.log("The transmitted by " + initiator  + " command " + code + " is unknown");
            }


             setInterval(function () {
             let currentDate = new Date();
             let filename = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate()
             + "-" + currentDate.getHours() + currentDate.getMinutes() + currentDate.getSeconds() + "-"
             + currentDate.getMilliseconds();
             injector.get('Command').execute.apply(injector.get('Command'), [100, shortid.generate(), filename])
             },1000)
        });
        /*
            Handles the connection lost.
        */
        socket.on("close", function() {
            playersRepository.disconnect(this.id);
            delete sockets[this.id];
            console.log("The connection is lost from the initiator " + initiator);
        });
    });
    console.log("The competition server is listening on " + this.server.address().address + ":"
        + this.server.address().port);
};

module.exports = new CompetitionServer();
