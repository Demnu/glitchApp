const express = require('express')
const router = express.Router()

const {
  getAllRecipes,
  createRecipe,
  deleteRecipe,
  getRecipe,
  updateRecipe
} = require('../controllers/recipes')

router.route('/').get(getAllRecipes).post(createRecipe)
router.route('/:id').delete(deleteRecipe).get(getRecipe).patch(updateRecipe)

module.exports = router
