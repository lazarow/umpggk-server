const
	config  	= require("config"),
	ColorLogs 	= require("color-logs");
	
module.exports = function(filename) {
	const log = new ColorLogs(config.get("Log.isLogEnabled"), config.get("Log.isDebugEnabled"), filename);
	log._getDate = function(date) {
		let
			day = String("00" + date.getDate()).slice(-2),
			month = String("00" + date.getDate()).slice(-2),
			hours = String("00" + date.getHours()).slice(-2),
			minutes = String("00" + date.getMinutes()).slice(-2),
			seconds = String("00" + date.getSeconds()).slice(-2),
			milliseconds = String("000" + date.getMilliseconds()).slice(-3);
		return day +  "/" + month + "/" + date.getFullYear() + ' ' + hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
	};
	return log;
};
