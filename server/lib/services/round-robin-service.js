const
    playerRepository        = require("./../repositories/player-repository.js"),
    roundRepository         = require("./../repositories/round-repository.js"),
    matchRepository         = require("./../repositories/match-repository.js"),
    gameRepository          = require("./../repositories/game-repository.js"),
    tournamentRepository    = require("./../repositories/tournament-repository.js");

class RoundRobinService
{
    constructor() {
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
            participants    = playerRepository.getNames(),
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
        if (n === 2) {
            games.push([participants[0], participants[1]]);
        } else {
            if (n % 2 !== 0) {
                n++;
                upper = _.range(2, n / 2);
                lower = _.range(n - 1, n / 2 + 1);
                lower[0] = -1;
            } else {
                upper = _.range(2, n / 2);
                lower = _.range(n - 1, n / 2 + 1);
            }
            for (let r = 0; r < n; ++r) {
                if (rotatedOut != -1) {
                    games.push([participants[fixed], participants[rotatedOut]]);
                }
                for (let  i = 0; count = upper.length - 1; i <= count; ++i) {
                    if (upper[i] != -1 && lower[i] != -1) {
                        games.push([upper[i], lower[i]]);
                    }
                }
                rotateForRoundRobin();
            }
        }
        // Compose rounds
        this.precomposedRounds = [];
        for (let game in games) {
            if (players.indexof(game[0]) !== -1 || players.indexof(game[1])) {
                this.precomposedRounds.push(roundGames.map((item) => item.slice(0));
                roundGames = players = [];
            }
            roundGames[] = game.slice(0);
            players.push(game[0]);
            players.push(game[1]);
        }
        if (roundGames.length > 0) {
            this.precomposedRounds.push(roundGames.map((item) => item.slice(0));
        }
    }
    composeNextRound() {
        this.precomposeRounds();
        if (this.precomposedRounds.length === 0) {
            return null;
        }
        let
            matches = this.precomposedRounds.shift(),
            round   = roundRepository.create(),
            roundId = round.id;
		for (let pairing in matches) {
			let
				match	= matchRepository.create(pairing[0], pairing[1]),
				matchId	= match.id;
				total	= tournamentRepository.getNumberOfGamesInSingleMatch,
				middle	= Math.floor(total / 2);
			for (let i = 0; i < total; ++i) {
				let game;
				if (i <= middle) {
					game.create(pairing[0], pairing[1]);
				} else {
					game.create(pairing[1], pairing[0]);
				}
				matchRepository.addGame(matchId, game.id);
			}
			roundRepository.addMatch(roundId, match.id);
		}
        tournamentRepository.addRound(roundId);
    }
}

module.exports = new RoundRobinService();
