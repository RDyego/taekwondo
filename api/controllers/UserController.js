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
   		var Model = actionUtil.parseModel(req);		
		var where = {};
		//Filters
		var filterIsOpen = req.param('filterIsOpen');
		var name = req.param('nameFilter');
		var action = req.param('action');
		if(action == 'clear'){
			name = null;
			filterIsOpen = null;
		}
		//Filter, sort and paginate
		var hasValidity = req.param('validity')
		var limit = 2;
		var page = req.param('page');
		var hasPage = !!page;
		page = page ? page : 1;

		var sortBy = req.param('sortBy') ? req.param('sortBy') : 'name';
		var sortType = req.param('sortType') ? req.param('sortType') : 'ASC';
		
		if (filterIsOpen) {
			var value = (filterIsOpen == true || filterIsOpen == 'true');
			if (value) {
				if(name){
					where = _.merge({name: { 'like': '%'+name+'%' }}, where);
				}
			}
		}
		
		if (hasValidity) {
			var value = (hasValidity == true || hasValidity == 'true');
			var currentDate = new Date(moment().format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z');
			if (value) {
					where = _.merge({ validity: { '>=': currentDate }}, where);
			} else {
					where = _.merge({ validity: { '<': currentDate }}, where);
			}
		}
		
		var sort = {
			by: sortBy,
			'type': sortType,
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
		
		var myFind = {
			where: where,
			sort: sort,
			totalPage: 0,
			currentPage: page,
			model: req.options.model || req.options.controller,
			
		};
		
		//Model
		Model.find()
		.where(myFind.where)
		.paginate({ page: page, limit: limit })
		.sort(myFind.sort.by + ' ' + myFind.sort.type).exec(function (err, recordsFound) {
			if (err) return next(err);
			Model.count(myFind.where).exec(function (err, countTotal) {
				if (err) return next(err);
				myFind.totalPage = Math.ceil(countTotal / limit);
				res.view({
					records: recordsFound,
					moment: moment,
					myFind: myFind
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

