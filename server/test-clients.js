const
	net				= require("net"),
	config			= require("config"),
	log 			= require("./lib/log.js")(__filename),
	namesGenerator	= require('sillyname')
	args			= process.argv.slice(2);

let
	numberOfClients	= 4,
	host			= "127.0.0.1",
	port			= config.get("TournamentServer").port,
	clients			= [];

if (typeof args[0] !== "undefined") {
	numberOfClients = parseInt(args[0]);
}
if (typeof args[1] !== "undefined") {
	host = args[1];
}
if (typeof args[2] !== "undefined") {
	port = args[2];
}

for (let i = 0; i < numberOfClients; ++i) {
	let
		client	= new net.Socket(),
		name 	= namesGenerator().replace(" ", "");
	log.info("The test client " + name + " has been created");
	client.connect(port, host, function() {
		log.info("The test client " + name + " has been connected to the server successfully");
		// Say Hi
		client.write("100 " + name);
	});
	client.on("data", function(data) {
		log.info("The test client " + name + " has been received the data", data.toString("utf8"));
	});
	client.on("close", function() {
		log.info("The test client " + name + " has been disconnected");
	});
}
