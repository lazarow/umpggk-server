const
    express         = require("express"),
	log 			= require("./../log.js")(__filename);

const AdminServer = function () {};

AdminServer.prototype.start = function (options) {
    const app = express();
	app.use(function (req, res, next) {
		if (options.token === req.query.token) {
			next();
		} else {
			res.status(403).send("The provided token is invalid or missing")
		}
	});
	app.get('/', (req, res) => res.send('Hello World!'))
	app.listen(options.port, () => log.info("The admin server is listening on port " + options.port));
};

module.exports = new AdminServer();
