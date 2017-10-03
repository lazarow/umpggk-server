var config = require("config"),
    HttpServer = require("http-server").HttpServer,
    SocketIoServer = require('socket.io');

var WebAppServer = function () {};

WebAppServer.prototype.start = function (options) {
    this.server = new HttpServer({
        root: options.path
    });
    const io = new SocketIoServer(this.server.server);
    this.server.listen(options.port);
    io.on('connection', function (socket) {
        console.log('A new websocket connection...');
        socket.on('disconnect', function () {
            console.log('The websocket disconnection...');
        });
    });
    console.log("The web app server is listening on " + this.server.server.address().address + ":"
        + this.server.server.address().port);
};

module.exports = new WebAppServer();
