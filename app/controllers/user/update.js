// Core
const mock = require('../../models/get-user.js')
const validator = require('node-validator')

const check = validator.isObject()
  .withRequired('name', validator.isString())

module.exports = class Update {
  constructor (app) {
    this.app = app

    this.run()
  }

  /**
   * Middleware
   */
  middleware () {
    this.app.put('/user/update/:id', validator.express(check), (req, res) => {
      try {
        if (!req.params || !req.params.id.length) {
          res.status(404).json({
            code: 404,
            message: 'Not Found'
          })
        }

        const name = req.body.name
        const user = mock[req.params.id]

        user.name = name

        res.status(200).json({
          [req.params.id]: user
        })
      } catch (e) {
        console.error(`[ERROR] user/update -> ${e}`)
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
