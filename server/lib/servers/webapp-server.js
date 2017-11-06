const
    config          = require("config"),
    HttpServer      = require("http-server").HttpServer,
    SocketIoServer  = require('socket.io'),
    container       = require('./../container/container.js'),
    repositories    = require('./../repositories/repositories'),
    injector        = require("./../container/injector.js"),
	log 			= require("./../log.js")(__filename);

const WebAppServer = function () {};

WebAppServer.prototype.start = function (options) {
    this.httpServer = new HttpServer({
        root: options.path
    });
    this.httpServer.listen(options.port);
    const io = new SocketIoServer(this.httpServer.server);


    container.value('io', io);
    io.on('connection', function (socket) {

        /*TODO  send latest database*/


        socket.emit('database',injector.get("db").value());

        console.log('A new websocket connection...');
        socket.on('disconnect', function () {
            console.log('The websocket disconnection...');
        });
    });
    log.info("The web app server is listening on " + this.httpServer.server.address().address + ":"
        + this.httpServer.server.address().port);
};

module.exports = new WebAppServer();
