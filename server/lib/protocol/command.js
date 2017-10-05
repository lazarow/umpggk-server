const injector = require('./../container/injector.js'),
sockets     = require("./../servers/sockets.js");

const Command = function () {};

// Register a new player
Command.prototype['100'] = function (id, name) {
    console.log(Object.keys(sockets));
    console.log("A new player command from " + id + " with name " + name);
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
