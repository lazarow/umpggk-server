/*
11 0111111111 0111111111 0111111111 -> -537395713
1111 0111111111 0111111111 01111111 -> -134348929
000000 0111111111 0111111111 011111 -> 33521631
00000000 0000000000 0000000000 0000 -> 0 // only for shifting
*/
class GameStateHelper
{
    constructor() {
        this.shifts = { top: 10, bottom: -10, left: 1, right: -1 };
        this.map = {
            a: [], // chunks
            b: [], // positions
            c: [], // x
            d: [], // y
        };
        for (let y = 0; y < 9; ++y) {
            this.map.a[y] = []; this.map.b[y] = []; this.map.c[y] = []; this.map.d[y] = [];
            for (let x = 0; x < 9; ++x) {
                let i = y * 10 + x, j = Math.floor(i / 32), k = i - j * 32;
                this.map.a[y][x] = j;
                this.map.b[y][x] = k;
                this.map.c[j][k] = x;
                this.map.d[j][k] = y;
            }
        }
    }
    getEmptyBoard() {
        return [-537395713 << 0, -134348929 << 0, 33521631 << 0];
    }
    getInitialState() {
        return {
            black: this.getEmptyBoard(),
            white: this.getEmptyBoard(),
            illegal: { black: [0 << 0, 0 << 0, 0 << 0], white: [0 << 0, 0 << 0, 0 << 0] }
        };
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
    shift(a, shift) {
        if (shift >= 0) {
            return [a[0] >>> shift | a[1] << 32 - shift, a[1] >>> shift | a[2] << 32 - shift, a[2] >>> shift | a[3] << 32 - shift, a[3] >>> shift];
        }
        return [a[0] << shift, a[1] << shift | a[0] >>> 32 - shift, a[2] << shift | a[1] >>> 32 - shift, a[3] << shift | a[2] >>> 32 - shift]
    }
    play(previousState, color, y, x) {
        const state = {
            black: previousState.black.slice(0),
            white: previousState.white.slice(0),
            illegal: { black: previousState.illegal.black.slice(0), white: previousState.illegal.white.slice(0) }
        };
        state[color][this.map.a[y][x]] &= ~(1 << this.map.b[y][x]);
        // todo: check illegal moves and cached them
        return state;
    }
    getLegalMoves(state, color) {
        const moves = [];
        let board = this.and(
            this.and(state.white, state.black),
            this.getIllegalMoves(state, color)
        );
        this.printBoard(this.getIllegalMoves(state, color));

        for (let y = 0; y < 9; ++y) {
            for (let x = 0; x < 9; ++x) {
                if (this.isEmpty(board, y, x)) {
                    moves.push({y: y, x: x});
                }
            }
        }
        return moves;
    }
    getIllegalMoves(state, color) {
        let player = state[color], opponent = state[color === "white" ? "black" : "white"];
        return this.or(
            this.neg(player),
            this.or(
                this.shift(opponent, this.shifts.top),
                this.or(
                    this.shift(opponent, this.shifts.bottom),
                    this.or(this.shift(opponent, this.shifts.left), this.shift(opponent, this.shifts.right))
                )
            )
        );
    }
    isEmpty(board, y, x) {
        return (board[this.map.a[y][x]] & 1 << this.map.b[y][x]) !== 0;
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
            return this.isEmpty(state.black, y, x) ? (this.isEmpty(state.white, y, x) ? "." : "W") : "B";
        });
    }
}

const helper = new GameStateHelper();
let state = helper.getInitialState();
state = helper.play(state, "white", 0, 1);
state = helper.play(state, "white", 1, 0);
state = helper.play(state, "white", 1, 2);
state = helper.play(state, "white", 2, 1);
state = helper.play(state, "white", 7, 8);
state = helper.play(state, "white", 8, 7);
console.log(helper.getLegalMoves(state, "black"));
helper.printState(state);
