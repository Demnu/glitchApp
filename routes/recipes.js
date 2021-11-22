const express = require('express')
const router = express.Router()

const {
  getAllRecipes,
  createRecipe,
  deleteRecipe
} = require('../controllers/recipes')

router.route('/').get(getAllRecipes).post(createRecipe)
router.route('/:id').delete(deleteRecipe)

module.exports = router
