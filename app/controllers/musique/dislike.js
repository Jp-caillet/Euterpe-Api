// Dependencies
const mongoose = require('mongoose')
const validator = require('node-validator')
const jwt = require('jsonwebtoken')

// Core
const check = validator.isObject()
  .withOptional('musicId', validator.isString())
  .withOptional('token', validator.isString())

module.exports = class dislike {
  constructor (app) {
    this.app = app
    this.run()
  }

  /**
   * Middleware
   */
   middleware () {
    this.app.post('/music/dislike', validator.express(check), async (req, res) => {
      try {
        // Save
        const decoded = await jwt.verify(req.body.token, "Etherpretation")
        const idUser = decoded._id
        await mongoose.connect('mongodb://localhost:27017/Etherpe', { useNewUrlParser: true })
        this.db = await mongoose.connection
        let exist = false
        const result  = await this.db.collection('musics').findOne( { "_id": mongoose.Types.ObjectId (req.body.musicId) } )
        let likeCount = result.actions.like.count
        let dislikeCount = result.actions.dislike.count
        
          for (let i = result.actions.dislike.count - 1; i >= 0; i--) {
            
          if(idUser == result.actions.dislike.userID[i].id ){
            exist = true
          }
        }
        
        
        if(exist){
          dislikeCount =  dislikeCount-1
          const update = await this.db.collection('musics').findOneAndUpdate(
            { "_id" : mongoose.Types.ObjectId (req.body.musicId) },
            { $pull:{ "actions.dislike.userID": { id: decoded._id } }, $set: { "actions.dislike.count": dislikeCount } }    
        )
          res.status(200).json({dislike: false})
        }else{
          dislikeCount = dislikeCount+1

          const update = await this.db.collection('musics').findOneAndUpdate(
            { "_id" : mongoose.Types.ObjectId (req.body.musicId)  },
            { $push: { "actions.dislike.userID": { id: decoded._id} }, $set: { "actions.dislike.count": dislikeCount } } 
        )
          res.status(200).json({dislike: true})
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