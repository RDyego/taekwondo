/**
 * AthleteController
 *
 * @description :: Server-side logic for managing athletes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var util = require('util');
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
var moment = require('moment');

module.exports = {
	'new': function (req, res, next) {
		res.view({ moment: moment });
	},

	index: function (req, res, next) {
		var attributesToBeSorted = [
			{
				name: 'name',
				sortable: true
			},
			{
				name: 'graduation',
				sortable: true
			},
		];
		MyFind.findRecordsToView(req, res, next, attributesToBeSorted);
	},

	create: function (req, res, next) {
		var viewModel = req.params.all();
		
		/** INIT - Needs improvement */
		if (viewModel.bday) {
			var d = viewModel.bday.split('/');
			viewModel.bday = d[1] + '/' + d[0] + '/' + d[2];

		}
		if (viewModel.validity) {
			var d = viewModel.validity.split('/');
			viewModel.validity = d[1] + '/' + d[0] + '/' + d[2];

		}
		if (viewModel.dateStarted) {
			var d = viewModel.dateStarted.split('/');
			viewModel.dateStarted = d[1] + '/' + d[0] + '/' + d[2];

		}
		/** END - Needs improvement */

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

			var receiving = BlobAdapterService.blobAdapter().receive();

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
						
						console.log('if');
						var athleteCreatedWithPhotoSuccess = [{
							name: 'athleteCreatedWithPhotoSuccess',
							message: 'athlete created with photo Successfull.'
						}];
						
						req.session.flash = {
							success: athleteCreatedWithPhotoSuccess
						}
						res.redirect('/athlete/new');
					});
				}else{
					console.log('else');
					var athleteCreatedWithoutPhotoSuccess = [{
						name: 'athleteCreatedWithoutPhotoSuccess',
						message: 'athlete created without photo Successfull.'
					}];
					
					req.session.flash = {
						success: athleteCreatedWithoutPhotoSuccess
					}
					res.redirect('/athlete/new');
				}
			});
		});
	},

	showPhotoByFd: function (req, res, next) {
		req.validate({
			id: 'string'
		});

		var blobAdapter = BlobAdapterService.blobAdapter();

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
			res.view({ athlete: athleteFound, moment: moment });
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
			res.view({ athlete: athleteFound, moment: moment });
		});
	},

	update: function (req, res, next) {
        console.log('update 1');
		var athleteId = req.param('id');
		var viewModel = req.params.all();
		
        console.log('update 2');
		/** INIT - Needs improvement */
		if (viewModel.bday) {
			var d = viewModel.bday.split('/');
			viewModel.bday = d[1] + '/' + d[0] + '/' + d[2];

		}
		if (viewModel.validity) {
			var d = viewModel.validity.split('/');
			viewModel.validity = d[1] + '/' + d[0] + '/' + d[2];

		}
		if (viewModel.dateStarted) {
			var d = viewModel.dateStarted.split('/');
			viewModel.dateStarted = d[1] + '/' + d[0] + '/' + d[2];
		}
        console.log('update 3');
		/** END - Needs improvement */

		Athlete.update(athleteId, viewModel, function (err) {
            
        console.log('update 4');
			if (err) {
        console.log('update 5');
				var error = [{
					name: 'updateAthleteError',
					message: 'update athlete error.'
				}];
				req.session.flash = {
					err: error
				}
        console.log('update 6');
				return res.redirect('/athlete/edit/' + athleteId);
			}

        console.log('update 7');
			var receiving = BlobAdapterService.blobAdapter().receive();

        console.log('update 8');
			req.file('photo').upload(receiving, function whenDone(err, uploadedFiles) {
        console.log('update 9');
				if (err) {
        console.log('update 10');
					var fileUploadError = [{
						name: 'fileUploadError',
						message: 'file upload error.'
					}];
					req.session.flash = {
						err: fileUploadError
					}
					return res.redirect('/athlete/edit/' + athleteId);
				}
        console.log('update 11');
				var test = true;
				if (uploadedFiles.length != 0) {
        console.log('update 12');
					test = false;
					var path = require('path');
					var file = path.basename(uploadedFiles[0].fd);

        console.log('update 13');
					Athlete.update(athleteId, { photo: file }).exec(function (err) {
        console.log('update 14');
						if (err) {
        console.log('update 15');
							var updatePhotoAthleteError = [{
								name: 'updatePhotoAthleteError',
								message: 'update photo athlete error.'
							}];
							req.session.flash = {
								err: updatePhotoAthleteError
							}
							return res.redirect('/athlete/index');
						}
        console.log('update 16');
						return res.redirect('/athlete/index');
					});
				}
				if(test){
        console.log('update 17');
					res.redirect('/athlete/index');
				}
			});
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
	},

	updateValidity: function (req, res, next) {
		var athleteId = req.param('id');
		var viewModel = { validity: new Date(moment().add(1, 'years').format('MM/DD/YYYY')) };

		Athlete.update(athleteId, viewModel, function (err) {
			if (err) {
				var error = [{
					name: 'updateValidityAthleteError',
					message: 'update validity athlete error.'
				}];
				req.session.flash = {
					err: error
				}
			}
			res.redirect('/athlete/index');
		});
	}
};

