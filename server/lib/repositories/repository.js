const	db	= require("./../database/db.js");

function *createGenerator() {
    let id = 0;
    while (true) {
        yield id++;
    }
}

class Repository
{
    constructor(collection) {
		this._ = db._;
		this._db = db;
		this._collection = collection || "place-here-the-collection-name";
		this.idGenerator = createGenerator();
	}
	db(collection) {
        this._db.collection = collection || this._collection;
        return this._db;
    }
	collection() {
		return this.db().get(this._collection);
	}
}

module.exports = Repository;
