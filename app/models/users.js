const Schema = require('mongoose').Schema

module.exports = new Schema ({
  name: String,
  age: Number,
  gender: String,
  email: { type: String, unique: true, required: true },
  login: { type: String, unique: true, required: true },
  mdp: { type: String, required: true }
}, {
  collection: 'users',
  versionKey: false
})