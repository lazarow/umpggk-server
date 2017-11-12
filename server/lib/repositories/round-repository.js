const
	Repository		= require("./repository.js"),
    injector		= require("./../container/injector.js"),
    matchRepository	= require("./match-repository");

class RoundRepository extends Repository
{
	namespace() {
		return "rounds";
	}
	create() {
		return this.db().get("rounds").push({
			id: this.idGenerator.next().value,
			startedAt: null,
		    finishedAt: null,
		    duration: null,
		    matches: []
        }).write();
	}
	start(roundId) {
		const round = this.db().get("rounds").find({id: roundId});
		return round.assign({startedAt: new Date()).getTime()}).write();
	}
	finish(roundId) {
		const
			finishedAt = new Date()).getTime(),
			round = this.db().get("rounds").find({id: roundId}),
			startedAt = round.value().startedAt;
		return round.assign({finishedAt: finishedAt, duration: finishedAt - startedAt}).write();
	}
	addMatch(roundId, matchId) {
		const
			round = this.db().get("rounds").find({id: roundId}),
			matches = round.value().matches;
		matches.push(matchId);
		return round.assign({matches: matches}).write();
	}
	isStarted(roundId) {
		return this.db().get("rounds").find({id: roundId}).value().startedAt === null;
	}
	isUnifinished(roundId) {
		return this.db().get("rounds").find({id: roundId}).value().finishedAt === null;
	}
	hasUnfinishedMatches(roundId) {
		for (matchId in this.db().get("rounds").find({id: roundId}).value().matches) {
			if (matchRepository.isUnfinished(matchId)) {
				return true;
			}
		}
		return false;
	}
	startNextUnfinishedMatches(roundId) {
		const ips = [];
		for (matchId in this.db().get("rounds").find({id: roundId}).value().matches) {
			if (matchRepository.isUnfinished(matchId)) {
				matchRepository.start(matchId);
			}
		}
	}
}

module.exports = new RoundRepository();
