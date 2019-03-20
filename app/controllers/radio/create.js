// Dependencies
const mongoose = require('mongoose')
const Schema1 = require('../../models/musics.js')
const Schema2 = require('../../models/radios.js')
const validator = require('node-validator')
const fetchVideoInfo = require('youtube-info')

// Core
const check = validator.isObject()
  .withRequired('nameRadio', validator.isString())
  .withOptional('image', validator.isString())
  .withOptional('url1', validator.isString())
  .withOptional('url2', validator.isString())

module.exports = class Create {
  constructor (app) {
    this.app = app
    this.run()
  }
  
  /**
   * Data base connect
   */
    async getModel1 (res, payload) {
    
    const Music = mongoose.model('musics', Schema1)
    const model = new Music
    const video = ""
    const split = payload.url1.split("v=")
    const codeUrl= split[1]
    await fetchVideoInfo(codeUrl).then(function (videoInfo) {
    const thumbnailUrl = videoInfo.thumbnailUrl.replace('maxresdefault', '0')
    model.duration = videoInfo.duration
    model.createdAt = new Date()
    model.title = videoInfo.title
    model.url = payload.url1
    model.thumbnailUrl = thumbnailUrl
    model.started = new Date()
    model.ended = new Date()
    model.author = ""
    model.pass.current = true
    model.actions.like.count = 0
    model.pass.vote = 0
    model.actions.dislike.count = 0

    })  
    return model
  }


  async getModel2 (res, payload) {
    
    const Music = mongoose.model('musics', Schema1)
    const model = new Music
    const video = ""
    const split = payload.url2.split("v=")
    const codeUrl= split[1]
    await fetchVideoInfo(codeUrl).then(function (videoInfo) {
    const thumbnailUrl = videoInfo.thumbnailUrl.replace('maxresdefault', '0')
    model.duration = videoInfo.duration
    model.createdAt = new Date()
    model.title = videoInfo.title
    model.url = payload.url2
    model.thumbnailUrl = thumbnailUrl
    model.started = new Date()
    model.ended = new Date()
    model.author = ""
    model.pass.current = false
    model.actions.like.count = 0
    model.pass.vote = 0
    model.actions.dislike.count = 0


    })  
    return model
  }

 async getModelRadio (res, payload) {
    
    const Radio = mongoose.model('radios', Schema2)
    const model = new Radio
    model.radioName = payload.nameRadio
    model.image = payload.image
     
    return model
  }



  /**
   * Middleware
   */
  middleware () {
    this.app.post('/radio/create', validator.express(check), async (req, res) => {
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
        const toto = await this.getModelRadio(res, req.body)

        const result = await toto.save()

      
        const trotro = await this.getModel1(res, req.body)

        const result1 = await trotro.save()
        const update = await this.db.collection('radios').findOneAndUpdate(
      { "radioName" : req.body.nameRadio },
      { $push : { "musics" : {id: result1._id, name: result1.title} } }
   )

        const trutru = await this.getModel2(res, req.body)

        const result2 = await trutru.save()
        const update1 = await this.db.collection('radios').findOneAndUpdate(
      { "radioName" : req.body.nameRadio },
      { $push : { "musics" : {id: result2._id, name: result2.title} } }
   )



        res.status(200).json(result)
      } catch (e) {
        console.log("create radio")
        console.error(`[ERROR] radio/create -> ${e}`)
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