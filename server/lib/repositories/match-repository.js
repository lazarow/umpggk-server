const
	Repository			= require("./repository.js"),
	injector			= require("./../container/injector.js"),
	gameRepository		= require("./../repositories/game-repository.js"),
	playerRepository	= require("./../repositories/player-repository.js");

class MatchRepository extends Repository
{
	namespace() {
        return "matches";
    }
	create(redId, blueId) {
		const match = this.db().get("matches").push({
			id: this.idGenerator.next().value,
			red: redId,
		    blue: blueId,
		    redPoints: 0,
		    bluePoints: 0,
		    startedAt: null,
		    finishedAt: null,
	    	duration: null,
    		games: []
		}).write();
		playerRepository.addMatch(redId, match.id);
		playerRepository.addMatch(blueId, match.id);
		playerRepository.addOpponent(redId, blueId);
		playerRepository.addOpponent(blueId, redId);
		return match;
	}
	start(matchId) {
		const match = this.db().get("matches").find({id: matchId});
		return match.assign(this._.assign(match.value(), {startedAt: (new Date()).getTime()})).write();
	}
	finish(matchId) {
		const
			finishedAt = (new Date()).getTime(),
			match = this.db().get("matches").find({id: matchId}),
			startedAt = match.value().startedAt;
		return match.assign(this._.assign(match.value(), {finishedAt: finishedAt, duration: finishedAt - startedAt})).write();
	}
	isStarted(matchId) {
		return this.db().get("matches").find({id: matchId}).value().startedAt === null;
	}
	isUnifinished(matchId) {
		return this.db().get("matches").find({id: matchId}).value().finishedAt === null;
	}
	addGame(matchId, gameId) {
		const
			match = this.db().get("matches").find({id: matchId}),
			games = match.value().matches;
		games.push(gameId);
		return match.assign(this._.assign(match.value(), {games: games})).write();
	}
	hasUnfinishedGames(matchId) {
		for (gameId in this.db().get("matches").find({id: matchId}).value().games) {
			if (gameRepository.isUnfinished(gameId)) {
				return true;
			}
		}
		return false;
	}
	startNextUnfinishedGame(matchId) {
		for (gameId in this.db().get("matches").find({id: matchId}).value().games) {
			if (gameRepository.isUnfinished(gameId)) {
				gameRepository.start(gameId);
				break;
			}
		}
	}
}

module.exports = new MatchRepository();
