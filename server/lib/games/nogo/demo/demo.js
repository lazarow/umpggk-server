/*
11 0111111111 0111111111 0111111111 -> -537395713
1111 0111111111 0111111111 01111111 -> -134348929
000000 0111111111 0111111111 011111 -> 33521631
00000000 0000000000 0000000000 0000 -> 0 // only for shifting
*/
class GameStateHelper
{
    constructor() {
        this.side = 9;
        this.map = [[], []]; // chunk, position
        for (let y = 0; y < this.side; ++y) {
            this.map[0][y] = []; this.map[1][y] = [];
            for (let x = 0; x < this.side; ++x) {
                let i = y * 10 + x, j = Math.floor(i / 32), k = i - j * 32;
                this.map[0][y][x] = j; this.map[1][y][x] = k;
            }
        }
    }
    getEmptyBoard() { return [-537395713 << 0, -134348929 << 0, 33521631 << 0, 0 << 0]; }
    getOnes() { return [~(0 << 0), ~(0 << 0), ~(0 << 0), ~(0 << 0)]; }
    getInitialState() {
        // [ black, white, illegal black, illegal white ]
        return [this.getEmptyBoard(), this.getEmptyBoard(), this.getOnes(), this.getOnes()];
    }
    and(a, b) { return [a[0] & b[0], a[1] & b[1], a[2] & b[2], a[3] & b[3]]; }
    or(a, b) { return [a[0] | b[0], a[1] | b[1], a[2] | b[2], a[3] | b[3]]; }
    neg(a) { return [~a[0], ~a[1], ~a[2], ~a[3]]; }
    shift(a, s) {
		let p = 32 - s;
        if (s >= 0) {
            return [a[0] >>> s | a[1] << p, a[1] >>> s | a[2] << p, a[2] >>> s | a[3] << p, a[3] >>> s];
        }
        s = -s; p = 32 - s;
        return [a[0] << s, a[1] << s | a[0] >>> p, a[2] << s | a[1] >>> p, a[3] << s | a[2] >>> p];
    }
	top(a) { return this.shift(a, -10); }
	bottom(a) { return this.shift(a, 10); }
	left(a) { return this.shift(a, 1); }
	right(a) { return this.shift(a, -1); }
	equal(a, b) { return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3]; }
	dilatation(a) {
		return this.and(a, this.and(this.top(a), this.and(this.bottom(a), this.and(this.left(a), this.right(a)))));
	}
    isEmpty(board, y, x) { return (board[this.map[0][y][x]] & 1 << this.map[1][y][x]) !== 0; }
    _print(something, fn) {
		console.log("");
        console.log("  | 1 2 3 4 5 6 7 8 9");
        console.log("--+------------------");
        for (let y = 0; y < 9; ++y) {
            let row = (y + 1) + " |";
            for (let x = 0; x < 9; ++x) {
                row += " " + fn.apply(this, [something, y, x]);
            }
            console.log(row);
        }
    }
	_bnumber(number) {
		let bnumber = [];
		for (let i = 0; i < 32; ++i) {
			bnumber.push((number & 1 << i) !== 0 ? "1" : "0");
		}
		return bnumber;
	}
	_bboard(board) {
		let bboard = [], chunked = [];
		for (let i = 0; i < board.length; ++i) {
			bboard = bboard.concat(this._bnumber(board[i]));
		}
		for (let i = 0; i < bboard.length; i += 10) {
    		chunked.push(bboard.slice(i, i + 10).reverse().join(""));
		}
		return chunked.reverse().join(" ");
	}
	printBinaryState(state) {
		console.log("[ Black ]");
		console.log(this._bboard(state[0]));
		console.log("[ White ]");
		console.log(this._bboard(state[1]));
		console.log("[ Illegal for Black ]");
		console.log(this._bboard(state[2]));
		console.log("[ Illegal for White ]");
		console.log(this._bboard(state[3]));
	}
    printBoard(board) {
        this._print(board, function (board, y, x) { return this.isEmpty(board, y, x) ? "." : "@"; });
    }
    printState(state) {
        this._print(state, function (state, y, x) {
            return this.isEmpty(state[0], y, x) ? (this.isEmpty(state[1], y, x) ? "." : "W") : "B";
        });
    }
    play(previousState, color, y, x) {
        const state = [
            previousState[0].slice(0),
            previousState[1].slice(0),
            previousState[2].slice(0),
            previousState[3].slice(0)
        ];
		// Make a move
        state[color === "black" ? 0 : 1][this.map[0][y][x]] &= ~(1 << this.map[1][y][x]);
        this.printState(state);
        // Finding illegal moves cache
        if (color === "black") {
            state[3] = this.and(state[3], this.getSimpleIllegalMoves(state[1], state[0]));
        } else {
            state[2] = this.and(state[2], this.getSimpleIllegalMoves(state[0], state[1]));
        }
		// Finding simple kill moves
		state[2] = this.and(state[2], this.getSimpleKillMoves(state[0], state[1]));
		state[3] = this.and(state[3], this.getSimpleKillMoves(state[1], state[0]));
        return state;
    }
    getSurroundedMoves(player, opponent) {
		const both = this.and(player, opponent);
        return this.or(
            this.neg(both),
            this.or(
                this.top(both),
                this.or(this.bottom(both), this.or(this.left(both), this.right(both)))
            )
        );
    }
	getSimpleIllegalMoves(player, opponent) {
        return this.or(
            this.neg(player),
            this.or(
                this.top(opponent),
                this.or(this.bottom(opponent), this.or(this.left(opponent), this.right(opponent)))
            )
        );
    }
    getSimpleKillMoves(player, opponent) {
		const	horizontal = this.or(opponent, this.or(this.left(player), this.right(player))),
				vertical = this.or(opponent, this.or(this.top(player), this.bottom(player)));
		let	both = this.neg(this.and(player, opponent)),
			horizontal1 = this.or(this.or(horizontal, this.top(player)), this.bottom(both)),
			horizontal2 = this.or(this.or(horizontal, this.bottom(player)), this.top(both)),
			vertical1 = this.or(this.or(vertical, this.left(player)), this.right(both)),
			vertical2 = this.or(this.or(vertical, this.right(player)), this.left(both)),
			kills = this.getEmptyBoard();
		for (let y = 0, chunk, position; y < this.side; ++y) {
            for (let x = 0; x < this.side; ++x) {
                if (this.isEmpty(horizontal1, y, x) === false) {
					chunk = this.map[0][y+1][x];
					position = this.map[1][y+1][x];
					kills[chunk] &= ~(1 << position);
				}
				if (this.isEmpty(horizontal2, y, x) === false) {
					chunk = this.map[0][y-1][x];
					position = this.map[1][y-1][x];
					kills[chunk] &= ~(1 << position);
				}
				if (this.isEmpty(vertical1, y, x) === false) {
					chunk = this.map[0][y][x-1];
					position = this.map[1][y][x-1];
					kills[chunk] &= ~(1 << position);
				}
				if (this.isEmpty(vertical2, y, x) === false) {
					chunk = this.map[0][y][x+1];
					position = this.map[1][y][x+1];
					kills[chunk] &= ~(1 << position);
				}
            }
        }
		return kills;
    }
    getLegalMoves(state, color) {
        const moves = [], board = this.and(this.and(state[0], state[1]), state[color === "black" ? 2 : 3]);
        for (let y = 0; y < 9; ++y) {
            for (let x = 0; x < 9; ++x) {
                if (this.isEmpty(board, y, x)) {
                    moves.push({y: y, x: x});
                }
            }
        }
        return moves;
    }
}

