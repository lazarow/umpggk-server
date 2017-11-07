const
    config              = require("config"),
    low                 = require("lowdb"),
    container           = require("./../container/container.js"),
    injector            = require("./../container/injector.js"),
    Adapter             = require("./adapter.js"),
    repositories        = require("./../repositories/repositories.js"),
    isPromise           = require('is-promise'),
	log					= require("./../log.js")(__filename);

const DatabaseService = function () {};

DatabaseService.prototype.createConnector = function () {
    const currentDate = new Date();
    const filename = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate()
        + "-" + currentDate.getHours() + currentDate.getMinutes() + currentDate.getSeconds() + "-"
        + currentDate.getMilliseconds() + ".json";
    const adapter = new Adapter("./../saves/" + filename); 
    const db = low(adapter);
    /* The namespace denotes the scope for socket.io emitting */
    db.namespace = null;
    /* The write function wrapper for emmiting all saves */
    db.write = function (returnValue) {
        let result = adapter.write(db.getState());
        injector.get('io').emit(this.namespace, returnValue);
        log.debug("Emmiting data for the namespace `" + this.namespace + "`", returnValue);
        return isPromise(result) ? result.then(function () {
            return returnValue;
        }) : returnValue;
    };
	log.debug("The database connection has been created");
    /* Add the database connection (connector) to the DI conatiner */
    container.value("db", db);
    /* Assign the database connection to all already existed repositories (a repository could already exist) */
    repositories.forEach((repository) => {
        repository.setDb(db);
    });
};

DatabaseService.prototype.createEmptyDatabase = function () {
    injector.get("db").namespace = "no-repository";
    injector.get("db").defaults(config.get("EmptyDatabase")).write();
};

module.exports = new DatabaseService();
