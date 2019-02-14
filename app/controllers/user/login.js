// Dependencies
const mongoose = require('mongoose')
const validator = require('node-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


// Core
const check = validator.isObject()
  .withOptional('email', validator.isString())
  .withOptional('mdp', validator.isString())

module.exports = class Login {
  constructor (app) {
    this.app = app
    this.run()
  }

  comparePassword (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

  /**
   * Middleware
   */
  middleware () {
    this.app.post('/user/login', validator.express(check), (req, res) => {
      try {
        // Save
        mongoose.connect('mongodb://localhost:27017/Etherpe', { useNewUrlParser: true })
        this.db = mongoose.connection
        this.db.collection('users').findOne({
          email: req.body.email
        }, function(err, user) {
          if (err) throw err;
            if (!user) {
              res.status(401).json({ message: 'Authentication failed. User not found.' })
            } else if (user) {
            if (!bcrypt.compareSync(req.body.mdp, user.mdp)) {
              res.status(401).json({ message: 'Authentication failed. Wrong password.' })
            } else {
               res.status(200).json({token: jwt.sign({ email: user.email, login: user.login, _id: user._id}, 'Etherpretation')})
            }
          }
        })
      } catch (e) {
        console.log("login user")
        console.error(`[ERROR] user/login -> ${e}`)
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