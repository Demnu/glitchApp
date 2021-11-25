const express = require('express')
const router = express.Router()

const {
  getAllRecipes,
  createRecipe,
  deleteRecipe,
  getRecipe,
  updateRecipe,
  getRoastingList
} = require('../controllers/recipes')

router.route('/').get(getAllRecipes).post(createRecipe)
router.route('/getRoastingList').get(getRoastingList);
router.route('/:id').delete(deleteRecipe).get(getRecipe).patch(updateRecipe)
module.exports = router
