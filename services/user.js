const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = {
    getUserById: (id, callback) => {
      User.findById(id, callback);
    },
    getUserByEmail: (email, callback) => {
      const query = {
        email
      }
      User.findOne(query, callback);
    },
    addUser: (newUser, callback) => {
      bcrypt.genSalt(10)
        .then((salt) => bcrypt.hash(newUser.password, salt))
        .then((hash) => {
          newUser.password = hash;
          newUser.save(callback);
        }).catch((err) => console.log('There was an error adding a user.'));
    },
    comparePassword: (candidatePassword, hash, callback) => {
      bcrypt.compare(candidatePassword, hash)
        .then((isMatch) => {
          callback(null, isMatch);
        }).catch((err) => console.log('There was an error with authentication.'));
    }
  }