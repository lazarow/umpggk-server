class GameState
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
			this.getOnesBoard()		// illegal moves for white
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
		state[2] = this.and(state[2], this.getStonesKillMoves(state[0], state[1], state[2]));
		state[3] = this.and(state[3], this.getStonesKillMoves(state[1], state[0], state[3]));
        return state;
    }
	// Args: player, opponent
	getIllegalMoves(p, o) {
        const a = this.or(this.neg(p), this.or(this.t(o), this.or(this.b(o), this.or(this.l(o), this.r(o)))));
		return a;
    }
	// Args: player, opponent
	getSingleStoneKillMoves(p, o) {
		const	both = this.neg(this.and(p, o)),
				horizontal = this.or(o, this.or(this.left(p), this.right(p))),
				vertical = this.or(o, this.or(this.top(p), this.bottom(p))),
				horizontal1 = this.or(this.or(horizontal, this.top(p)), this.bottom(both)),
				horizontal2 = this.or(this.or(horizontal, this.bottom(p)), this.top(both)),
				vertical1 = this.or(this.or(vertical, this.left(p)), this.right(both)),
				vertical2 = this.or(this.or(vertical, this.right(p)), this.left(both)),
				kills = this.getEmptyBoard();
		for (let y = 0, chunk, position; y < this.side; ++y) {
            for (let x = 0; x < this.side; ++x) {
                if (this.isEmpty(horizontal1, y, x) === false) {
					chunk = this.map[0][y+1][x]; position = this.map[1][y+1][x];
					kills[chunk] &= ~(1 << position);
				}
				if (this.isEmpty(horizontal2, y, x) === false) {
					chunk = this.map[0][y-1][x]; position = this.map[1][y-1][x];
					kills[chunk] &= ~(1 << position);
				}
				if (this.isEmpty(vertical1, y, x) === false) {
					chunk = this.map[0][y][x-1]; position = this.map[1][y][x-1];
					kills[chunk] &= ~(1 << position);
				}
				if (this.isEmpty(vertical2, y, x) === false) {
					chunk = this.map[0][y][x+1]; position = this.map[1][y][x+1];
					kills[chunk] &= ~(1 << position);
				}
            }
        }
		return kills;
    }
	// Args: player, opponent
	getStonesKillMoves(p, o, i) {
		const a = this.or(this.getSurroundedFields(p, o), this.neg(i));
		let	b = this.getEmptyBoard(),
			kills = this.getEmptyBoard();
		for (let y = 0; y < this.side; ++y) {
            for (let x = 0; x < this.side; ++x) {
				if (this.isEmpty(a, y, x) === false) {
					b = p.slice(0);
					b[this.map[0][y][x]] &= ~(1 << this.map[1][y][x]);
					if (this.hasDeadGroups(b, o) || this.hasDeadGroups(o, b)) {
						kills[this.map[0][y][x]] &= ~(1 << this.map[1][y][x]);
					}
				}
			}
		}
		return kills;
	}
	getSurroundedFields(p, o) {
		const b = this.and(p, o);
        return this.or(this.neg(b), this.or(this.t(b), this.or(this.b(b), this.or(this.l(b), this.r(b)))));
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
	_printBnumber(number) {
		let bnumber = [];
		for (let i = 0; i < 32; ++i) {
			bnumber.push((number & 1 << i) !== 0 ? "1" : "0");
		}
		return bnumber;
	}
	printBboard(board) {
		let bboard = [], chunked = [];
		for (let i = 0; i < board.length; ++i) {
			bboard = bboard.concat(this._printBnumber(board[i]));
		}
		for (let i = 0; i < bboard.length; i += 10) {
    		chunked.push(bboard.slice(i, i + 10).reverse().join(""));
		}
		return chunked.reverse().join(" ");
	}
}

const helper = new GameState();
console.time("RandomGame");
//for (let i = 0; i < 800; ++i) {
	let state = helper.getInitialState(),
		color = "black",
		moves = helper.getLegalMoves(state, color);
	/*while(moves.length > 0) {
		let move = moves[Math.floor(Math.random() * moves.length)];
		state = helper.play(state, color, move.y, move.x);
		color = color === "black" ? "white" : "black";
		moves = helper.getLegalMoves(state, color);
	}*/
	state = helper.play(state, "white", 3, 0);
	state = helper.play(state, "white", 2, 1);
	state = helper.play(state, "white", 1, 1);
	state = helper.play(state, "black", 2, 0);
	state = helper.play(state, "black", 1, 0);
	state = helper.play(state, "black", 0, 0);
	helper.printState(state);
	helper.printBoard(state[2]);
	helper.printBoard(state[3]);
//}
console.timeEnd("RandomGame");
