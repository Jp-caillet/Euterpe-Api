// Dependencies
const mongoose = require('mongoose')
const validator = require('node-validator')

// Core
const check = validator.isObject()
  .withOptional('email', validator.isString())

module.exports = class SearchByEmail {
  constructor (app) {
    this.app = app
    this.run()
  }
  
  

  /**
   * Middleware
   */
  middleware () {
    this.app.post('/user/searchByEmail', validator.express(check), (req, res) => {
      try {
        // Save
        mongoose.connect('mongodb://localhost:27017/Etherpe', { useNewUrlParser: true })
        this.db = mongoose.connection
        this.db.collection('users').findOne({email: req.body.email}, function(err,obj) {
          if(obj == null){
            res.status(200).json({
              'code': 200,
              'message': 'email never used'
            })
          }else{
            res.status(409).json({
              'code': 409,
              'message': 'email already used'
            })
          }
          
        })
        
      } catch (e) {
        console.error(`[ERROR] user/searchByEmail -> ${e}`)
        res.status(400).json({
          'code': 400,
          'message': 'Bad request'
        })
      }
    })
  }

  /**
   * Run
   */
  run () {
    this.middleware()
  }
}