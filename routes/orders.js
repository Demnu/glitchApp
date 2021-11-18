const express = require('express')
const router = express.Router()

const {
  getAllOrders,
  getOrder
} = require('../controllers/orders')
router.route('/:id').get(getOrder)

router.route('/').get(getAllOrders)

module.exports = router
