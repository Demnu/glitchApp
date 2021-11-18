const mongoose = require('mongoose')

const RecipeSchema = new mongoose.Schema({
  product: {
    type: String,
    unique: true,
  },
  
})

module.exports = mongoose.model('Recipe', RecipeSchema)
