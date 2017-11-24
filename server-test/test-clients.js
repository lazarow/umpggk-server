const
	net				= require("net"),
	config			= require("config"),
	log 			= require("./lib/log.js")(__filename),
	namesGenerator	= require("sillyname")
	args			= process.argv.slice(2),
	sleep			= require("sleep");

let
	numberOfClients	= 1,
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
	client.setNoDelay();
	client.connect(port, host, function() {
		log.info("The test client " + name + " has been connected to the server successfully");
		// Say Hi
		client.write("100 " + name);
	});
	client.on("data", function(data) {
		const message = data.toString("utf8");
		log.info(name, message);
		if (message.substr(0, 3) === "200") {
			log.info("The test client " + name + " has been sent a move");
			this.write("210 my new move");
		}
	});
	client.on("close", function() {
		log.info("The test client " + name + " has been disconnected");
	});
}
