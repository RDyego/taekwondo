/**
 * AthleteController
 *
 * @description :: Server-side logic for managing athletes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'new': function (req, res, next) {
		var moment = require('moment');
		res.view({ moment: moment });
	},
	
	/*
	countTotal: function (req, res, next) {
		Athlete.count().exec(function (err, countTotal) {
			if (err) return next(err);
			return countTotal;
		});
	},
	*/

	index: function (req, res, next) {
		var moment = require('moment');
		var myAthleteQuery = Athlete.find();
		var limit = 20;
		var page = req.param('page');
		var hasPage = !!page;
		page = page ? page : 1;

		var sortBy = req.param('sortBy') ? req.param('sortBy') : 'name';
		var sortType = req.param('sortType') ? req.param('sortType') : 'ASC';
		var sortAndPaginateViewModel = {
			totalPage: 0,
			currentPage: page,
			model: 'athlete',
			sortBy: sortBy,
			sortType: (hasPage ? sortType : (sortType == 'DESC' ? 'ASC' : 'DESC')),
			attributes: [
				{
					name: 'name',
					sortable: true
				},
				{
					name: 'email',
					sortable: true
				},
				{
					name: 'graduation',
					sortable: true
				},
				{
					name: 'instructorName',
					sortable: true
				},
			]
		};

		myAthleteQuery.sort(sortAndPaginateViewModel.sortBy + ' ' + sortAndPaginateViewModel.sortType);

		myAthleteQuery.paginate({ page: page, limit: limit }).exec(function (err, athletesFound) {
			if (err) return next(err);
			Athlete.count().exec(function (err, countTotal) {
				if (err) return next(err);
				sortAndPaginateViewModel.totalPage = Math.ceil(countTotal / limit);
				res.view({
					athletes: athletesFound,
					moment: moment,
					sortAndPaginate: sortAndPaginateViewModel
				});
			});
		});
	},

	create: function (req, res, next) {
		var moment = require('moment');
		var viewModel = req.params.all();
		if(viewModel.bday){
			var d = viewModel.bday.split('/');   
			viewModel.bday = d[1] +'/'+ d[0] +'/'+ d[2];
			
		}
		if(viewModel.validity){
			var d = viewModel.validity.split('/');   
			viewModel.validity = d[1] +'/'+ d[0] +'/'+ d[2];
			
		}
		if(viewModel.dateStarted){
			var d = viewModel.dateStarted.split('/');   
			viewModel.dateStarted = d[1] +'/'+ d[0] +'/'+ d[2];
			
		}
		Athlete.create(viewModel).exec(function (err, athleteCreated) {
			if (err) {
				var createNewAthleteError = [{
					name: 'createNewAthleteError',
					message: 'create new athlete error.'
				}];
				req.session.flash = {
					err: createNewAthleteError
				}
				return res.redirect('/athlete/new');
			}

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
			var receiving = blobAdapter.receive();
			req.file('photo').upload(receiving, function whenDone(err, uploadedFiles) {
				if (err) {
					var fileUploadError = [{
						name: 'fileUploadError',
						message: 'file upload error.'
					}];
					req.session.flash = {
						err: fileUploadError
					}
					return res.redirect('/athlete/new');
				}
				if (uploadedFiles.length != 0) {
					var path = require('path');
					var file = path.basename(uploadedFiles[0].fd);

					Athlete.update(athleteCreated.id, {
						photo: file //require('util').format('%s/images/photo/%s', sails.getBaseUrl(), file)
					}).exec(function (err) {
						if (err) {
							var updatePhotoAthleteError = [{
								name: 'updatePhotoAthleteError',
								message: 'update photo athlete error.'
							}];
							req.session.flash = {
								err: updatePhotoAthleteError
							}
							return res.redirect('/athlete/new');
						}
					});
				}
			});
			res.redirect('/athlete/index');
		});
	},

	showPhotoByFd: function (req, res, next) {
		req.validate({
			id: 'string'
		});
		var db = sails.config.connections.someMongodbServer;
		var uriMongo = 'mongodb://';
		uriMongo += db.username ? db.username + ':' : '';
		uriMongo += db.password ? db.password + '@' : '';
		uriMongo += db.host + ':' + db.port;
		uriMongo += '/' + db.database;

		var blobAdapter = require('skipper-gridfs')({
			uri: uriMongo + '.photo'
		});

		var fd = req.param('id');
		blobAdapter.read(fd, function (err, file) {
			if (err) {
				var error = [{
					name: 'showPhotoByFdError',
					message: 'show photo by fd error.'
				}];
				req.session.flash = {
					err: error
				}
				return res.redirect('/athlete/index');
			} else {
				if (file) {
					res.contentType('image/png');
					res.send(new Buffer(file));
				}
			}
		});
	},

	show: function (req, res, next) {
		var moment = require('moment');
		var athleteId = req.param('id');
		Athlete.findOne(athleteId).exec(function (err, athleteFound) {
			if (err) {
				var error = [{
					name: 'showAthleteError',
					message: 'show athlete error.'
				}];
				req.session.flash = {
					err: error
				}
				return res.redirect('/athlete/index');
			}
			if (!athleteFound) {
				var error = [{
					name: 'showNotFoundAthleteError',
					message: 'Athlete doesn\'t exist.'
				}];
				req.session.flash = {
					err: error
				}
				return res.redirect('/athlete/index');
			}
			res.view({ athlete: athleteFound, moment: moment});
		});
	},

	edit: function (req, res, next) {
		var moment = require('moment');
		var athleteId = req.param('id');
		Athlete.findOne(athleteId).exec(function (err, athleteFound) {
			if (err) {
				var error = [{
					name: 'editAthleteError',
					message: 'show athlete error.'
				}];
				req.session.flash = {
					err: error
				}
				return res.redirect('/athlete/index');
			}
			if (!athleteFound) {
				var error = [{
					name: 'editNotFoundAthleteError',
					message: 'Athlete doesn\'t exist.'
				}];
				req.session.flash = {
					err: error
				}
				return res.redirect('/athlete/index');
			}
			res.view({ athlete: athleteFound, moment: moment });
		});
	},

	update: function (req, res, next) {
		var athleteId = req.param('id');
		var viewModel = req.params.all();
		if(viewModel.bday){
			var d = viewModel.bday.split('/');   
			viewModel.bday = d[1] +'/'+ d[0] +'/'+ d[2];
			
		}
		if(viewModel.validity){
			var d = viewModel.validity.split('/');   
			viewModel.validity = d[1] +'/'+ d[0] +'/'+ d[2];
			
		}
		if(viewModel.dateStarted){
			var d = viewModel.dateStarted.split('/');   
			viewModel.dateStarted = d[1] +'/'+ d[0] +'/'+ d[2];
		}

		Athlete.update(athleteId, viewModel, function (err) {
			if (err) {
				var error = [{
					name: 'updateAthleteError',
					message: 'update athlete error.'
				}];
				req.session.flash = {
					err: error
				}
				return res.redirect('/athlete/edit/' + athleteId);
			}

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
			var receiving = blobAdapter.receive();
			req.file('photo').upload(receiving, function whenDone(err, uploadedFiles) {
				if (err) {
					var fileUploadError = [{
						name: 'fileUploadError',
						message: 'file upload error.'
					}];
					req.session.flash = {
						err: fileUploadError
					}
					return res.redirect('/athlete/edit/' + athleteId);
				}
				if (uploadedFiles.length != 0) {
					var path = require('path');
					var file = path.basename(uploadedFiles[0].fd);

					Athlete.update(athleteId, { photo: file }).exec(function (err) {
						if (err) {
							var updatePhotoAthleteError = [{
								name: 'updatePhotoAthleteError',
								message: 'update photo athlete error.'
							}];
							req.session.flash = {
								err: updatePhotoAthleteError
							}
							return res.redirect('/athlete/index');
						}
					});
				}
			});
			res.redirect('/athlete/index');
		});
	},

	destroy: function (req, res, next) {
		var athleteId = req.param('id');
		Athlete.findOne(athleteId).exec(function (err, athleteFound) {
			if (err) {
				var error = [{
					name: 'deleteFindAthleteError',
					message: 'show athlete error.'
				}];
				req.session.flash = {
					err: error
				}
				return res.redirect('/athlete/index');
			}
			if (!athleteFound) {
				var error = [{
					name: 'deleteNotFoundAthleteError',
					message: 'Athlete doesn\'t exist.'
				}];
				req.session.flash = {
					err: error
				}
				return res.redirect('/athlete/index');
			}
			Athlete.destroy(athleteFound.id).exec(function (err) {
				if (err) {
					var error = [{
						name: 'deleteAthleteError',
						message: 'show athlete error.'
					}];
					req.session.flash = {
						err: error
					}
				}
			});
			res.redirect('/athlete');
		});
	}
};

