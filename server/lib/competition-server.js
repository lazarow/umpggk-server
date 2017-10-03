var net = require("net");
var config = require("config");

var CompetitionServer = function () {};

CompetitionServer.prototype.start = function () {
    const port = config.get("CompetitionServer.port");
    this.server = net.createServer();
    this.server.listen(port);
    this.server.on("connection", function (socket) {
        var remote = socket.remoteAddress + ":" + socket.remotePort;
        console.log("A new connection: " + remote);
        socket.on("data", function(data) {
            const message = Buffer.isBuffer(data) ? data.toString().trim() : data.trim();
            console.log("The message from " + remote, message);
            socket.write("OK");
        });
        socket.on("close", function(data) {
            console.log("The connection is closed: " + remote);
        });
    });
    console.log("The competition server is listening on " + this.server.address().address + ":" + this.server.address().port);
};

module.exports = new CompetitionServer();