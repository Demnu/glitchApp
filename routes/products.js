const express = require('express')
const router = express.Router()

const {
  getAllProducts,
  deleteProduct

} = require('../controllers/products')

router.route('/').get(getAllProducts)
router.route('/:id').delete(deleteProduct)


module.exports = router
