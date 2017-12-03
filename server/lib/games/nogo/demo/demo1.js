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
        this.shifts = [10, -10, 1, -1]; // top, bottom, left, right
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
        return [-537395713 << 0, -134348929 << 0, 33521631 << 0, 0 << 0];
    }
    getZerosBoard() {
        return [~(0 << 0), ~(0 << 0), ~(0 << 0), ~(0 << 0)];
    }
    getInitialState() {
        // black, white, illegal for black (cache), illegal for white (cache)
        return [this.getEmptyBoard(), this.getEmptyBoard(), this.getZerosBoard(), this.getZerosBoard()];
    }
    and(a, b) {
        return [a[0] & b[0], a[1] & b[1], a[2] & b[2], a[3] & b[3]];
    }
    or(a, b) {
        return [a[0] | b[0], a[1] | b[1], a[2] | b[2], a[3] | b[3]];
    }
    neg(a) {
        return [~a[0], ~a[1], ~a[2], ~a[3]];
    }
    xor(a, b) {
        return [a[0] ^ b[0], a[1] ^ b[1], a[2] ^ b[2], a[3] ^ b[3]];
    }
    shift(a, shift) {
        if (shift >= 0) {
            return [
                a[0] >>> shift | a[1] << 32 - shift,
                a[1] >>> shift | a[2] << 32 - shift,
                a[2] >>> shift | a[3] << 32 - shift,
                a[3] >>> shift
            ];
        }
        shift = -shift;
        return [
            a[0] << shift,
            a[1] << shift | a[0] >>> 32 - shift,
            a[2] << shift | a[1] >>> 32 - shift,
            a[3] << shift | a[2] >>> 32 - shift
        ];
    }
    isEmpty(board, y, x) {
        return (board[this.map[0][y][x]] & 1 << this.map[1][y][x]) !== 0;
    }
    _print(something, fn) {
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
        state[color === "black" ? 0 : 1][this.map[0][y][x]] &= ~(1 << this.map[1][y][x]);
        this.printState(state);
        // Finding illegal moves cache
        if (color === "black") {
            state[3] = this.and(state[3], this.getSimpleIllegalMoves(state[1], state[0]));
        } else {
            state[2] = this.and(state[2], this.getSimpleIllegalMoves(state[0], state[1]));
        }
        this.printBoard(this.getSimpleKillMoves(state[0], state[1]));
        //this.printBoard(state[2]);
        //this.printBoard(state[3]);
        return state;
    }
    getSimpleIllegalMoves(player, opponent) {
        return this.or(
            this.neg(player),
            this.or(
                this.shift(opponent, this.shifts[0]),
                this.or(
                    this.shift(opponent, this.shifts[1]),
                    this.or(this.shift(opponent, this.shifts[2]), this.shift(opponent, this.shifts[3]))
                )
            )
        );
    }
    getSimpleKillMoves(player, opponent) {
        const v = this.or(player, this.or(this.shift(opponent, this.shifts[2]), this.shift(opponent, this.shifts[3])));
        const x = this.neg(this.xor(this.shift(opponent, this.shifts[0]), this.xor(this.shift(opponent, this.shifts[1]), v)));
        const z = this.or(v, x);
        return z;
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
state = helper.play(state, "white", 0, 1);
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
state = helper.play(state, "black", 3, 7);
state = helper.play(state, "black", 6, 2);
state = helper.play(state, "black", 7, 2);
state = helper.play(state, "black", 4, 4);
state = helper.play(state, "black", 2, 0);
//console.log(helper.getLegalMoves(state, "black"));
