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
		var myUserQuery = User.find();
		var limit = 20;
		var page = req.param('page');
		var hasPage = !!page;
		page = page ? page : 1;

		var sortBy = req.param('sortBy') ? req.param('sortBy') : 'name';
		var sortType = req.param('sortType') ? req.param('sortType') : 'ASC';
		var sortAndPaginateViewModel = {
			totalPage: 0,
			currentPage: page,
			model: 'user',
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
			]
		};
		
		myUserQuery.sort(sortAndPaginateViewModel.sortBy + ' ' + sortAndPaginateViewModel.sortType);
		
		myUserQuery.paginate({ page: page, limit: limit }).exec(function (err, usersFound) {
			if (err) return next(err);
			User.count().exec(function (err, countTotal) {
				if (err) return next(err);
				sortAndPaginateViewModel.totalPage = Math.ceil(countTotal / limit);
				res.view({
					users: usersFound,
					sortAndPaginate: sortAndPaginateViewModel
				});
			});
		});
	},
	
	show: function (req, res, next) {
		var userId = req.param('id');
		User.findOne(userId).exec(function (err, userFound) {
			if (err) return next(err);
			if(!userFound) return next('User doesn\'t exist.');
			res.view({ user: userFound });
		});
	},
	
	edit: function (req, res, next) {
		var userId = req.param('id');
		User.findOne(userId).exec(function (err, userFound) {
			if (err) return next(err);
			if(!userFound) return next('User doesn\'t exist.');
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
			if(err) return res.redirect('/user/edit/'+userId);
			res.redirect('/user/show/'+userId);
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

