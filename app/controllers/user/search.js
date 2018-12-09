// Core
const mock = require('../../models/get-user.js')
const validator = require('node-validator')

const check = validator.isObject()
  .withRequired('ids', validator.isArray())

module.exports = class Search {
  constructor (app) {
    this.app = app

    this.run()
  }

  /**
   * Middleware
   */
  middleware () {
    this.app.post('/user/search', validator.express(check), (req, res) => {
      try {
        const result = {}
        const ids = req.body.ids

        for (let i = 0, len = ids.length; i < len; i += 1) {
          Object.assign(result, {
            [ids[i]]: mock[ids[i]]
          })
        }

        res.status(200).json(result)
      } catch (e) {
        console.error(`[ERROR] user/search -> ${e}`)
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
