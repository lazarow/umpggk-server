const Repository = require("./repository.js");
injector = require("./../container/injector.js");


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
    }

}

module.exports = new RoundRepository();
