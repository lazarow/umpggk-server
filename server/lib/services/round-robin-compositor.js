const	RoundCompositor			= require("./round-compositor.js"),
    	playerRepository        = require("./../repositories/player-repository.js"),
    	roundRepository         = require("./../repositories/round-repository.js"),
    	matchRepository         = require("./../repositories/match-repository.js"),
    	gameRepository          = require("./../repositories/game-repository.js"),
    	tournamentRepository    = require("./../repositories/tournament-repository.js");

class RoundRobinCompositor extends RoundCompositor
{
    constructor() {
		super();
    	this.precomposedRounds = null;
    }
    precomposeRounds() {
        if (this.precomposedRounds !== null) {
            return;
        }
        let
            upper           = [],
            lower           = [],
            fixed           = 0,
            rotatedOut      = 1,
            participants    = playerRepository.getAllPlayersNames(),
            n               = participants.length,
            games           = [],
            players         = [],
            roundGames      = [],
            _               = playerRepository.db()._;
        function rotateForRoundRobin() {
            upper.unshift(rotatedOut);
            lower.push(upper.pop());
            rotatedOut = lower.shift();
        }
        // Gather all games
		if (n < 2) {
		} else if (n === 2) {
            games.push([participants[0], participants[1]]);
        } else {
            if (n % 2 !== 0) {
                n++;
                upper = _.range(2, n / 2 + 1);
                lower = _.range(n - 1, n / 2);
                lower[0] = -1;
            } else {
                upper = _.range(2, n / 2 + 1);
                lower = _.range(n - 1, n / 2);
            }
            for (let r = 0; r < n - 1; ++r) {
                if (rotatedOut != -1) {
                    games.push([participants[fixed], participants[rotatedOut]]);
                }
                for (let  i = 0, count = upper.length; i < count; ++i) {
                    if (upper[i] != -1 && lower[i] != -1) {
                        games.push([participants[upper[i]], participants[lower[i]]]);
                    }
                }
                rotateForRoundRobin();
            }
        }
        // Compose rounds
        this.precomposedRounds = [];
        for (let idx in games) {
			const game = games[idx];
            if (players.indexOf(game[0]) !== -1 || players.indexOf(game[1]) !== -1) {
                this.precomposedRounds.push(roundGames.slice(0));
                roundGames = [];
				players = [];
            }
            roundGames.push(game.slice(0));
            players.push(game[0]);
            players.push(game[1]);
        }
        if (roundGames.length > 0) {
            this.precomposedRounds.push(roundGames.slice(0));
        }
    }
    composeNextRound() {
        this.precomposeRounds();
        if (this.precomposedRounds.length === 0) {
            return null;
        }
        let	round   = roundRepository.create(),
			matches = this.precomposedRounds[round.id];
		if (matches === undefined) {
			return null;
		}
		for (let idx in matches) {
			let	pairing = matches[idx],
				match	= matchRepository.create(round.id, pairing[0], pairing[1]),
				total	= tournamentRepository.get().value().gamesLimit,
				middle	= Math.ceil(total / 2);
			for (let i = 0; i < total; ++i) {
				let game;
				if (i < middle) {
					game = gameRepository.create(match.id, pairing[0], pairing[1]);
				} else {
					game = gameRepository.create(match.id, pairing[1], pairing[0]);
				}
				matchRepository.addGame(match.id, game.id);
			}
			roundRepository.addMatch(round.id, match.id);
		}
		return round;
    }
}

module.exports = new RoundRobinCompositor();
