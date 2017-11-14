const
    sockets	= require("./sockets.js");

class SocketsService
{
	getIp(socketId) {
		return sockets[socketId].remoteAddress;
	}
	send(socketId, message) {
		return sockets[socketId].write(message);
	}
}

module.exports = new SocketsService();
