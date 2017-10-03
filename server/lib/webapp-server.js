var config = require("config"),
    HttpServer = require("http-server").HttpServer;

var WebAppServer = function () {};

WebAppServer.prototype.start = function (options) {
    this.server = new HttpServer({
        root: options.path
    });
    this.server.listen(options.port);
    console.log("The web app server is listening on " + this.server.server.address().address + ":" + this.server.server.address().port);
};

module.exports = new WebAppServer();