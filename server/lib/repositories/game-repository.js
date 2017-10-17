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

    start(){
        this.db.get("games").push({
            white: null,        // Identyfikator pierwszego gracza int
            black: null,        // Identyfikator drugiego gracza int
            winner: null,       // Identyfikator zwyciescy int
            loser: null,        // Identyfikator przegranego int
            isFinished: false,  // Czy gra jest zakończona? true|false
            startedAt: null,    // Czas rozpoczecia gry unixtimestamp
            finishedAt: null,   // Czas skończenia gry unixtimestamp
            duration: null,     // Sumaryczny czas gry
            state: null,        // Obecny stan gry (np. plansza) object
            moves: []           // Lista wykonanych w grze ruchow int[]
        }).write();
    }

}

module.exports = new GameRepository();
