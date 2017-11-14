const
    express         	= require("express"),
    tournamenRepository	= require('./../repositories/tournament-repository.js'),
	log 				= require("./../log.js")(__filename);
	cors				= require('cors')

const AdminServer = function () {};

AdminServer.prototype.start = function (options) {
    const app = express();
    app.use(cors());
	app.use(function (req, res, next) {
		if (options.token === req.query.token) {
			next();
		} else {
			res.status(403).send("The provided token is invalid or missing")
		}
	});
	
	app.get('/tournament/open-registration', (req, res) => {
		tournamenRepository.openRegistration();
		res.status(200).send("");
	});

	app.get('/tournament/close-registration', (req, res) => {
		tournamenRepository.closeRegistration();
		res.status(200).send("");
	});

	app.listen(options.port, () => log.info("The admin server is listening on port " + options.port));
};

module.exports = new AdminServer();
