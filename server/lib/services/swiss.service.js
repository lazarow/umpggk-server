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
            _(players).filter(function (o) {
                return o.name !== player.name
            })
                .filter(function (o) {
                    return o.pair === null;
                })
                .filter(function(o){
                    /*TODO check if played */
                    return !playerRepository.playedWith(player.name,o.name);
                })
                .sort(['points','name'])
                .shift()
    };

    swissPairs(players){
        let pairs;

        /*TODO check if popped player had free game*/
        let popped;
        if(players.length() % 2 !== 0){
            popped = players.pop();
        }

        pairs = _(players)
            .sort(['points','name'])
            .map(function(player){
                player.pair = null;
            })
            .map(function(player,index,players){
                if(player.pair){
                    return player;
                } else {
                    let opponent = _(players).find({'pair': player.name});
                    if(opponent){
                        player.pair = opponent.name;
                    } else {
                        opponent = this.findStrongestOpponent(player,players);
                        player.pair = opponent.name;
                    }
                    opponent = null;
                    return player;
                }
            })
            .map(function(player,index,players){
                return [player, players[_(players).findIndex({'pair': player.pair})]];
            })
            .filter(function(o){
                return o !== null;
            })
    }
}

module.exports = new SwissService();
