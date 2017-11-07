const
    Repository = require("./repository.js");
        injector = require("./../container/injector.js");
        matchRepository = require("./match-repository");


class RoundRepository extends Repository {

    generateId(){
        return this.db.get("rounds").size();
    }

    addRoundToTournament(roundId){
        this.db.get("tournament").get("rounds").push(roundId).write();
    }

    start() {
        let roundId = this.generateId();
        this.addRoundToTournament(roundId);



        let roundObject = {
            roundId:roundId,
            startedAt: (new Date()).getTime(),
            finishedAt: null,
            duration: null,
            matches: []
        };

        this.db.get("rounds").push(roundObject).write();
        this.emitChange({
            table: "rounds",
            action: "push",
            data: roundObject
        });

        this.db.get("players").map(player => player.name).chunk(2).map(function(pairArray){
            if(pairArray.length === 2){
                matchRepository.start(pairArray[0],pairArray[1],roundId);
            }
        }).value();

    }

}

module.exports = new RoundRepository();
