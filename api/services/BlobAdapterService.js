module.exports = {
	blobAdapter: function () {
		var db = sails.config.connections.someMongodbServer;
		
		var uriMongo = 'mongodb://';
		uriMongo += db.username ? db.username + ':' : '';
		uriMongo += db.password ? db.password + '@' : '';
		uriMongo += db.host + ':' + db.port;
		uriMongo += '/' + db.database;

		var blobAdapter = require('skipper-gridfs')({
			maxBytes: 500000, //500kb
			uri: uriMongo + '.photo'
		});
		
		return blobAdapter;
	}
}