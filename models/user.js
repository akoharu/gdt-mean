const mongoose = require('mongoose');

// Initalize Schema
const Schema = mongoose.Schema

// Define a UserSchema
const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: Number,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Define and Export Model
module.exports = mongoose.model('User', UserSchema);
