const	SocketIoServer	= require("socket.io"),
		db				= require("./database/db.js"),
		log 			= require("./log.js")(__filename);

const io = {
	server: null,
	createSocketIoServer(server) {
		this.server = new SocketIoServer(server);
		this.server.on("connection", function (socket) {
			socket.emit("database", db.value());
			log.debug("The new websocket connection from " + socket.remoteAddress);
	        socket.on("disconnect", function () {
    			log.debug("The websocket client " + socket.remoteAddress + " is disconnected");
	        });
	    });
	}
};

module.exports = io;
