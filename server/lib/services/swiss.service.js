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

        /*TODO hot to pass free game player?*/
        if(freeGamePlayer){
            pairs.push([freeGamePlayer.name,{}]);
        }

        return pairs;

    }
}

module.exports = new SwissService();
