// Core
const mock = require('../../models/get-user.js');
 module.exports = class Create {
  constructor(app) {
    this.app = app;
     this.run();
  }
   /**
   * Middleware
   */
  middleware () {
    this.app.post('/user/create', (req, res) => {
      try {
        let i = 1
        while(mock[i]!= null){
          i++
        }
        Object.assign(mock, {
          [i]: req.body
        });
         res.status(200).json(mock || {});
      } catch (e) {
        console.error(`[ERROR] user/create -> ${e}`);
        res.status(400).json({
          'code': 400,
          'message': 'Bad request'
        });
      }
     });
  }
   /**
   * Run
   */
  run () {
    this.middleware();
  }
};