const	BaseGameController	= require("./../../game-controller.js"),
		gameStateHelper		= require("./game-state-helper.js");

class GameController extends BaseGameController
{
	whoFirst() {
		return "black";
	}
	getGameDescription() {
		return "nogo 9 9";
	}
	getInitialState() {
		return gameStateHelper.getInitialState();
	}
	move(state, player, move) {
		const moves = gameStateHelper.getLegalMoves(state, player);
		for (let legalMove of moves) {
			if (move[0] - 1 == legalMove.x && move[1] - 1 == legalMove.y) {
				return gameStateHelper.play(state, player, move[1] - 1, move[0] - 1);
			}
		}
		return false;
	}
	isFinished(state, player) {
		const moves = gameStateHelper.getLegalMoves(state, player);
		return moves.length === 0;
	}
}

module.exports = new GameController();
