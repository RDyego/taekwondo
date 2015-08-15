/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var util = require('util');
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
var moment = require('moment');

module.exports = {
	'new': function (req, res, next) {
		res.view();
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
	},

	index: function (req, res, next) {
		var attributesToBeSorted = [
			{
				name: 'name',
				sortable: true
			},
			{
				name: 'email',
				sortable: true
			},
		];
		MyFind.findRecordsToView(req, res, next, attributesToBeSorted);
	},

	show: function (req, res, next) {
		var userId = req.param('id');
		User.findOne(userId).exec(function (err, userFound) {
			if (err) return next(err);
			if (!userFound) return next('User doesn\'t exist.');
			res.view({ user: userFound });
		});
	},

	edit: function (req, res, next) {
		var userId = req.param('id');
		User.findOne(userId).exec(function (err, userFound) {
			if (err) return next(err);
			if (!userFound) return next('User doesn\'t exist.');
			res.view({ user: userFound });
		});
	},

	update: function (req, res, next) {
		var userId = req.param('id');
		var userViewModel = {
			name: req.param('name'),
			email: req.param('email')
		};
		User.update(userId, userViewModel).exec(function (err) {
			if (err) return res.redirect('/user/edit/' + userId);
			res.redirect('/user/show/' + userId);
		});
	},

	destroy: function (req, res, next) {
		var userId = req.param('id');
		User.findOne(userId).exec(function (err, userFound) {
			if (err) return next(err);
			if (!userFound) return next('User doesn\'t exist.');
			User.destroy(userId).exec(function (err) {
				if (err) return next(err);
			});
			res.redirect('/user');
		});
	}
};