const helper = new GameStateHelper();
let state = helper.getInitialState();
/*state = helper.play(state, "white", 0, 1);
state = helper.play(state, "white", 1, 0);
state = helper.play(state, "white", 1, 2);
state = helper.play(state, "white", 2, 1);
state = helper.play(state, "white", 0, 7);
state = helper.play(state, "white", 1, 8);
state = helper.play(state, "white", 2, 7);
state = helper.play(state, "white", 3, 8);
state = helper.play(state, "white", 7, 8);
state = helper.play(state, "white", 8, 7);
state = helper.play(state, "white", 8, 1);
state = helper.play(state, "white", 7, 1);
state = helper.play(state, "white", 6, 1);
state = helper.play(state, "white", 5, 1);
state = helper.play(state, "white", 5, 2);
state = helper.play(state, "white", 5, 3);
state = helper.play(state, "white", 6, 3);
state = helper.play(state, "white", 7, 3);
state = helper.play(state, "white", 8, 3);
state = helper.play(state, "white", 4, 7);
state = helper.play(state, "white", 7, 6);
state = helper.play(state, "white", 3, 2);
state = helper.play(state, "black", 3, 7);
state = helper.play(state, "black", 6, 2);
state = helper.play(state, "black", 7, 2);
state = helper.play(state, "black", 4, 4);
state = helper.play(state, "black", 2, 0);
state = helper.play(state, "black", 0, 2);
state = helper.play(state, "black", 0, 3);
state = helper.play(state, "black", 7, 7);
state = helper.play(state, "black", 2, 2);
state = helper.play(state, "black", 3, 1);
state = helper.play(state, "black", 4, 2);*/
helper.printBoard(helper.dilatation(state[0]));
//console.log(helper.getLegalMoves(state, "black"));
