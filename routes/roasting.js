const express = require('express')
const router = express.Router()

const {
  saveCalculation,
  getCalculations,
  deleteCalculation
} = require('../controllers/roasting')

router.route('/').get(getCalculations).post(saveCalculation)
router.route('/:id').delete(deleteCalculation)

module.exports = router
