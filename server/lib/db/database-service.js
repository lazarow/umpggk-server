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
    const filename = 
        currentDate.getFullYear()
        + "-" + String("00" + (currentDate.getMonth() + 1)).slice(-2)
        + "-" + String("00" + currentDate.getDate()).slice(-2)
        + "-" + String("00" + currentDate.getHours()).slice(-2)
        + String("00" + currentDate.getMinutes()).slice(-2) + String("00" + currentDate.getSeconds()).slice(-2)
        + "-" + String("000" + currentDate.getMilliseconds()).slice(-3) + ".json";
    const adapter = new Adapter("./../saves/" + filename); 
    const db = low(adapter);
    /* The namespace denotes the scope for socket.io emitting */
    db.namespace = null;
    /* The write function wrapper for emmiting all saves */
    db._.prototype.write = db._.wrap(db._.prototype.value, function (func) {
        let
            current     = db.get(db.namespace).value(),
            keys        = current != undefined ? Object.keys(current) : [],
            result      = func.apply(this),
            message     = {action: null, data: null}
        if (Array.isArray(result)) {
            let inserted = db._.difference(Object.keys(result), keys);
            if (inserted.length > 0) {
                message.action = "insert";
                message.data = result[inserted[0]];
            } else {
                let deleted = db._.difference(keys, Object.keys(result));
                if (deleted.length > 0) {
                    message.action = "delete";
                    message.data = deleted;
                }
            }
        } else {
            message.action = "update";
            message.data = result;
        }
        injector.get('io').emit(db.namespace, message);
        log.debug("Emmiting data for the namespace `" + db.namespace + "`", message);
        return db.write(result);
    });
	log.debug("The database connection has been created");
    /* Add the database connection (connector) to the DI conatiner */
    container.value("db", db);
    /* Assign the database connection to all already existed repositories (a repository could already exist) */
    repositories.forEach((repository) => {
        repository.setDb(db);
    });
};

DatabaseService.prototype.createEmptyDatabase = function () {
    injector.get("db").namespace = "";
    injector.get("db").defaults(config.get("EmptyDatabase")).write();
};

module.exports = new DatabaseService();
