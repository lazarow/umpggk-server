const	Repository	= require("./repository.js"),
		injector	= require("./../container/injector.js"),
		config      = require("config");

class TournamentRepository extends Repository
{
	constructor() {
		super("tournament")
	}
	get() {
		return this.collection();
	}
	/**
	 * Creates a new tournament. The options contains tournament settings.
	 */
	create(options) {
		const tournament = {
			// Game
			game: options.game,
			// Tournament
			gamesLimit: options.gamesLimit,
			timeLimit: options.timeLimit,
			// Flags
			registration: false,
			// Rounds
    		rounds: [],
			currentRound: null
        };
		this.collection().assign(tournament).write();
		if (config.get("Controls").registrationStart === "auto") {
			this.openRegistration();
		}
		return tournament;
	}
	addRound(roundId) {
        this.get().assign(this._.assign(
			this.get().value(),
			{ rounds: this.get().value().rounds.concat(roundId) }
		)).write();
    }
	setCurrentRound(roundId) {
		this.get().assign(this._.assign(this.get().value(), { currentRound: roundId })).write();
	}
	isRegistrationOpen() {
		return this.get().value().registration;
	}
	openRegistration() {
		this.get().assign(this._.assign(this.get().value(), { registration: true })).write();
	}
	closeRegistration() {
		this.get().assign(this._.assign(this.get().value(), { registration: false })).write();
	}
	startNextRound() {
		const 	roundCompositor = injector.get("RoundCompositor"),
				round = roundCompositor.composeNextRound();
		if (round !== null) {
			this.setCurrentRound(round.id);
			require("./round-repository.js").start(round.id);
		}
		return round;
	}
}

module.exports = new TournamentRepository();
