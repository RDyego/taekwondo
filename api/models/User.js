/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var userBaseModel = require('../services/baseModels/userBaseModel');

module.exports = _.merge(userBaseModel, {
  scheme: true,
  attributes: {
    encryptedPassword: {
      type: 'string'
    },

    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      delete obj.confirmation;
      delete obj.encryptedPassword;
      delete obj._csrf;
      return obj;
    }
  },
  beforeCreate: function (values, next) {
    // This checks to make sure the password and confirmation match before creating record
    if (!values.password || values.password != values.confirmation) {
      return next({ err: ["Password doesn't match password confirmation."] });
    }
    require('bcryptjs').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword) {
      if (err) return next(err);
      values.encryptedPassword = encryptedPassword;
      next();
    });
  }
});
