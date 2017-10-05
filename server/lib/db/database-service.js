const
    config              = require("config"),
    low                 = require('lowdb'),
    container           = require('./../container/container.js'),
    injector            = require('./../container/injector.js'),
    Adapter             = require('./adapter.js'),
    repositories        = require("./../repositories/repositories.js");

const DatabaseService = function () {};

DatabaseService.prototype.createConnector = function () {
    const currentDate = new Date();
    const filename = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate()
        + "-" + currentDate.getHours() + currentDate.getMinutes() + currentDate.getSeconds() + "-"
        + currentDate.getMilliseconds() + ".json";
    const db = low(new Adapter('./../saves/' + filename));
    container.value("db", db);
    repositories.forEach((repository) => {
        repository.setDb(db);
    });
};

DatabaseService.prototype.createEmptyDatabase = function () {
    injector.get("db").defaults(config.get("EmptyDatabase")).write();
};

module.exports = new DatabaseService();
