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
      size: 100
    },
    email: {
      type: 'email',
      //required: true,
      //unique: true,
      size: 100
    },
    fatherName: {
      type: 'string',
      size: 100
    },
    motherName: {
      type: 'string',
      size: 100
    },
    address: {
      type: 'string',
      size: 100
    },
    cep: {
      type: 'string',
      size: 100
    },
    photo: {
      type: 'string',
      size: 100
    },
    phone: {
      type: 'string',
      size: 100
    },
    bday: {
      type: 'date'
    },
    rg: {
      type: 'string',
      size: 100
    },
    naturalness: {
      type: 'string',
      size: 100
    },
    nationality: {
      type: 'string',
      size: 100
    },
    profession: {
      type: 'string',
      size: 100
    },
    businessAddress: {
      type: 'string',
      size: 100
    },
    education: {
      type: 'string',
      enum: ['Primary', 'Secondary', 'Superior']
    },
    cpf: {
      type: 'string',
      size: 100
    },
    graduation: {
      type: 'string',
      enum: ['White', 'Yellow', 'Orange', 'Light Blue', 'Green', 'Purple', 'Dark Blue', 'Brown', 'Red', 'Red/Black', 'Black 1st Dan', 'Black 2nd Dan', 'Black 3rd Dan', 'Black 4th Dan', 'Black 4th Dan', 'Black 5th Dan', 'Black 6th Dan', 'Black 7th Dan', 'Black 8th Dan', 'Black 9th Dan']
    },
    dateStarted: {
      type: 'date'
    },
    instructorName: {
      type: 'string',
      size: 100
    },
    associationName: {
      type: 'string',
      size: 100
    },
    bloodGroup: {
      type: 'string',
      enum: ['a', 'o']
    },
    rhFactor: {
      type: 'string',
      enum: ['Positive', 'Negative']
    },
    validity: {
      type: 'date'
    },
  }
};