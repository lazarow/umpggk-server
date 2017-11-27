const	Repository			= require("./repository.js"),
		playerRepository	= require("./player-repository.js"),
		gameRepository		= require("./game-repository.js"),
		log 				= require("./../log.js")(__filename);

class MatchRepository extends Repository
{
	constructor() {
		super("matches")
	}
	get(matchId) {
		return this.collection().find({ id: matchId });
	}
	create(roundId, redId, blueId) {
		const match = {
			// Ids
			id: this.idGenerator.next().value,
			roundId: roundId,
			red: redId,
		    blue: blueId,
			// Score
		    redPoints: 0,
		    bluePoints: 0,
			// Statictics
		    startedAt: null,
		    finishedAt: null,
	    	duration: null,
			// Collections
    		games: []
		};
		this.collection().push(match).write();
		playerRepository.addOpponent(redId, blueId);
		playerRepository.addOpponent(blueId, redId);
		playerRepository.addMatch(redId, match.id);
		playerRepository.addMatch(blueId, match.id);
		return match;
	}
	start(matchId) {
		const match = this.get(matchId).value();
		log.info("The match #" + matchId + " (the round #" + match.roundId + ") has been started");
		playerRepository.setCurrentOpponent(match.red, match.blue);
		playerRepository.setCurrentOpponent(match.blue, match.red);
		playerRepository.setCurrentMatch(match.red, match.id);
		playerRepository.setCurrentMatch(match.blue, match.id);
		this.get(matchId).assign(this._.assign(match, {
			startedAt: (new Date()).getTime()
		})).write();
		// Start the first game
		this.startUncompletedGame(matchId);
	}
	finish(matchId) {
		const match = this.get(matchId).value(), startedAt = match.startedAt, finishedAt = (new Date()).getTime();
		log.colors("yellow").info("The match #" + matchId + " (the round #" + match.roundId + ") has been finished");
		if (match.redPoints > match.bluePoints) {
			playerRepository.addPoints(match.red, 1);
			playerRepository.addDefetedOpponent(match.red, match.blue);
		} else if (match.redPoints < match.bluePoints) {
			playerRepository.addPoints(match.blue, 1);
			playerRepository.addDefetedOpponent(match.blue, match.red);
		} else {
			playerRepository.addPoints(match.red, 0.5);
			playerRepository.addPoints(match.blue, 0.5);
		}
		this.get(matchId).assign(this._.assign(match, {
			finishedAt: finishedAt,
			duration: finishedAt - startedAt
		})).write();
		// Start next matches
		require("./round-repository.js").startUncompletedMatches(match.roundId);
	}
	addGame(matchId, gameId) {
		this.get(matchId).assign(this._.assign(
			this.get(matchId).value(),
			{ games: this.get(matchId).value().games.concat(gameId) }
		)).write();
	}
	// Operations
	startUncompletedGame(matchId) {
		let started = 0,
			games = this.get(matchId).value().games;
		for (let idx in games) {
			let game = gameRepository.get(games[idx]).value();
			if (game.startedAt === null) {
				gameRepository.start(game.id);
				started++;
				break;
			}
		}
		// If nothing to start then finish the match
		if (started === 0) {
			this.finish(matchId);
		}
	}
	addPoints(matchId, player, points) {
		const match = this.get(matchId).value();
		if (match.red === player) {
			this.get(matchId).assign(this._.assign(match, {redPoints: match.redPoints + points})).write();
		} else {
			this.get(matchId).assign(this._.assign(match, {bluePoints: match.bluePoints + points})).write();
		}
	}
}

module.exports = new MatchRepository();
