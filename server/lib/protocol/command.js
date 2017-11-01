const
    injector            = require('./../container/injector.js'),
    playersRepository   = require("./../repositories/players-repository.js");
    matchesRepository   = require("./../repositories/match-repository.js");
    gameRepository   = require("./../repositories/game-repository.js");
    roundRepository   = require("./../repositories/round-repository");


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
Command.prototype['200'] = function (sockedId,move) {

    let playerName = playersRepository.getName(sockedId);

    let latestGame = playersRepository.latestGame(playerName);

    //console.log(latestGame);

    console.log(latestGame.isFinished);

    /*check if in game*/
    if(!latestGame){
        console.log("Player have no game");
        return false;
    }

    /*check if players turn*/

    /*make a move*/

    /*send response to sender*/

    /*send move to opponent*/

    gameRepository.move(playerName,move);

    return true;
};

Command.prototype['500'] = function(socketId,playerOne,playerTwo) {
    gameRepository.start(playerOne,playerTwo,1);

    return true;
};

Command.prototype['600'] = function(sockedId, nameOne, nameTwo) {

    if(playersRepository.isRegistered(nameOne) && playersRepository.isRegistered(nameTwo)){

        matchesRepository.start(nameOne,nameTwo);

        console.log("A new match between " + nameOne + " and " + nameTwo +" has been started");
    }

    /*
    gameRepository.start('ola','marek',1);
    gameRepository.move(sockedId,1);
    */

    return true;
};

/*admin commands*/

Command.prototype['300'] = function(socketId){

    roundRepository.start();
    return true;

};

Command.prototype.execute = function (code) {
    return this[code] && this[code].apply(this, [].slice.call(arguments, 1));
};

module.exports = new Command();
