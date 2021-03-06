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
    getEmptyBoard() {
		return [-537395713 << 0, -134348929 << 0, 33521631 << 0];
	}
    getOnesBoard() {
		return [~(0 << 0), ~(0 << 0), ~(0 << 0)];
	}
    getInitialState() {
    	return [
			this.getEmptyBoard(),	// black board
			this.getEmptyBoard(),	// white board
			this.getOnesBoard(),	// illegal moves for black
			this.getOnesBoard(),	// illegal moves for white
		];
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
	clone(a) {
		return [a[0], a[1], a[2]];
	}
	xor(a, b) {
        return [a[0] ^ b[0], a[1] ^ b[1], a[2] ^ b[2]];
    }
    shift(a, s) {
		let p = 32 - s;
        if (s >= 0) {
            return [a[0] >>> s | a[1] << p, a[1] >>> s | a[2] << p, a[2] >>> s];
        }
        s = -s; p = 32 - s;
        return [a[0] << s, a[1] << s | a[0] >>> p, a[2] << s | a[1] >>> p];
    }
	top(a) {
		return this.shift(a, -10);
	}
	bottom(a) {
		return this.shift(a, 10);
	}
	left(a) {
		return this.shift(a, 1);
	}
	right(a) {
		return this.shift(a, -1);
	}
	t(a) { return this.top(a); }
	b(a) { return this.bottom(a); }
	l(a) { return this.left(a); }
	r(a) { return this.right(a); }
	equal(a, b) {
		return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
	}
	isEmpty(board, y, x) {
		return (board[this.map[0][y][x]] & 1 << this.map[1][y][x]) !== 0;
	}
	// Args: state, color
	getLegalMoves(s, c) {
        const	moves = [],
				board = this.and(this.and(s[0], s[1]), s[c === "black" ? 2 : 3]);
        for (let y = 0; y < 9; ++y) {
            for (let x = 0; x < 9; ++x) {
                if (this.isEmpty(board, y, x)) {
                    moves.push({y: y, x: x});
                }
            }
        }
        return moves;
    }
	// Args: state, color, y, x
	play(s, c, y, x) {
        const	state = [s[0].slice(0), s[1].slice(0), s[2].slice(0), s[3].slice(0)],
				isBlack = c === "black";
        state[isBlack ? 0 : 1][this.map[0][y][x]] &= ~(1 << this.map[1][y][x]); // make a move
		state[2] = this.and(state[2], this.getIllegalMoves(state[0], state[1]));
		state[3] = this.and(state[3], this.getIllegalMoves(state[1], state[0]));
		state[2] = this.and(state[2], this.getSingleStoneKillMoves(state[0], state[1]));
		state[3] = this.and(state[3], this.getSingleStoneKillMoves(state[1], state[0]));
		state[2] = this.and(state[2], this.getLastLibertiesOfGroups(state[0], state[1], state[2]));
		state[3] = this.and(state[3], this.getLastLibertiesOfGroups(state[1], state[0], state[3]));
        return state;
    }
	// Args: player, opponent
	getIllegalMoves(p, o) {
        const a = this.or(this.neg(p), this.or(this.t(o), this.or(this.b(o), this.or(this.l(o), this.r(o)))));
		return a;
    }
	// Args: player, opponent
	getSingleStoneKillMoves(p, o) {
		const	horizontal = this.or(o, this.or(this.left(p), this.right(p))),
				vertical = this.or(o, this.or(this.top(p), this.bottom(p))),
				horizontal1 = this.or(horizontal, this.top(p)),
				horizontal2 = this.or(horizontal, this.bottom(p)),
				vertical1 = this.or(vertical, this.left(p)),
				vertical2 = this.or(vertical, this.right(p)),
				kills = this.getEmptyBoard(),
				boards = [horizontal1, horizontal2, vertical1, vertical2],
				offsets = [[1,0], [-1,0], [0,-1], [0,1]];
		for (let y = 0, chunk, position; y < this.side; ++y) {
            for (let x = 0; x < this.side; ++x) {
				for (let j = 0; j < 4; ++j) {
					if (this.isEmpty(boards[j], y, x) === false) {
						chunk = this.map[0][y + offsets[j][0]][x + offsets[j][1]];
						position = this.map[1][y + offsets[j][0]][x + offsets[j][1]];
						kills[chunk] &= ~(1 << position);
					}
				}
            }
        }
		return kills;
    }
	// Args: player, opponent, illegal
	getLastLibertiesOfGroups(p, o, i) {
		const	both = this.and(p, o),
				empty = this.neg(both),
				horizontal = this.or(both, this.or(this.left(both), this.right(both))),
				vertical = this.or(both, this.or(this.top(both), this.bottom(both))),
				horizontal1 = this.or(this.or(horizontal, this.top(both)), this.bottom(empty)),
				horizontal2 = this.or(this.or(horizontal, this.bottom(both)), this.top(empty)),
				vertical1 = this.or(this.or(vertical, this.left(both)), this.right(empty)),
				vertical2 = this.or(this.or(vertical, this.right(both)), this.left(empty)),
				kills = this.getEmptyBoard(),
				boards = [horizontal1, horizontal2, vertical1, vertical2],
				offsets = [[1,0], [-1,0], [0,-1], [0,1]];
		for (let y = 0, chunk, position, a, b, c; y < this.side; ++y) {
            for (let x = 0; x < this.side; ++x) {
				for (let j = 0; j < 4; ++j) {
					if (this.isEmpty(boards[j], y, x) === false) {
						a = y + offsets[j][0];
						b = x + offsets[j][1];
						if (a < 0 || a >= this.side || b < 0 || b >= this.side) {
							continue;
						}
						if (this.isEmpty(i, a, b) === false) {
							continue;
						}
						chunk = this.map[0][a][b]; position = this.map[1][a][b]; c = this.clone(p);
						c[chunk] &= ~(1 << position);
						if (this.hasDeadGroups(o, c) || this.hasDeadGroups(c, o)) {
							kills[chunk] &= ~(1 << position);
						}
					}
				}
            }
        }
		return kills;
	}
	// Check existing of empty groups, args: player board, opponent board
	hasDeadGroups(p, o) {
		const b = this.and(p, o);
		let	r = p.slice(0),
			a = this.and(this.or(b, this.or(this.t(b), this.or(this.b(b), this.or(this.l(b), this.r(b))))), o);
		while (this.equal(a, r) === false) {
			r = a.slice(0);
			a = this.and(this.or(a, this.or(this.t(a), this.or(this.b(a), this.or(this.l(a), this.r(a))))), o);
		}
		return this.equal(this.or(p, a), this.getEmptyBoard()) === false;
	}
	_print(something, fn) {
        console.log("\n  | 1 2 3 4 5 6 7 8 9\n--+------------------");
        for (let y = 0; y < 9; ++y) {
            let row = (y + 1) + " |";
            for (let x = 0; x < 9; ++x) {
                row += " " + fn.apply(this, [something, y, x]);
            }
            console.log(row);
        }
    }
	printBoard(board) {
        this._print(board, function (board, y, x) { return this.isEmpty(board, y, x) ? "." : "@"; });
    }
    printState(state) {
        this._print(state, function (state, y, x) {
            return this.isEmpty(state[0], y, x) ? (this.isEmpty(state[1], y, x) ? "." : "W") : "B";
        });
    }
}

module.exports = new GameStateHelper();
