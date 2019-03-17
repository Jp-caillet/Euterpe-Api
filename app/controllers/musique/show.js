// Dependencies
const mongoose = require('mongoose')
const validator = require('node-validator')

// Core
const check = validator.isObject()
  .withOptional('radio', validator.isString())

module.exports = class Show {
  constructor (app) {
    this.app = app
    this.run()
  }

  /**
   * Middleware
   */
   middleware () {
    this.app.post('/music/show', validator.express(check), async (req, res) => {
      try {
        // Save
        await mongoose.connect('mongodb://localhost:27017/Etherpe', { useNewUrlParser: true })
        this.db = await mongoose.connection
        const result  = await this.db.collection('radios').findOne( { "radioName": req.body.radio } )
        for (let i = result.musics.length - 1; i >= 0; i--) {
          await this.db.collection('musics').findOne({_id: result.musics[i].id, "pass.current": true}, function(err,obj) { 
          if(obj != null){
            res.status(200).json(obj)
          }
          
        })
        }
        
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