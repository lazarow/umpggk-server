const	sockets	= require("./../servers/sockets.js"),
		log 	= require("./../log.js")(__filename);

class SocketService
{
	write(socketId, message) {
		log.debug(message + " (" + sockets[socketId].remoteAddress + ")");
		setTimeout(function () {
			sockets[socketId].write(message + "\n")
		}, 5);
	}
}

module.exports = new SocketService();
