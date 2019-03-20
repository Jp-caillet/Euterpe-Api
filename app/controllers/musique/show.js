// Dependencies
const mongoose = require('mongoose')
const validator = require('node-validator')
const jwt = require('jsonwebtoken')


// Core
const check = validator.isObject()
  .withOptional('radio', validator.isString())
  .withOptional('token', validator.isString())


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
        const decoded = await jwt.verify(req.body.token, "Etherpretation")
        const idUser = decoded._id
        for (let i = result.musics.length - 1; i >= 0; i--) {
          await this.db.collection('musics').findOne({_id: result.musics[i].id, "pass.current": true}, function(err,obj) { 
          if(obj != null){
            if(idUser == ''){
            res.status(200).json({ id: obj._id, duration: obj.duration, url: obj.url, thumbnailUrl: obj.thumbnailUrl, started: obj.started, title: obj.title , like: false, dislike: false})
            }else{
              let likes = false
              let dislikes = false
              for (let i = obj.actions.like.count - 1; i >= 0; i--) {
                if(idUser == obj.actions.like.userID[i].id ){
                  likes = true
                }
              }
              for (let i = obj.actions.dislike.count - 1; i >= 0; i--) {
                if(idUser == obj.actions.dislike.userID[i].id ){
                  dislikes = true
                }
              }
            res.status(200).json({ id: obj._id, duration: obj.duration, url: obj.url, thumbnailUrl: obj.thumbnailUrl, started: obj.started, title: obj.title , like: likes, dislike: dislikes})

            }
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