var util = require('util'),
	actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
var moment = require('moment');

module.exports = {
	findRecordsToView: function (req, res, next, attributes) {
		var Model = actionUtil.parseModel(req);
		var where = {};
		//Filters
		var filterIsOpen = req.param('filterIsOpen');
		var nameFilter = req.param('nameFilter');
		var instructorFilter = req.param('instructorFilter');
		var graduationFilter = req.param('graduationFilter');
		var validityFilter = req.param('validityFilter');
		var action = req.param('action');
		if (action == 'clear') {
			filterIsOpen = null;
		}
		//Filter, sort and paginate
		var hasValidity = req.param('validity')
		var limit = 10;
		var page = req.param('page') ? req.param('page') : 1;
		var sortBy = req.param('sortBy') ? req.param('sortBy') : attributes[0].name;
		var sortType = req.param('sortType') ? req.param('sortType') : 'ASC';

		if (filterIsOpen) {
			var checkIfFilterIsOpen = (filterIsOpen == true || filterIsOpen == 'true');
			if (checkIfFilterIsOpen) {
				if (nameFilter) {
					where = _.merge({ name: { 'like': '%' + nameFilter + '%' } }, where);
				}
				if (instructorFilter) {
					where = _.merge({ instructorName: { 'like': '%' + instructorFilter + '%' } }, where);
				}
				if (graduationFilter) {
					where = _.merge({ graduation: { 'like': '%' + graduationFilter + '%' } }, where);
				}
				if (validityFilter) {
					var checkIfValidityValue = (validityFilter == true || validityFilter == 'true');
					var currentDate = new Date(moment().format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z');
					if (checkIfValidityValue) {
						where = _.merge({ validity: { '>=': currentDate } }, where);
					} else {
						where = _.merge({ validity: { '<': currentDate } }, where);
					}
				}
			}
		}
		
		if (hasValidity) {
			var value = (hasValidity == true || hasValidity == 'true');
			var currentDate = new Date(moment().format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z');
			if (value) {
				where = _.merge({ validity: { '>=': currentDate } }, where);
			} else {
				where = _.merge({ validity: { '<': currentDate } }, where);
			}
		}

		var sort = {
			by: sortBy,
			'type': sortType,
			attributes: attributes
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
	}
}