const
    repositories = require("./repositories.js"),
    injector = require("./../container/injector.js"),
    db = injector.get("db"),
    io = injector.get('io');

class Repository {
    constructor() {
        this.setIo(io);
        this.setDb(db);
        repositories.push(this);
    }
    namespace() {
        return "repository";
    }
    db(namespace) {
        this._db.namespace = namespace || this.namespace();
        return this._db;
    }
    setIo(io){
        this._io = io;
    }
    setDb(db) {
        this._db = db;
    }
}

module.exports = Repository;
