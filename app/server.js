// Dependencie
const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const cron = require('node-cron')
const RadioActu = require('./radioActual/index.js')

 

// Core
const routes = require('./controllers/routes.js')

/**
 * Server
 */
module.exports = class Server {
  constructor () {
    this.app = express()

    this.run()
  }

  /**
   * Middleware
   */
  middleware () {
    this.app.use(compression())
    this.app.use(cors())
    this.app.use(bodyParser.urlencoded({
      'extended': true
    }))
    this.app.use(bodyParser.json())
  }

  /**
   * Routes
   */
  routes () {
    new routes.user.Me(this.app)
    new routes.user.UserCreate(this.app)
    new routes.user.UserShow(this.app)
    new routes.user.UserSearchByEmail(this.app)
    new routes.user.UserSearchByLogin(this.app)
    new routes.user.UserUpdate(this.app)
    new routes.user.UserDestroy(this.app)
    new routes.user.UserLogin(this.app)

    new routes.musique.MusicCreate(this.app)
    new routes.musique.Musicshow(this.app)

    new routes.radio.RadioCreate(this.app)
    new routes.radio.RadioShow(this.app)
    
    const radio = new RadioActu(this.app)
    cron.schedule('*/10 * * * * *', () => {
    radio.run()
})

    // If route not exist
    this.app.use((req, res) => {
      res.status(404).json({
        'code': 404,
        'message': 'Not Found'
      })
    })
  }

  /**
   * Security
   */
  security () {
    this.app.use(helmet())
    this.app.disable('x-powered-by')
  }

  /**
   * Run
   */
  run () {
    try {
      this.security()
      this.middleware()
      this.routes()
      this.app.listen(4000)
    } catch (e) {
      console.error(`[ERROR] Server -> ${e}`)
    }
  }
}
