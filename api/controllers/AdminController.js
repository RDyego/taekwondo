/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'new': function (req, res, next) {
		res.view();
	},

	index: function (req, res, next) {
		Admin.find({}).exec(function (err, usersFound) {
			if (err) return next(err);
			res.view({ users: usersFound });
		});
	},

	create: function (req, res, next) {
		var adminViewModel = {
			name: req.param('name'),
			email: req.param('email'),
			password: req.param('password'),
			confirmation: req.param('confirmation')
		};

		Admin.create(adminViewModel).exec(function (err, userCreated) {
			if (err) res.redirect('/admin/new');
			res.redirect('/admin/index');
		});
	}
};
