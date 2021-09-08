const express = require('express');
const router = express.Router();
const response = require('../config/response')
// Import Mongoose Model
const Transaction = require('../models/transaction');
// Middleware
const authenticated = require('../middleware/auth')
// Profile Page - Protected Route
router.get('/', authenticated, async (req, res, next) => {

  let perPage = Math.max(1, req.query.perPage);
  let page = Math.max(0, req.query.page)
  page-=1
  let data = await Transaction.find()
    .limit(perPage)
    .skip(perPage * page)
    .sort({
      createdAt: 'asc'
    })
  let count = await Transaction.count();
  let paginate = {
    page: page+1,
    total: count,
    pages: Math.ceil(count / perPage)
  }
  return response.paginateData(res, 200, data, paginate, "Success!")
});
router.get('/balance', authenticated, async (req, res, next) => {
  let {_id} = req.user;
  let data = await Transaction.findOne({account: _id})
  .select('balance')
  .sort({
    createdAt: 'desc'
  })
  return response.singleData(res, 200, data, "Success!")
});
module.exports = router;
