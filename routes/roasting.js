const express = require('express')
const router = express.Router()

const {
  saveCalculation,
  getCalculations,
  deleteCalculation,
  makeCalculation
} = require('../controllers/roasting')

router.route('/').get(getCalculations).post(saveCalculation)
router.route('/:id').delete(deleteCalculation)
router.route('/makeCalculation').post(makeCalculation);


module.exports = router
