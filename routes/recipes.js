const express = require('express')
const router = express.Router()

const {
  getAllRecipes,
  createRecipe
} = require('../controllers/recipes')

router.route('/').get(getAllRecipes).post(createRecipe)

module.exports = router
