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
	 * Creates a new tournament. The options should contain tournament settings.
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
			currentRound: null,
			additionalRounds: options.additionalRounds
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
		log.info("The registration has been opened");
		this.get().assign(this._.assign(this.get().value(), { registration: true })).write();
	}
	closeRegistration() {
		log.info("The registration has been closed");
		this.get().assign(this._.assign(this.get().value(), { registration: false })).write();
	}
	startNextRound() {
		const 	roundCompositor = injector.get("RoundCompositor"),
				round = roundCompositor.composeNextRound();
		// Close registration if it is opened
		if (this.isRegistrationOpen()) {
			this.closeRegistration();
		}
		// If round has matches
		if (round !== null) {
			this.get().assign(this._.assign(
				this.get().value(),
				{ rounds: this.get().value().rounds.concat(round.id) }
			)).write();
			this.setCurrentRound(round.id);
			require("./round-repository.js").start(round.id);
		}
		return round;
	}
}

module.exports = new TournamentRepository();
