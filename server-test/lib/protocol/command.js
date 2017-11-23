const
    injector            	= require('./../container/injector.js'),
	tournamentRepository	= require("./../repositories/tournament-repository.js"),
    playerRepository    	= require("./../repositories/player-repository.js"),
    gameRepository         = require("./../repositories/game-repository.js"),
	socketService			= require("./../services/socket-service.js"),
    log                 	= require("./../log.js")(__filename);

const Command = function () {};

Command.prototype.execute = function (code) {
    if (this[code] === undefined) {
        return undefined;
    }
    return this[code].apply(this, [].slice.call(arguments, 1));
};

// Register a new player
Command.prototype['100'] = function (socketId, name) {
    if (playerRepository.isRegistered(name)) {
        playerRepository.reconnect(name, socketId);
        log.info("The player " + name + " (" + socketId + ") has been reconnected");
    } else {
		if (tournamentRepository.isRegistrationOpen()) {
			if (/\s/g.test(name)) {
				socketService.write(socketId, "999 The player's name cannot contain whitespaces");
                return false;
			} else {
        		playerRepository.register(name);
        		playerRepository.reconnect(name, socketId);
        		log.info("A new player " + name + " (" + socketId + ") has been registered");
			}
		} else {
			socketService.write(socketId, "999 The registration is closed");
            return false;
		}
    }
    return true;
};

// Move
Command.prototype['210'] = function (socketId) {
    const   move    = Array.prototype.slice.call(arguments, 1),
            player  = playerRepository.getBySocketId(socketid),
            game    = gameRepository.get(player.value().currentGame);
	return game === undefined ? false : gameRepository.move(game.id, player, move);
};

module.exports = new Command();
