var injector = require('./injector.js')

var Command = function () {};

Command.prototype[injector.get('codes').NPLY] = function (id, name) {
    let players = [];
    players.forEach(player => {
        if (player.name === name) {
            
            player.connected = true;
            player.id = id;
        }
    });

    console.log("A new player command from " + id + " with name " + name);
    return true;
};

Command.prototype.execute = function (code) {
    return this[code] && this[code].apply(this, [].slice.call(arguments, 1));
};

module.exports = new Command();
