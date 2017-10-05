const
    injector            = require('./../container/injector.js'),
    playersRepository   = require("./../repositories/players-repository.js");

const Command = function () {};

// Register a new player
Command.prototype['100'] = function (socketId, name) {
    if (playersRepository.isRegistered(name)) {
        playersRepository.reconnect(name, socketId);
        console.log("A new player " + name + " (" + socketId + ") has been reconnected");
    } else {
        playersRepository.register(name, socketId);
        console.log("A new player " + name + " (" + socketId + ") has been registered");
    }
    return true;
};

// Make a move
Command.prototype['200'] = function () {
    return false;
};

Command.prototype.execute = function (code) {
    return this[code] && this[code].apply(this, [].slice.call(arguments, 1));
};

module.exports = new Command();
