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
    like:{
      userID:[],
      count: Number
    },
    dislike:{
      userID: [],
      count: Number
    }
  },
  pass: {
  	current: Boolean, 
    vote: Number
  }  
})