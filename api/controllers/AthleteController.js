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
					totalPage: (countTotal / limit),
					currentPage: page
				});
			});
		});
	},

	create: function (req, res, next) {
		Athlete.create(req.params.all()).exec(function (err, athleteCreated) {
			if (err) return res.redirect('/athlete/new');
			res.redirect('/athlete/index');
		});
	}
};

