// Dependencies
const mongoose = require('mongoose')
const validator = require('node-validator')

// Core
const check = validator.isObject()
  .withOptional('login', validator.isString())

module.exports = class SearchByLogin {
  constructor (app) {
    this.app = app
    this.run()
  }
  
  

  /**
   * Middleware
   */
  middleware () {
    this.app.post('/user/searchByLogin', validator.express(check), (req, res) => {
      try {
        // Save
        mongoose.connect('mongodb://localhost:27017/Etherpe', { useNewUrlParser: true })
        this.db = mongoose.connection
        this.db.collection('users').findOne({login: req.body.login}, function(err,obj) { 
          if(obj == null){
            res.status(200).json({
              'code': 200,
              'message': 'login never used'
            })
          }else{
            res.status(409).json({
              'code': 409,
              'message': 'login already used'
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