/**
 * AthleteController
 *
 * @description :: Server-side logic for managing athletes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'new': function (req, res, next) {
		res.view();
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
		var myAthleteQuery = Athlete.find();
		var moment = require('moment');	
		var limit = 10;
		var sortBy = req.param('sortBy') ? req.param('sortBy') : 'name';
		var sortType = req.param('sortType') ? req.param('sortType') : 'DESC';
		var page = req.param('page');
		page = page ? page : 1;
		
		myAthleteQuery.sort(sortBy + ' ' + sortType);
		
		myAthleteQuery.paginate({ page: page, limit: limit }).exec(function (err, athletesFound) {
			if (err) return next(err);
			Athlete.count().exec(function (err, countTotal) {
				if (err) return next(err);
				res.view({
					athletes: athletesFound,
					totalPage: Math.ceil(countTotal / limit),
					currentPage: page,
					model: 'athlete',
					moment: moment,
					sortBy: sortBy,
					sortType: sortType == 'DESC' ? 'ASC' : 'DESC'
				});
			});
		});
	},

	create: function (req, res, next) {

		res.setTimeout(0);

		Athlete.create(req.params.all()).exec(function (err, athleteCreated) {
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
			req.file('photo').upload({
				maxBytes: 500000, //500kb
				dirname: '../../assets/images/photo'
				//dirname: '../../assets/images/'
				//dirname: require('path').resolve(sails.config.appPath, '/assets/images/photo')
				//dirname: './.tmp/public/images/posts'
			}, function whenDone(err, uploadedFiles) {
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
						//photo: require('util').format('%s/images/%s', sails.getBaseUrl(), file)
						photo: require('util').format('%s/images/photo/%s', sails.getBaseUrl(), file)
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

	show: function (req, res, next) {
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
			res.view({ athlete: athleteFound });
		});
	},

	edit: function (req, res, next) {
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
			res.view({ athlete: athleteFound });
		});
	},

	update: function (req, res, next) {
		var athleteId = req.param('id');

		Athlete.update(athleteId, req.params.all(), function (err) {
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
			req.file('photo').upload({
				maxBytes: 500000, //500kb
				dirname: '../../assets/images/photo'
			}, function whenDone(err, uploadedFiles) {
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

					Athlete.update(athleteId, {
						photo: require('util').format('%s/images/photo/%s', sails.getBaseUrl(), file)
					}).exec(function (err) {
						if (err) {
							var updatePhotoAthleteError = [{
								name: 'updatePhotoAthleteError',
								message: 'update photo athlete error.'
							}];
							req.session.flash = {
								err: updatePhotoAthleteError
							}
							return res.redirect('/athlete/edit/' + athleteId);
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

