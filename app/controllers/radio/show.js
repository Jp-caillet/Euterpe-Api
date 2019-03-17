// Dependencies
const mongoose = require('mongoose')
const validator = require('node-validator')

// Core
 

module.exports = class Show {
  constructor (app) {
    this.app = app
    this.run()
  }

  /**
   * Middleware
   */
   middleware () {
    this.app.get('/radio/show', async (req, res) => {
      try {
        // Save
        await mongoose.connect('mongodb://localhost:27017/Etherpe', { useNewUrlParser: true })
        this.db = await mongoose.connection
        const result  = await this.db.collection('radios').find( {} ).toArray()
        res.status(200).json(result)
        
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