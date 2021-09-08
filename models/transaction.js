const mongoose = require('mongoose');

// Initalize Schema
const Schema = mongoose.Schema

const TransactionSchema = new Schema({
  description: String,
  amount: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum : ['CR','DB'],
    required: true
  },
  account: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, { timestamps: true });

// Define and Export Model
module.exports = mongoose.model('Transaction', TransactionSchema);
