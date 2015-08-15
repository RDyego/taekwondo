var util = require('util'),
  actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
var moment = require('moment');
  
module.exports = {
  findRecords: function (req, res) {
     // Look up the model
    var Model = actionUtil.parseModel(req);
  
    // Lookup for records that match the specified criteria
    var page = req.options.page ? req.options.page : 1;
    var query = Model.find()
    .where( actionUtil.parseCriteria(req) )
    .paginate({ page: page, limit: actionUtil.parseLimit(req) })
    .sort( actionUtil.parseSort(req) );
  
  
    // TODO: .populateEach(req.options);
    query = actionUtil.populateEach(query, req);
    query.exec(function found(err, matchingRecords) {
      if (err) return res.serverError(err);
  
      // Only `.watch()` for new instances of the model if
      // `autoWatch` is enabled.
      if (req._sails.hooks.pubsub && req.isSocket) {
        Model.subscribe(req, matchingRecords);
        if (req.options.autoWatch) { Model.watch(req); }
        // Also subscribe to instances of all associated models
        _.each(matchingRecords, function (record) {
          actionUtil.subscribeDeep(req, record);
        });
      }
  
      // get pagination info and wrap results in struct
  
      var metaInfo,
          criteria = actionUtil.parseCriteria(req),
          skip = actionUtil.parseSkip(req),
          limit = actionUtil.parseLimit(req),
          model = req.options.model || req.options.controller;
      
      Model.count(criteria)
        .exec(function(err, total){
        if (err) return res.serverError(err);
        
        metaInfo = {
          start : skip,
          end : skip + limit,
          limit : limit,
          currentPage : page,
          totalPages : Math.ceil(total / limit),
          model: model,
          totalItems : total,
          criteria: criteria
        };
        return res.ok(matchingRecords);
        res.view({
					athletes: matchingRecords,
					info: metaInfo,
					moment: moment,
				});
  
      });
    });
  }
}