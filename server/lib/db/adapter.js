const
    FileSync    = require("lowdb/adapters/FileSync"),
    fs          = require("graceful-fs"),
    injector    = require("./../container/injector.js");

const writeFile = fs.writeFileSync;

class Adapter extends FileSync {
    constructor(source) {
        super(source);
        console.log("The custom DB adapter based on FileSync has been created");
    }
    write(data) {
        let result = writeFile(this.source, this.serialize(data));
        if (result) {
            //injector.get('io').emit('test', 'OK!');
            // TODO: Implementacja wysylki na Socket.IO
        }
        return result;
    }
}

module.exports = Adapter;
