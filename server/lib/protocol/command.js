const
    injector            	= require('./../container/injector.js'),
	tournamentRepository	= require("./../repositories/tournament-repository.js"),
    playerRepository    	= require("./../repositories/player-repository.js"),
	socketsService			= require("./../servers/sockets-service.js"),
    log                 	= require("./../log.js")(__filename);

const Command = function () {};

Command.prototype.execute = function (code) {
    return this[code] && this[code].apply(this, [].slice.call(arguments, 1));
};

// Register a new player
Command.prototype['100'] = function (socketId, name) {
    if (playerRepository.isRegistered(name)) {
        playerRepository.reconnect(name, socketId);
        log.info("The player " + name + " (" + socketId + ") has been reconnected");
    } else {
		if (tournamentRepository.isRegistrationOpen()) {
			if (/\s/g.test(name)) {
				socketsService.send(socketId, "999 The player's name cannot contain whitespaces");
			} else {
        		playerRepository.register(name);
        		playerRepository.reconnect(name, socketId);
        		log.info("A new player " + name + " (" + socketId + ") has been registered");
			}
		} else {
			socketsService.send(socketId, "999 The registration is closed");
		}
    }
    return true;
};

module.exports = new Command();
