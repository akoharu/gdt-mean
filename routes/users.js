const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const response = require('../config/response')
// Import Mongoose Model
const User = require('../models/user');
const UserCtrl = require('../services/user');
// Middleware
const authenticated = require('../middleware/auth')
// Register User
router.post('/register', async (req, res, next) => {
  // Get user input
  let {
    name,
    phone,
    email,
    password
  } = req.body;

  // Validate user input
  if (!(email && password && name && phone)) {
    return response.singleData(res, 400, "", "All input is required")
  }
  phone = Number(phone);
  if (!(String(phone).match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im))) {
    return response.singleData(res, 400, "", "Phone is not valid!")
  }
  // check if user already exist
  // Validate if user exist in our database
  const isMailExist = await User.findOne({
    email
  }).lean();

  if (isMailExist) {
    return response.singleData(res, 409, "", "Email Already Exist. Please Login");
  }
  const isPhoneExist = await User.findOne({
    phone
  }).lean();

  if (isPhoneExist) {
    return response.singleData(res, 409, "", "Phone Already Exist. Please Login");
  }
  let newUser = new User({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password
  });
  UserCtrl.addUser(newUser, (err, user) => {
    (err) ? response.singleData(res, 400, '', "Failed to register user"): response.singleData(res, 200, user, "Register user success!");
  });
});

// Authenticate User
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  UserCtrl.getUserByEmail(email, (err, user) => {
    if (err) throw err;
    if (!user) return response.singleData(res, 404, "", `Email is not registered!`);

    UserCtrl.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign({
          data: user
        }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXP,
        });

        return response.singleData(res, 200, {
          ...user.toObject(),
          token: token
        }, `Hi, ${user.name}`);
      } else {
        return response.singleData(res, 403, "", `Wrong Password!`);
      }
    });
  });
});

// Profile Page - Protected Route
router.get('/profile', authenticated, (req, res, next) => {
  return response.singleData(res, 200, {
    user: req.user
  }, `Success`);
});

module.exports = router;
