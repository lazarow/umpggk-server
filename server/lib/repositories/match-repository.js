const   Repository = require("./repository.js");
        injector = require("./../container/injector.js");
        gameRepository   = require("./../repositories/game-repository.js");


class MatchRepository extends Repository {

    *generateId(){
        let id = 0;
        while(true)
        yield id++
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

    addMatchToRound(matchId,roundId){
        this.db.get("rounds").find({roundId: roundId}).get("matches").push(matchId).write();
        this.emitChange({
            table:"rounds",
            filter:"roundId",
            value:roundId,
            get:"matches",
            action:"push",
            data:matchId
        })

    }

    start(bluePlayerName,redPlayerName, roundId) {

        /*check if both players are "free"*/

        let matchId = this.generateId().next().value;
        //let matchId = (Math.random()*100).toFixed(0);

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

        this.addMatchToRound(matchId,roundId);
        this.addMatchToPlayer(bluePlayerName,matchId);
        this.addMatchToPlayer(redPlayerName,matchId);



       for(let i = 0; i <= 30; i++){
           /*TODO*/
           if(gameRepository.start(bluePlayerName,redPlayerName,matchId)){
               let points = this.db.get("matches").find({matchId:matchId}).get("redPoints").value();
               this.db.get("matches").find({matchId:matchId}).assign({
                   redPoints: points+1
               }).write();
           } else {
               let points = this.db.get("matches").find({matchId:matchId}).get("bluePoints").value();
               this.db.get("matches").find({matchId:matchId}).assign({
                   bluePoints: points+1
               }).write();
           }
       }

    }

}

module.exports = new MatchRepository();
