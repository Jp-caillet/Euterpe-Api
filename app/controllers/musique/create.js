// Dependencies
const mongoose = require('mongoose')
const Schema = require('../../models/musics.js')
const validator = require('node-validator')
const fetchVideoInfo = require('youtube-info')

// Core
const check = validator.isObject()
  .withRequired('nameRadio', validator.isString())
  .withOptional('url', validator.isString())

module.exports = class Create {
  constructor (app) {
    this.app = app
    this.run()
  }
  
  /**
   * Data base connect
   */
    async getModel (res, payload, current) {
    
    const Music = mongoose.model('musics', Schema)
    const model = new Music
    const video = ""
    const split = payload.url.split("v=")
    const codeUrl= split[1]
    await fetchVideoInfo(codeUrl).then(function (videoInfo) {
    const thumbnailUrl = videoInfo.thumbnailUrl.replace('maxresdefault', '0')
    model.duration = videoInfo.duration
    model.createdAt = new Date()
    model.title = videoInfo.title
    model.url = payload.url
    model.thumbnailUrl = thumbnailUrl
    model.started = new Date()
    model.ended = new Date()
    model.author = ""
    model.actions.like = 0
    model.actions.delete.count = 0
    model.actions.delete.userID = []
    model.pass.current = current
    model.pass.vote = 0
    model.pass.require = 5

    })  
    return model
  }




  /**
   * Middleware
   */
  middleware () {
    this.app.post('/music/create', validator.express(check), async (req, res) => {
      try {
       await mongoose.connect('mongodb://localhost:27017/Etherpe', { useNewUrlParser: true })

          this.db = await mongoose.connection
          await this.db.on('error', () => {
            res.status(500).json({
              'code': 500,
              'message': 'Internal Server Error'
            })
            console.error(`[ERROR] user/create getModel() -> Connetion fail`)
          })
        const vide = await this.db.collection('radios').findOne(
      { "radioName" : req.body.nameRadio }
   )
        let tutu = false
        if(vide.musics.length == 0){
          tutu = true
        }
        const toto = await this.getModel(res, req.body,tutu)

        const result = await toto.save()
        const update = await this.db.collection('radios').findOneAndUpdate(
      { "radioName" : req.body.nameRadio },
      { $push : { "musics" : {id: result._id, name: result.title} } }
   )

        res.status(200).json(result)
      } catch (e) {
        console.log("create user")
        console.error(`[ERROR] user/create -> ${e}`)
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