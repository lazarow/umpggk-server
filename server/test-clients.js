const
	net				= require("net"),
	config			= require("config"),
	log 			= require("./lib/log.js")(__filename),
	namesGenerator	= require("sillyname"),
	gameStateHelper	= require("./lib/games/nogo/game-state-helper.js"),
	args			= process.argv.slice(2),
	names			= ["StudentA", "StudentB", "StudentC", "StudentD", "StudentE"];

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
		name 	= numberOfClients < 6 ? names[i] : namesGenerator().replace(" ", "");
	log.info(name + " has been created");
	client.connect(port, host, function() {
		log.info(name + " has been connected to the server successfully");
		// Say Hi
		client.write("100 " + name);
	});
	client.on("data", function(data) {
		const message = data.toString("utf8");
		log.info(name, message);
		if (message.substr(0, 3) === "200") {
			const parts = message.split(" ");
			this.state = gameStateHelper.getInitialState();
			this.color = parts[1];
			gameStateHelper.printState(this.state);
			if (this.color === "black") {
				const moves = gameStateHelper.getLegalMoves(this.state, this.color);
				if (moves.length > 0) {
					const move = moves[Math.floor(Math.random() * moves.length)];
					this.state = gameStateHelper.play(this.state, this.color, move.y, move.x);
					gameStateHelper.printState(this.state);
					client.write("210 " + (move.x + 1) + " " + (move.y + 1));
					log.info(name, "210 " + (move.x + 1) + " " + (move.y + 1));
				}
			}
			gameStateHelper.printState(this.state);
		}
		if (message.substr(0, 3) === "220") {
			const parts = message.split(" ");
			this.state = gameStateHelper.play(
				this.state,
				this.color === "black" ? "white" : "black",
				parseInt(parts[2]) - 1,
				parseInt(parts[1]) - 1
			);
			gameStateHelper.printState(this.state);
			const moves = gameStateHelper.getLegalMoves(this.state, this.color);
			if (moves.length > 0) {
				const move = moves[Math.floor(Math.random() * moves.length)];
				this.state = gameStateHelper.play(this.state, this.color, move.y, move.x);
				gameStateHelper.printState(this.state);
				client.write("210 " + (move.x + 1) + " " + (move.y + 1));
				log.info(name, "210 " + (move.x + 1) + " " + (move.y + 1));
			}
		}
	});
	client.on("close", function() {
		log.info(name + " has been disconnected");
	});
}
