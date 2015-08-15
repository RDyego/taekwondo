var util = require('util'),
	actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
var moment = require('moment');

module.exports = {
	findRecordsToView: function (req, res, next, attributes) {
		var Model = actionUtil.parseModel(req);
		var where = {};
		//Filters
		var filterIsOpen = req.param('filterIsOpen');
		var name = req.param('nameFilter');
		var action = req.param('action');
		if (action == 'clear') {
			filterIsOpen = null;
		}
		//Filter, sort and paginate
		var hasValidity = req.param('validity')
		var limit = 2;
		var page = req.param('page') ? req.param('page') : 1;
		var sortBy = req.param('sortBy') ? req.param('sortBy') : 'name';
		var sortType = req.param('sortType') ? req.param('sortType') : 'ASC';

		if (filterIsOpen) {
			var checkIfFilterIsOpen = (filterIsOpen == true || filterIsOpen == 'true');
			if (checkIfFilterIsOpen) {
				if (name) {
					where = _.merge({ name: { 'like': '%' + name + '%' } }, where);
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