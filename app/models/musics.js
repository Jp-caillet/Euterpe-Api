const Schema = require('mongoose').Schema

module.exports = new Schema ({
  duration: Number , 
  createdAt: Date,
  title: String,
  url: String,
  thumbnailUrl: String,
  started: Date,
  ended: Date,
  author: String,
  actions:{
    like: Number,
    delete:{
      count: Number,
      userID: Array
    }
  },
  pass: {
  	current: Boolean, 
    vote: Number,
    required: Number
  }  
})