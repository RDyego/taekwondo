module.exports = {
	blobAdapter: function () {
		var db;
		var uriMongo;

		if (sails.config.environment === 'production') {
			db = sails.config.connections.production;
			uriMongo = db.url;
		} else {
			db = sails.config.connections.someMongodbServer;
			uriMongo = 'mongodb://';
			uriMongo += db.username ? db.username + ':' : '';
			uriMongo += db.password ? db.password + '@' : '';
			uriMongo += db.host + ':' + db.port;
			uriMongo += '/' + db.database;
		}

		var blobAdapter = require('skipper-gridfs')({
			maxBytes: 500000*4, //500kb x 4 = 2mb
			uri: uriMongo + '.photo'
		});

		return blobAdapter;
	}
}