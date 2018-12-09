const UserCreate = require('./user/create.js')
const UserShow = require('./user/show.js')
const UserSearch = require('./user/search.js')
const UserUpdate = require('./user/update.js')
const UserDestroy = require('./user/destroy.js')

module.exports = {
  user: {
    UserCreate,
    UserShow,
    UserSearch,
    UserUpdate,
    UserDestroy
  }
}
