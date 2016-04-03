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

module.exports.bootstrap = function(cb) {
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

    Athlete.find().exec(function(err, records) {
        if (err) return cb(err);
        var count = 0;
        if (records) {
            _.each(records, function(athlete) {
                var viewModel = {
                    validityFrom: moment(athlete.validity).add(-1, 'years').format('DD/MM/YYYY'),
                    validityTo: moment(athlete.validity).format('DD/MM/YYYY')
                };
                if (viewModel.validityFrom) {
                    var d = viewModel.validityFrom.split('/');
                    viewModel.validityFrom = d[1] + '/' + d[0] + '/' + d[2];

                }
                if (viewModel.validityTo) {
                    var d = viewModel.validityTo.split('/');
                    viewModel.validityTo = d[1] + '/' + d[0] + '/' + d[2];

                }
                console.log(viewModel);
                Athlete.update(athlete.id, viewModel).exec(function(err) {
                    if (err) return cb(err);
                    console.log(count++ + ' athlete updated: ', athlete.name);
                });
            });
        }
    });

    /*
    User.findOneByEmail(userModel.email).exec(function (err, userFound) {
      if (err) return cb(err);
      if (!userFound) {
        User.create(userModel).exec(function (err, userCreated) {
          if (err) return cb(err);
          console.log('user created: ', userCreated);
        });
      }
    });
    */

    var athleteModel00 = {
        name: 'R. Dyego',
        email: 'r.dyego@gmail.com',
        graduation: 'Black 9th Dan',
        instructorName: 'R. Dyego',
        validity: new Date(moment().add(1, 'years').format('MM/DD/YYYY'))
    };

    var athleteModel01 = {
        name: 'Charles W.',
        email: 'charles.w@gmail.com',
        graduation: 'Black 1st Dan',
        instructorName: 'Sensei',
        validity: new Date(moment().add(1, 'years').format('MM/DD/YYYY'))
    };

    var athleteModel02 = {
        name: 'C. Marilia',
        email: 'c.marilia@gmail.com',
        graduation: 'White',
        instructorName: 'Sensei',
        validity: new Date(moment().add(1, 'years').format('MM/DD/YYYY'))
    };

    var athleteModel03 = {
        name: 'Blablabla',
        email: 'blablabla@gmail.com',
        graduation: 'Orange',
        instructorName: 'Sensei',
        validity: new Date(moment().add(-2, 'years').format('MM/DD/YYYY'))
    };

    var athleteModel04 = {
        name: 'Urru',
        email: 'urru@gmail.com',
        graduation: 'Purple',
        instructorName: 'Sensei',
        validity: new Date(moment().add(-2, 'years').format('MM/DD/YYYY'))
    };

    var athleteModel05 = {
        name: 'Nome Grande bALd ansda sda sdiAISHD AISJD Adasdasd',
        email: 'nomegrande@gmail.com',
        graduation: 'Yellow',
        instructorName: 'Sensei',
        validity: new Date(moment().add(-2, 'years').format('MM/DD/YYYY'))
    };

    /*
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
    
    Athlete.findOneByName(athleteModel05.name).exec(function (err, athleteFound) {
      if (err) return cb(err);
      if (!athleteFound) {
        Athlete.create(athleteModel05).exec(function (err, athleteCreated) {
          if (err) return cb(err);
          //console.log('athlete created: ', athleteCreated);
        });
      }
    });
    */
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
