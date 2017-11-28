/*
pusta plansza:
10 1111111110 1111111110 1111111110 -> -1074791426
11110 111111110 1111111110 11111111 -> -134480129
0000000 1111111110 1111111110 11111 -> 33521631
*/
class GameStateHelper
{
	constructor() {
		this.offsets = { left: 1, right: -1, top: 10, bottom: -10 };
	}
	getEmptyBoard() {
		return [-1074791426 << 0, -134480129 << 0, 33521631 << 0];
	}
	getInitialState() {
		return [];
	}
	and(a, b) {
		return [a[0] & b[0], a[1] & b[1], a[2] & b[2]];
	}
	or(a, b) {
		return [a[0] | b[0], a[1] | b[1], a[2] | b[2]];
	}
	neg(a) {
		return [~a[0], ~a[1], ~a[2]];
	}
	shift(a, shift) {
		if (shift >= 0) {
			return [a[0] >>> shift | a[1] << 32 - shift, a[1] >>> shift | a[2] << 32 - shift, a[2] >>> shift];
		}
		shift = -shift;
		return [a[0] << shift, a[1] << shift | a[0] >>> 32 - shift, a[2] << shift | a[1] >>> 32 - shift];
	}
}

const helper = new GameStateHelper();
