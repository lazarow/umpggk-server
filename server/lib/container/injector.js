const	di          = require("node-di-container"),
    	container   = require("./../container/container.js"),
		log			= require("./../log.js")(__filename);

module.exports = di.injector(container);
log.debug("The DI injector has been created");
