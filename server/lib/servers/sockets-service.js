const
    sockets	= require("./sockets.js");

class SocketsService
{
	getIp(socketId) {
		return sockets[socketId].remoteAddress;
	}
}

module.exports = new SocketsService();
