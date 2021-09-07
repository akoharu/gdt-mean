const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

// Import Mongoose Model
const User = require('../models/user');
const UserCtrl = require('../services/user');

// Register User
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password
  });

  UserCtrl.addUser(newUser, (err, user) => {
    (err) ? res.json({
      success: false,
      message: 'Failed to register user'
    }): res.json({
      success: true,
      message: 'User registered'
    });
  });
});

// Authenticate User
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  UserCtrl.getUserByEmail(email, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({
      success: false,
      msg: 'User not found!'
    });

    UserCtrl.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign({
          data: user
        }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXP,
        });

        res.json({
          success: true,
          token: `Bearer ${token}`,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            email: user.email
          }
        });
      } else {
        return res.json({
          success: false,
          msg: 'Wrong Password!'
        });
      }
    });
  });
});

// Profile Page - Protected Route
router.get('/profile', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  res.json({
    user: req.user
  });
});

module.exports = router;