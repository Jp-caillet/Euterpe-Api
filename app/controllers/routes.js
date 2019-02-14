const UserCreate = require('./user/create.js')
const Me = require('./user/me.js')
const UserShow = require('./user/show.js')
const UserSearchByEmail = require('./user/searchByEmail.js')
const UserSearchByLogin = require('./user/searchByLogin.js')
const UserLogin = require('./user/login.js')
const UserUpdate = require('./user/update.js')
const UserDestroy = require('./user/destroy.js')

module.exports = {
  user: {
    UserCreate,
    Me,
    UserShow,
    UserSearchByEmail,
    UserSearchByLogin,
    UserUpdate,
    UserLogin,
    UserDestroy
  }
}
