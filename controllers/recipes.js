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
  // recipe = {product:"Haywire Blend Recipe",bean1Name:"Columbia",bean1Amount:"1000", bean2Name:"Ethiopian",bean2Amount:"500",bean3Name:"Ethiopian",bean3Amount:"500",bean4Name:"Ethiopian",bean4Amount:"500",bean5Name:"Columbia",bean5Amount:"1000", bean6Name:"Ethiopian",bean6Amount:"500",bean7Name:"Ethiopian",bean7Amount:"500",bean8Name:"Ethiopian",bean8Amount:"500", };
  recipe = {product: req.body.product, bean1Name: req.body.bean1Name}
  console.log(recipe)
  await Recipe.create(req.body)
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
     const recipesFormatted = {_id: recipe._id, id: recipe.product, bean1Name: recipe.bean1Name,bean1Amount: recipe.bean1Amount, bean2Name: recipe.bean2Name, bean2Amount: recipe.bean2Amount, bean3Name: recipe.bean3Name,bean3Amount: recipe.bean3Amount, bean4Name: recipe.bean4Name, bean4Amount: recipe.bean4Amount, bean5Name: recipe.bean5Name,bean5Amount: recipe.bean5Amount, bean6Name: recipe.bean6Name, bean6Amount: recipe.bean6Amount, bean7Name: recipe.bean7Name,bean7Amount: recipe.bean7Amount, bean8Name: recipe.bean8Name, bean8Amount: recipe.bean8Amount}
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
