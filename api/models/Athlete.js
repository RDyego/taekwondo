/**
* Athlete.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  scheme: true,
  attributes: {
    registerNumber: {
      type: 'integer',
      autoIncrement: true
    },
    name: {
      type: 'string',
      required: true,
      size: 50
    },
    email: {
      type: 'email',
      //required: true,
      unique: true,
      size: 50
    },
    fatherName: {
      type: 'string',
      size: 50
    },
    motherName: {
      type: 'string',
      size: 50
    },
    address: {
      type: 'string',
      size: 90
    },
    cep: {
      type: 'string',
      size: 27
    },
    photo: {
      type: 'string',
      size: 200
    },
    phone: {
      type: 'string',
      size: 27
    },
    bday: {
      type: 'date'
    },
    rg: {
      type: 'string',
      size: 27
    },
    naturalness: {
      type: 'string',
      size: 27
    },
    nationality: {
      type: 'string',
      size: 27
    },
    profession: {
      type: 'string',
      size: 50
    },
    businessAddress: {
      type: 'string',
      size: 90
    },
    education: {
      type: 'string',
      enum: ['Primary', 'Secondary', 'Superior']
    },
    cpf: {
      type: 'string',
      size: 27
    },
    graduation: {
      type: 'string',
      enum: ['White', 'Gray', 'Yellow', 'Orange', 'Green', 'Purple', 'Blue', 'Brown', 'Red', 'Red/Black', 'Black 1st Dan', 'Black 2nd Dan', 'Black 3rd Dan', 'Black 4th Dan', 'Black 4th Dan', 'Black 5th Dan', 'Black 6th Dan', 'Black 7th Dan', 'Black 8th Dan', 'Black 9th Dan']
    },
    dateStarted: {
      type: 'date'
    },
    instructorName: {
      type: 'string',
      size: 50
    },
    associationName: {
      type: 'string',
      size: 50
    },
    bloodGroup: {
      type: 'string',
      enum: ['A', 'B', 'O', 'AB', '-']
    },
    rhFactor: {
      type: 'string',
      enum: ['Positive', 'Negative']
    },
    validity: {
      type: 'date'
    },
    validityFrom: {
      type: 'date'
    },
    validityTo: {
      type: 'date'
    },
  },
    beforeCreate: function(athlete, next){
        Athlete.find({}).sort({ "registerNumber": -1 }).limit(1).exec(function(err, recordFound) {
            if (err) return next(err);
            var newRegisterNumber = recordFound[0].registerNumber + 1;
            if(!athlete['registerNumber']){
                athlete['registerNumber'] = newRegisterNumber++;
                console.log(athlete['registerNumber']);
                console.log('athlete created: ', athlete['name']);
            }
            next();
        });
    },
    //model validation messages definitions
    validationMessages: { //hand for i18n & l10n
        email: {
            required: 'Email is required',
            email: 'Provide valid email address',
            unique: 'Email address is already taken'
        },
        name: {
            required: 'Name is required',
        }
    }
};