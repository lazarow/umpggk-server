/*

Do rozważenia:
- samobójstwa
- zbicie

free = 0 | white | black | mask
if (white on move) {
    // Single points suicides
    temp = black | mask
    suicides1 =  ~free & (temp >> shifts.n) & (temp >> shifts.s) & (temp >> shifts.e) & (temp >> shifts.w)
    free |= suicides1
}

*/

var NogoBitBoardProperties = {
    initialized: false,
    size: 9,
    word: 53,
    chunks: null,
    mask: [],
    init: function () {
        if (this.initialized) {
            return;
        }
        console.log("The NoGo BitBoard properties are initialized");
        this.initialized = true;
        let i, j, b = '', bits = this.size * this.size + this.size;
        this.chunks = Math.ceil(bits / this.word);
        for (i = 0; i < this.chunks * this.word; ++i) {
            b += i < bits ? ((i - this.size) % (this.size + 1) === 0 ? '0' : '1') : '0';
        }
        b = b.split('').reverse().join('');
        for (i = 0; i < this.chunks; ++i) {
            console.log(b.substr(i * this.word, this.word));
            this.mask.push(parseInt(b.substr(i * this.word, this.word), 2));
        }
        console.log(this.mask[0].toString(2));
        console.log(this.mask[1].toString(2));
    }
};

class NogoBitBoard {
    constructor() {
        NogoBitBoardProperties.init();
        this.properties = NogoBitBoardProperties;
        this.white = [].fill(0, this.properties.chunks - 1);
        this.black = [].fill(0, this.properties.chunks - 1);
    }
}

let board = new NogoBitBoard();