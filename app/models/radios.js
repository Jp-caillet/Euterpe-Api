const Schema = require('mongoose').Schema

module.exports = new Schema ({
  radioName: String,
  image: String,
  musics: Array
})