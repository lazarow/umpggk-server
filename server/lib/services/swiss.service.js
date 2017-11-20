/**
 * Created by Klinek on 16.11.2017.
 */


const
    playerRepository        = require("./../repositories/player-repository.js"),
    roundRepository         = require("./../repositories/round-repository.js"),
    matchRepository         = require("./../repositories/match-repository.js"),
    gameRepository          = require("./../repositories/game-repository.js"),
    tournamentRepository    = require("./../repositories/tournament-repository.js");

class SwissService
{
    constructor() {
        this.precomposedRounds = null;
    }

    let
        matches = [],
        players = [],

    randomPairs(players){
        let pairs;
        let popped = null;
        if(players.length() % 2 !== 0){
            popped = players.pop();
        }
        pairs = players.map(function(player,index,players){
            if(index % 2 === 1){
                return [player, players[index-1]];
            }
        });
        if(popped){
            pairs.push([popped])
        }
        return pairs;
    }

    preparePairs(){

    }
    checkPair(playerName,oponnentName){

        let opponents = playerRepository.db.get('players').find({name:playerName}).get('opponents').value();


    }

    composeNextRound() {

        if(tournamentRepository.hasUnfinishedRounds()){
            return;
        }

        this.preparePairs();

    }
}

module.exports = new SwissService();
