const	di	= require("node-di-container"),
		log	= require("./../log.js")(__filename);

module.exports = di.container();
log.debug("The DI containter has been created");
