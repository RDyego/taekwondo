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
		var limit = 2;
		var page = req.param('page');
		page = page ? page : 1;
		Athlete.find({}).paginate({ page: page, limit: limit }).exec(function (err, athletesFound) {
			if (err) return next(err);
			Athlete.count().exec(function (err, countTotal) {
				if (err) return next(err);
				res.view({
					athletes: athletesFound,
					totalPage: Math.ceil(countTotal / limit),
					currentPage: page,
					model: 'athlete'
				});
			});
		});
	},

	create: function (req, res, next) {

		res.setTimeout(0);

		req.file('photo')
			.upload({
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
					return res.redirect('/athlete/new');
				}
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
					res.redirect('/athlete/index');
				});
			});
	}
};

