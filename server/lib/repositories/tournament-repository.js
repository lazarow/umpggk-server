const
    Repository		= require("./repository.js"),
    injector		= require("./../container/injector.js"),
    roundRepository	= require("./round-repository");

class TournamentRepository extends Repository
{
	/**
	 * Creates a new tournament. The options contains tournament settings.
	 */
	createTournament(options) {
		return this.db().get("tournament").assign({
			type: options.type,
		    additionalRounds: options.additionalRounds,
		    timeLimit: options.timeLimit,
		    numberOfGamesInSingleMatch: options.numberOfGamesInSingleMatch,
		    rounds: []
        }).write();
	}
	addRound(roundId) {
		const
			tournament = this.db.get("tournament"),
			rounds = tournament.value().rounds;
		rounds.push(roundId);
        return tournament.assign({rounds: rounds}).write();
    }
	hasUnfinishedRounds() {
		for (roundId in this.db().get("tournament").value().rounds) {
			if (roundRepository.isUnfinished(roundId)) {
				return true;
			}
		}
		return false;
	}
	startNextUnfinishedRound() {
		for (roundId in this.db().get("tournament").value().rounds) {
			if (roundRepository.isUnfinished(roundId)) {
				roundRepository.start(roundId);
				break;
			}
		}
	}
}

module.exports = new RoundRepository();
