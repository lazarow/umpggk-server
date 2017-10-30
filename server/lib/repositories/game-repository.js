const Repository = require("./repository.js");
injector = require("./../container/injector.js");


class GameRepository extends Repository {


    generateId(){
        return this.db.get("games").size();
    }

    addGameToPlayer(playerName,gameId){
        this.db.get("players").find({name: playerName}).get("games").push(gameId).write();
        this.emitChange({
            table: "players",
            filter: "name",
            value: playerName,
            action: "push",
            get: "games",
            data: gameId
        });
    }

    addGameToMatch(matchId,gameId){
        this.db.get("matches").find({matchId:matchId}).get("games").push(gameId).write();
        this.emitChange({
            table: "matches",
            filter: "matchId",
            value: matchId,
            action: "push",
            get: "games",
            data: gameId
        })
    }

    start(whiteName, blackName, matchId){

        let gameId = this.generateId();

        let gameObject = {
            gameId: gameId,
            white: whiteName,
            black: blackName,
            winner: null,
            loser: null,
            isFinished: false,
            startedAt: Date.now(),
            finishedAt: null,
            duration: null,
            state: "started",
            moves: []
        };

        this.db.get("games").push(gameObject).write();
        this.emitChange({
            table: "games",
            action: "push",
            data: gameObject
        });

        /*add game to match games array*/
        this.addGameToMatch(matchId,gameId);

        /*add game to games players array*/
        this.addGameToPlayer(blackName,gameId);
        this.addGameToPlayer(whiteName,gameId);
    };

    winningMove(){
        /*logic for winning move TODO*/
        console.log('randomWinner');
        return Math.random() > 0.2;
    }

    move(playerName,move){

        /*find last game from player by socketId
        * consider moving method to player-repo ?
        * */

        let gameId = this.db.get("players").find({name: playerName}).get("games").last().value();



        /*check if game is ongoing TODO*/
        this.db.get("games").find({gameId:gameId}).get("moves").push(move);

        this.emitChange({
            table: "games",
            filter: "gameId",
            value: gameId,
            get: "moves",
            action: "push",
            data: move

        });

        if(this.winningMove()){
            let gameChange = {
                winner: playerName,
                finishedAt: Date.now(),
                state: "finished",
                isFinished: true,
            };

            this.db.get("games").find({gameId:gameId}).assign(gameChange).write();
            this.emitChange({
                table: "games",
                filter: "gameId",
                value: gameId,
                action: "assign",
                data: gameChange,
            })


        }



    }

}

module.exports = new GameRepository();
