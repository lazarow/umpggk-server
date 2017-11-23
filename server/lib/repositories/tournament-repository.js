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
			currentRound: null,
		    rounds: []
        }).write();
	}
	addRound(roundId) {
		const
			tournament = this.db().get("tournament"),
			rounds = tournament.value().rounds;
		rounds.push(roundId);
        return tournament.assign(this._.assign(tournament.value(), {rounds: rounds})).write();
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
	hasRound(){
		return !!this.db().get("tournament").value().rounds.length;
	}
	isRegistrationOpen() {
		return this.db().get("tournament").value().registration;
	}
	openRegistration() {
		const tournament = this.db().get("tournament");
		return tournament.assign(this._.assign(tournament.value(), {registration: true})).write();
	}
	closeRegistration() {
		const tournament = this.db().get("tournament");
		return tournament.assign(this._.assign(tournament.value(), {registration: false})).write();
	}
	setCurrentRound(roundId) {
		const tournament = this.db().get("tournament");
		return tournament.assign(this._.assign(tournament.value(), {currentRound: roundId})).write();
	}
	getNumberOfGamesInSingleMatch() {
		return this.db().get("tournament").value().numberOfGamesInSingleMatch;
	}
}

module.exports = new TournamentRepository();
