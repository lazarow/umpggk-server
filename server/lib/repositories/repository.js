const
    repositories = require("./repositories.js"),
    injector = require("./../container/injector.js"),
    db = injector.get("db"),
    io = injector.get('io');

class Repository {
    constructor() {
        this.setIo(io);
        this.setDb(db);
        this.emitChange = function (table,action,data) {
            injector.get('io').emit('data', {
                table,
                action,
                data
            });
        };
        repositories.push(this);
    }

    setIo(io){
        this.io = io;
    }

    setDb(db) {
        this.db = db;
    }
}

module.exports = Repository;
