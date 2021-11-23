const connectDB = require('../db/connect');

const Recipe = require('../models/Recipe')
const getAllRecipes = (async (req, res) => {
	Recipe.find({}, function (err, recipes) {
    var recipesMap = [];

    recipes.forEach(function(recipe) {
      recipesMap.push({_id:recipe._id, id: recipe.product, bean1Name: recipe.bean1Name,bean1Amount: recipe.bean1Amount, bean2Name: recipe.bean2Name, bean2Amount: recipe.bean2Amount})
    });
    res.setHeader('Content-Range', recipes.length)
    res.send(recipesMap);
  })
})

const createRecipe = async (req, res) => {
  recipe = {product:"Haywire Blend Recipe",bean1Name:"Columbia",bean1Amount:"1000", bean2Amount:"500", bean2Name:"Ethiopian"};
  await Recipe.create(recipe)
  res.status(201).json({ recipe })
}

const deleteRecipe = async (req, res, next) => {
  const { id: id } = req.params
  const recipe = await Recipe.findOneAndDelete({ id: id })
  if (!recipe) {
    res.status(404).send("No recipe with id: " + id)
  }
  else{
    res.status(200).json({ recipe })

  }
  
}



const getRecipe = (async (req, res, next) => {
  const { id: id } = req.params
  var recipesMap = [];

  const recipe = await Recipe.findOne({ _id: id })
  if (!recipe) {
    res.status(404).send("No recipe with id: " + id)
  }
  else{
     const recipesFormatted = {_id: recipe._id, id: recipe.product, bean1Name: recipe.bean1Name,bean1Amount: recipe.bean1Amount, bean2Name: recipe.bean2Name, bean2Amount: recipe.bean2Amount}
    res.status(200).json(recipesFormatted);

  }
})
// const createTask = asyncWrapper(async (req, res) => {
//   const task = await Task.create(req.body)
//   res.status(201).json({ task })
// })


const updateRecipe = (async (req, res, next) => {
  const { id: id } = req.params
  console.log(req.body);
  const recipe = await Recipe.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  })

  if (!recipe) {
    res.status(404).send("No recipe with id: " + id)
  }
  else{
    res.status(200).json({ recipe })

  }
})

module.exports = {
  getAllRecipes,
  createRecipe,
  deleteRecipe,
  getRecipe,
  updateRecipe

}
