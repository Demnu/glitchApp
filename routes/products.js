const express = require('express')
const router = express.Router()

const {
  getAllProducts,
  deleteProduct,
  createProduct,
  getUnusedProducts

} = require('../controllers/products')

router.route('/').get(getAllProducts).post(createProduct)
router.route('/:id').delete(deleteProduct)
router.route('/unusedProducts').get(getUnusedProducts)

module.exports = router
