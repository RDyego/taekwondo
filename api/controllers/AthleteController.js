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

	index: function (req, res, next) {
		Athlete.find({}).exec(function (err, athletesFound) {
			if (err) return next(err);
			res.view({ athletes: athletesFound });
		});
	},

	create: function (req, res, next) {
		var athleteViewModel = {
			name: req.param('name'),
			email: req.param('email'),
		};

		Athlete.create(athleteViewModel).exec(function (err, athleteCreated) {
			if (err) res.redirect('/athlete/new');
			res.redirect('/athlete/index');
		});
	}
};

