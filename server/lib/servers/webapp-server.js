const
    config          = require("config"),
    HttpServer      = require("http-server").HttpServer,
    SocketIoServer  = require('socket.io'),
    container       = require('./../container/container.js');

const WebAppServer = function () {};

WebAppServer.prototype.start = function (options) {
    this.httpServer = new HttpServer({
        root: options.path
    });
    this.httpServer.listen(options.port);
    const io = new SocketIoServer(this.httpServer.server);
    container.value('io', io);
    io.on('connection', function (socket) {
        console.log('A new websocket connection...');
        socket.on('disconnect', function () {
            console.log('The websocket disconnection...');
        });
    });
    console.log("The web app server is listening on " + this.httpServer.server.address().address + ":"
        + this.httpServer.server.address().port);
};

module.exports = new WebAppServer();
