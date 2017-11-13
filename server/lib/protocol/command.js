const
    injector            = require('./../container/injector.js'),
    playerRepository    = require("./../repositories/player-repository.js"),
    log                 = require("./../log.js")(__filename);

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
        playerRepository.register(name);
        playerRepository.reconnect(name, socketId);
        log.info("A new player " + name + " (" + socketId + ") has been registered");
    }
    return true;
};

module.exports = new Command();
