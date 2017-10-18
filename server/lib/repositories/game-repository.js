const Repository = require("./Repository.js");
injector = require("./../container/injector.js");


class GameRepository extends Repository {


    generateId(){
        return this.db.get("games").size();
    }

    addGameToPlayer(playerName,matchId){
        this.db.get("players").find({name: playerName}).get("matches").push(matchId).write();
    }
    addGameToMatch(matchId,gameId){
        return this.db.get("matches").find({matchId:matchId}).get("games").push(gameId).write();
    }

    start(whiteId, blackId){

        let gameId = this.generateId();

        this.db.get("games").push({
            gameId: gameId,
            white: whiteId,
            black: blackId,
            winner: null,
            loser: null,
            isFinished: false,
            startedAt: Date.now(),
            finishedAt: null,
            duration: null,
            state: null,
            moves: []
        }).write();

        /*add to match*/
        /*add to player*/
    }

}

module.exports = new GameRepository();
