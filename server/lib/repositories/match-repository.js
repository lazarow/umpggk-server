const Repository = require("./repository.js");
injector = require("./../container/injector.js");


class MatchRepository extends Repository {

    generateId(){
        return this.db.get("matches").size();
    }

    addMatchToPlayer(playerName,matchId){
          this.db.get("players").find({name: playerName}).get("matches").push(matchId).write();
          this.emitChange({
              table:"players",
              filter:"name",
              value: playerName,
              get: "matches",
              action: "push",
              data: matchId
          })
    }

    start(bluePlayerName,redPlayerName) {

        /*check if both players are "free"*/

        let matchId = this.generateId();

        let matchObject = {
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
        };

        this.db.get("matches").push(matchObject).write();

        this.emitChange({
            table:"matches",
            action: "push",
            data: matchObject
        });

        this.addMatchToPlayer(bluePlayerName,matchId);
        this.addMatchToPlayer(redPlayerName,matchId);

    }

}

module.exports = new MatchRepository();
