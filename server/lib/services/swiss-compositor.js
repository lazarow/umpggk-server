/**
 * Created by Klinek on 16.11.2017.
 */
const   RoundCompositor			= require("./round-compositor.js"),
        playerRepository        = require("./../repositories/player-repository.js"),
        roundRepository         = require("./../repositories/round-repository.js"),
        matchRepository         = require("./../repositories/match-repository.js"),
        gameRepository          = require("./../repositories/game-repository.js"),
        tournamentRepository    = require("./../repositories/tournament-repository.js");

class SwissCompositor
{
    constructor() {
		super();
    }
    composeNextRound() {
        const   players     = playerRepository.collection().value().slice(0),
                tournament  = tournamentRepository.get().value(),
                roundsLimit = Math.ceil(Math.log2(players.length)) + tournament.additionalRounds;
        if (tournament.rounds.length >= roundsLimit) {
            return null;
        }
        
	}
}

module.exports = new SwissCompositor();
