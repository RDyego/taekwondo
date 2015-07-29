/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'new': function (req, res, next) {
		res.view();
	},

	index: function (req, res, next) {
		User.find({}).exec(function (err, usersFound) {
			if (err) return next(err);
			res.view({ users: usersFound });
		});
	},

	create: function (req, res, next) {
		var userViewModel = {
			name: req.param('name'),
			email: req.param('email'),
			password: req.param('password'),
			confirmation: req.param('confirmation')
		};

		User.create(userViewModel).exec(function (err, userCreated) {
			if (err) res.redirect('/user/new');
			res.redirect('/user/index');
		});
	}
};

