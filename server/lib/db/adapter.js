const
    FileSync        = require("lowdb/adapters/FileSync"),
    fs              = require("graceful-fs"),
    injector        = require("./../container/injector.js"),
    writeFileSync   = fs.writeFileSync,
	log				= require("./../log.js")(__filename);

class Adapter extends FileSync
{
    constructor(source) {
        super(source);
        log.debug("The custom DB adapter based on FileSync has been created");
    }
    write(data) {
        return writeFileSync(this.source, this.serialize(data));
    }
}

module.exports = Adapter;
