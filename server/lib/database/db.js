const
	fs			= require("fs"),
	FileSync	= require("lowdb/adapters/FileSync"),
	config		= require("config"),
	low			= require("lowdb")
	io			= require("./../io.js"),
	log			= require("./../log.js")(__filename);

function generateFilename() {
	const currentDate = new Date();
	return currentDate.getFullYear()
		+ "-" + String("00" + (currentDate.getMonth() + 1)).slice(-2)
		+ "-" + String("00" + currentDate.getDate()).slice(-2)
		+ "-" + String("00" + currentDate.getHours()).slice(-2)
		+ "-" + String("00" + currentDate.getMinutes()).slice(-2)
		+ "-" + String("00" + currentDate.getSeconds()).slice(-2)
		+ "-" + String("000" + currentDate.getMilliseconds()).slice(-3)
		+ ".json";
}

const
 	adapter	= new FileSync(config.get("Database").path + generateFilename()),
	db		= low(adapter);

/* A collection denotes a key for socket.io emitting and a name in the database json */
db.collection = null;

/* Auto-emitting changes */
db._.prototype.write = db._.wrap(db._.prototype.value, function (func) {
	const
		current     = db.get(db.collection).value(),
		keys        = current != undefined ? Object.keys(current) : [],
		result      = func.apply(this),
		data     	= {collection: null, action: null, data: null};
	if (Array.isArray(result)) {
		const inserted = db._.difference(Object.keys(result), keys);
		if (inserted.length > 0) {
			data.action = "insert";
			data.data = result[inserted[0]];
		} else {
			const deleted = db._.difference(keys, Object.keys(result));
			if (deleted.length > 0) {
				data.action = "delete";
				data.data = deleted[0];
			}
		}
	} else {
		data.action = "update";
		data.data = result;
	}
	data.collection = db.collection;
	if (io.server !== null) {
		io.server.emit(db.collection, data);
	}
	log.debug("[" + db.collection + "] The data has been emitted", data);
	return db.write(result);
});

db.createEmptyDatabase = function () {
    db.collection = "database";
    db.defaults(config.get("EmptyDatabase")).write();
};

db.loadExistedDatabase = function (filepath) {
	const database = db._.assign(
		JSON.parse(fs.readFileSync(filepath, "utf8")),
		{
			reloadedAt: (new Date()).getTime()
		}
	);
    db.collection = "database";
    db.defaults(database).write();
};

module.exports = db;
