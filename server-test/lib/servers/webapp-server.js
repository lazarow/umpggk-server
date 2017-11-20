const	HttpServer	= require("http-server").HttpServer,
		io			= require("./../io.js"),
		log 		= require("./../log.js")(__filename);

const WebAppServer = function () {};

WebAppServer.prototype.start = function (options) {
    this.httpServer = new HttpServer({
    	root: options.path
    });
    this.httpServer.listen(options.port);
	io.createSocketIoServer(this.httpServer.server);
    log.colors("magenta").info("The web app server is listening on the address: "
		+ this.httpServer.server.address().address + " and the port: " + this.httpServer.server.address().port);
};

module.exports = new WebAppServer();
