const	net                 = require("net"),
    	config              = require("config"),
    	shortid             = require("shortid"),
    	injector            = require("./../container/injector.js"),
    	sockets             = require("./sockets.js"),
		playerRepository	= require("./../repositories/player-repository.js"),
		log 				= require("./../log.js")(__filename);

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
        const initiator = socket.remoteAddress;
        sockets[socket.id] = socket;
        log.info("The new connection has been established by the initiator " + initiator);
        /*
            Handles received data.
        */
        socket.on("data", function(data) {
            const message = Buffer.isBuffer(data) ? data.toString().trim() : data.trim(),
                splitted = message.split(" "),
                code = splitted[0],
                options = splitted.slice(1);
            log.info("The message from the " + initiator + ": " + message);
            let result = injector.get('Command').execute.apply(injector.get('Command'), [code, this.id].concat(options));
            if (result === undefined) {
                socket.write("999 The transmitted command is unknown or incorrect\n");
                log.warning(initiator + " has transmitted the following command " + code + " that is unknown");
            } else if (result) {
            }
        });
        /*
            Handles the connection lost.
        */
        socket.on("close", function() {
            playerRepository.disconnect(this.id);
            delete sockets[this.id];
            log.warning("The connection is lost from the initiator " + initiator);
        });
		socket.on("error", function() {
		    playerRepository.disconnect(this.id);
            delete sockets[this.id];
            log.warning("The connection is (abruptly) lost from the initiator " + initiator);
	  	});
    });
    log.colors("magenta").info("The competition server is listening on the address: " + this.server.address().address
		+ " and the port: " + this.server.address().port);
};

module.exports = new CompetitionServer();
