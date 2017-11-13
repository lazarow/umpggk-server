const
    Repository		= require("./repository.js"),
    injector		= require("./../container/injector.js"),
    roundRepository	= require("./round-repository");

class TournamentRepository extends Repository
{
	namespace() {
		return "tournament";
	}
	/**
	 * Creates a new tournament. The options contains tournament settings.
	 */
	create(options) {
		return this.db().get("tournament").assign({
			game: options.game,
			type: options.type,
		    additionalRounds: options.additionalRounds,
		    timeLimit: options.timeLimit,
		    numberOfGamesInSingleMatch: options.numberOfGamesInSingleMatch,
			registration: false,
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
	isRegistrationOpen() {
		return this.db().get("tournament").value().registration;
	}
	openRegistration() {
		return this.db().get("tournament").assign({registration: true}).write();
	}
	closeRegistration() {
		return this.db().get("tournament").assign({registration: false}).write();
	}
}

module.exports = new TournamentRepository();
