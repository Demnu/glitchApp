const express = require('express')
const router = express.Router()

const {
  getAllRecipes,
  createRecipe,
  deleteRecipe,
  getRecipe,
} = require('../controllers/recipes')

router.route('/').get(getAllRecipes).post(createRecipe)
router.route('/:id').delete(deleteRecipe).get(getRecipe)

module.exports = router
