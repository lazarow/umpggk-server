var config = require("config");
var http = require("http");

var WebAppServer = function () {};

WebAppServer.prototype.start = function () {
    const port = config.get('WebAppServer.port');
    this.server = http.createServer((request, response) => {
        response.end('OK')
    });
    this.server.listen(port);
    console.log("The web app server is listening on " + this.server.address().address + ":" + this.server.address().port);
};

module.exports = new WebAppServer();