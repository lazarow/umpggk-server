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

    /*
    MKL
    players interface
    * type: array
    * player interface
    * type: object
    * {
    *   name: string,
    *   points: number
    * }
    * */
    /*TODO check uneven players number*/

    getPlayers(){
        return playerRepository.getNames();
    }

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
            return null;

        }).filter(function (o) {
            return o !== null;
        });
        if(popped){
            pairs.push([popped])
        }
        return pairs;
    }

    findStrongestOpponent(player,players){
            return _(players)
                .filter(function(o){
                    /*TODO check if played */
                    return !playerRepository.playedWith(player.name,o.name);
                })
                .sort(['points','name'])
                .head()
               /* .value()*/
    };

    findWeakestPlayerForFreeGame(players){

        return _(players)
            .sort(['points','name'])
            .reduce(function(weakest,current){

                if(!current){
                    return weakest
                }
                 else if(current.points < weakest.points && !playerRepository.hadFreeGame(current.name)){
                    return weakest
                }
                    return current

            },false)

    }

    monradPairs(players){
        let pairs = [];
        let freeGamePlayer;

        if(players.length % 2 !== 0){
            freeGamePlayer = this.findWeakestPlayerForFreeGame()
        }

        players.splice(_.findIndex(players,{'name':freeGamePlayer.name}),1);


        while(players.length > 1){

            let playerOne = players.shift();

            let playerTwo = this.findStrongestOpponent(player,players);

            players.splice(_.findIndex(players,{'name':playerTwo.name}),1);

            pairs.push([playerOne.name,playerTwo.name])

        }

        /*TODO how to pass free game player?*/
        if(freeGamePlayer){
            pairs.push([freeGamePlayer.name,{}]);
        }

        return pairs;
    }

    prepareRound(){

        let pairs;
        let players = this.getPlayers();

        if(tournamentRepository.hasRound()){
            pairs = this.monradPairs(players);
        } else {
            pairs = this.randomPairs(players);
        }

        let
            round   = roundRepository.create(),
            roundId = round.id;

        pairs.forEach(function(pair){

            let
                match	= matchRepository.create(pair[0], pair[1]),
                matchId	= match.id;
            total	= tournamentRepository.getNumberOfGamesInSingleMatch,
                middle	= Math.floor(total / 2);
            for (let i = 0; i < total; ++i) {
                let game;
                if (i <= middle) {
                    gameRepository.create(pair[0], pair[1]);
                } else {
                    gameRepository.create(pair[1], pair[0]);
                }
                matchRepository.addGame(matchId, game.id);
            }
            roundRepository.addMatch(roundId, match.id);

        });
        tournamentRepository.addRound(roundId);

    }
}

module.exports = new SwissService();
