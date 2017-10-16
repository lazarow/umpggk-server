const Repository = require("./Repository.js");
injector = require("./../container/injector.js");


class MatchesRepository extends Repository {

    generateId(){
        return this.db.get("matches").length + 1
    }

    addMatchToPlayer(playerName,matchId){
          this.db.get("players").find({name: playerName}).matches.push(matchId).write();
    }

    start(bluePlayerName,redPlayerName) {

        /*check if both players are "free"*/

        let matchId = this.generateId();

        this.db.get("matches").push({
            matchId: matchId,
            red: bluePlayerName,
            blue: redPlayerName,
            redPoints: 0,
            bluePoints: 0,
            isFinished: false,
            startedAt: (new Date()).getTime(),
            finishedAt: null,
            duration: null,
            games: []
        }).write();

        this.addMatchToPlayer(bluePlayerName,matchId);
        this.addMatchToPlayer(redPlayerName,matchId);

    }

}

module.exports = new MatchesRepository();
