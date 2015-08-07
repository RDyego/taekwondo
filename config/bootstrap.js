/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
  var userModel = {
    name: 'R. Dyego',
    email: 'dyego@gmail.com',
    password: 'asd',
    confirmation: 'asd'
  };

  User.findOneByEmail(userModel.email).exec(function (err, userFound) {
    if (err) return cb(err);
    if (!userFound) {
      User.create(userModel).exec(function (err, userCreated) {
        if (err) return cb(err);
        console.log('user created: ', userCreated);
      });
    }
  });
  
  /*
   for (var x = 0; x < 100; x++) {
     var name = "z" + x;
     Athlete.create({ name: name }).exec(function (err, athleteCreated) {
       if (err) return cb(err);
       //console.log('athlete created: ', athleteCreated);
     });
   }
   */
};
