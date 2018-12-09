// Core
const mock = require('../../models/get-user.js')
const sql = require('mssql')
const config = {
    user: 'jp',
    password: 'Xr29StLb8',
    server: '172.20.69.4', // You can use 'localhost\\instance' to connect to named instance
    database: 'Referentiels',
    driver: 'tedious',
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
}
module.exports = class Show {
  constructor (app) {
    this.app = app

    this.run()
  }

  /**
   * Middleware
   */
  middleware () {
    this.app.get('/user/show/:id', (req, res) => {
      try {
        if (!req.params || !req.params.id.length) {
          res.status(404).json({
            code: 404,
            message: 'Not Found'
          })
        }
        sql.query`select * from dbo.contacts`
          .then(result => {
            let tata = result.recordset
            let titi = "{"
            for (var i = 0; i <= tata.length - 1; i++) {
              titi= titi+'"contact'+i
              if (i==tata.length-1) {
                titi = titi +'" : '+ JSON.stringify(tata[i]) 

              }else{
                titi = titi +'" : '+ JSON.stringify(tata[i]) +','
              }
              
            }
            titi = titi+"}"
            res.status(200).json(JSON.parse(titi))
            
          }).catch(err => {
          res.status(400).json(err.message)
         
        })
      } catch (e) {
        console.error(`[ERROR] user/show/:id -> ${e}`)
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
