const	sockets	= require("./../servers/sockets.js");

class SocketService
{
	write(socketId, message) {
		return sockets[socketId].write(message);
	}
}

module.exports = new SocketService();
