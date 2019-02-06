const Schema = require('mongoose').Schema;

module.exports = new Schema ({
  name: String,
  age: Number,
  gender: String,
  login: String,
  mdp: String
}, {
  collection: 'users',
  versionKey: false
})