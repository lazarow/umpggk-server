const	Repository				= require("./repository.js"),
		tournamentRepository	= require("./tournament-repository.js"),
		playerRepository		= require("./player-repository.js"),
		matchRepository			= require("./match-repository.js"),
		log 					= require("./../log.js")(__filename),
		config					= require("config");

class RoundRepository extends Repository
{
	constructor() {
		super("rounds")
	}
	get(roundId) {
		return this.collection().find({ id: roundId });
	}
	create() {
		const round = {
			id: this.idGenerator.next().value,
			startedAt: null,
		    finishedAt: null,
		    duration: null,
		    matches: []
        };
		this.collection().push(round).write();
		return round;
	}
	start(roundId) {
		log.info("The round #" + roundId + " has been started");
		this.get(roundId).assign(this._.assign(this.get(roundId).value(), {startedAt: (new Date()).getTime()})).write();
		this.startUncompletedMatches(roundId);
	}
	finish(roundId) {
		log.colors("yellow").info("The round #" + roundId + " has been finished");
		const round = this.get(roundId).value(), startedAt = round.startedAt, finishedAt = (new Date()).getTime();
		this.get(roundId).assign(this._.assign(round, {finishedAt: finishedAt, duration: finishedAt - startedAt})).write();
		const allPlayersNames = playerRepository.getAllPlayersNames();
		allPlayersNames.forEach((name) => { playerRepository.computeSumOfOpponentsScores(name); });
		allPlayersNames.forEach((name) => { playerRepository.computeSumOfOpponentsSos(name); });
		allPlayersNames.forEach((name) => { playerRepository.computeSumOfDefetedOpponentsScores(name); });
		if (config.get("Controls").roundsStart === "auto") {
			tournamentRepository.setCurrentRound(null);
			tournamentRepository.startNextRound();
		}
	}
	// Collections
	addMatch(roundId, matchId) {
		this.get(roundId).assign(this._.assign(
			this.get(roundId).value(),
			{ matches: this.get(roundId).value().matches.concat(matchId) }
		)).write();
	}
	startUncompletedMatches(roundId) {
		let started = 0,
			addressesInMatches = [],
			matches = this.get(roundId).value().matches;
		for (let idx in matches) {
			let match = matchRepository.get(matches[idx]).value();
			if (match.startedAt === null) {
				const	redRemoteAddress 	= playerRepository.get(match.red).value().remoteAddress,
						blueRemoteAddress	= playerRepository.get(match.blue).value().remoteAddress;
				if (addressesInMatches.indexOf(redRemoteAddress) >= 0 || addressesInMatches.indexOf(blueRemoteAddress) >= 0) {
					continue;
				}
				addressesInMatches.push(redRemoteAddress);
				addressesInMatches.push(blueRemoteAddress);
				matchRepository.start(match.id);
				started++;
			} else if (match.finishedAt === null) {
				addressesInMatches.push(playerRepository.get(match.red).value().remoteAddress);
				addressesInMatches.push(playerRepository.get(match.blue).value().remoteAddress);
				started++;
			}
		}
		// If nothing to start then finish the round
		if (started === 0) {
			this.finish(roundId);
		}
	}
}

module.exports = new RoundRepository();
