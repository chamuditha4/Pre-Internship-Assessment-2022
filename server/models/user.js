const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  name: {
    type: String
  },
  username: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  photo:
    {
        type: String
    },
  bio: {
    type: String
  }
}, {
    collection: 'users'
  })

module.exports = mongoose.model('users', userSchema)