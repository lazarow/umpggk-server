var injector = require('./injector.js')

var Command = function () {};

Command.prototype[injector.get('codes').NPLY] = function () {
    console.log("A new player command");
    return true;
};
Command.prototype[injector.get('codes').MMOV] = function () {
    console.log("Make a move command");
    return true;
};

Command.prototype.execute = function (code) {
    return this[code] && this[code].apply(this, [].slice.call(arguments, 1));
};

module.exports = new Command();
