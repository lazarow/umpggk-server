const
    repositories = require("./repositories.js"),
    injector = require("./../container/injector.js"),
    db = injector.get("db");

class Repository {
    constructor() {
        this.setDb(db);
        repositories.push(this);
    }
    setDb(db) {
        this.db = db;
    }
}

module.exports = Repository;
