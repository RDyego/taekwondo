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
  var moment = require('moment');

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
  
  
  var athleteModel00 = {
    name: 'R. Dyego',
    graduation: 'Black 9th Dan',
    instructorName: 'R. Dyego',
    validity: new Date(moment().add(1, 'years').format('MM/DD/YYYY'))
  };
  
  var athleteModel01 = {
    name: 'Charles W.',
    graduation: 'Black 1st Dan',
    instructorName: 'Sensei',
    validity: new Date(moment().add(1, 'years').format('MM/DD/YYYY'))
  };
  
  var athleteModel02 = {
    name: 'C. Marilia',
    graduation: 'White',
    instructorName: 'Sensei',
    validity: new Date(moment().add(1, 'years').format('MM/DD/YYYY'))
  };
  
  var athleteModel03 = {
    name: 'Blablabla',
    graduation: 'Orange',
    instructorName: 'Sensei',
    validity: new Date(moment().add(-2, 'years').format('MM/DD/YYYY'))
  };
  
  var athleteModel04 = {
    name: 'Urru',
    graduation: 'Purple',
    instructorName: 'Sensei',
    validity: new Date(moment().add(-2, 'years').format('MM/DD/YYYY'))
  };
  
  Athlete.findOneByName(athleteModel00.name).exec(function (err, athleteFound) {
    if (err) return cb(err);
    if (!athleteFound) {
      Athlete.create(athleteModel00).exec(function (err, athleteCreated) {
        if (err) return cb(err);
        //console.log('athlete created: ', athleteCreated);
      });
    }
  });
  
  Athlete.findOneByName(athleteModel01.name).exec(function (err, athleteFound) {
    if (err) return cb(err);
    if (!athleteFound) {
      Athlete.create(athleteModel01).exec(function (err, athleteCreated) {
        if (err) return cb(err);
        //console.log('athlete created: ', athleteCreated);
      });
    }
  });
  
  Athlete.findOneByName(athleteModel02.name).exec(function (err, athleteFound) {
    if (err) return cb(err);
    if (!athleteFound) {
      Athlete.create(athleteModel02).exec(function (err, athleteCreated) {
        if (err) return cb(err);
        //console.log('athlete created: ', athleteCreated);
      });
    }
  });
  
  Athlete.findOneByName(athleteModel03.name).exec(function (err, athleteFound) {
    if (err) return cb(err);
    if (!athleteFound) {
      Athlete.create(athleteModel03).exec(function (err, athleteCreated) {
        if (err) return cb(err);
        //console.log('athlete created: ', athleteCreated);
      });
    }
  });
  
  Athlete.findOneByName(athleteModel04.name).exec(function (err, athleteFound) {
    if (err) return cb(err);
    if (!athleteFound) {
      Athlete.create(athleteModel04).exec(function (err, athleteCreated) {
        if (err) return cb(err);
        //console.log('athlete created: ', athleteCreated);
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
