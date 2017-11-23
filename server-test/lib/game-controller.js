class GameController
{
	constructor() {
	}
	whoFirst() {
		return "white";
	}
	getGameDescription() {
		return "9x9";
	}
	getInitialState() {
		return null;
	}
	move(state, player, move) {
		return false;
	}
	isFinished(state, player) {
		return true;
	}
}

module.exports = GameController;
