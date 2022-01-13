const connectDB = require('../db/connect');
const Calculation = require('../models/Calculation')
const Order = require('../models/Order')
const Product = require('../models/Product')
const Recipe = require('../models/Recipe')

const makeCalculation = async(req,res) =>{
  //retrieve all orders chosen
  var ordersReq = req.body.orderIDs
  start = Date.now();
  var orders = [];
  ordersMongo = await Order.find();
  ordersMongo.forEach(order => {
    for (var i = 0 ; i < ordersReq.length ; i++){
      if (ordersReq[i]===order.orderID){
        orders.push({id: order.orderID, customerName: order.customerName, date: order.date, products: order.products})
      }
    }
  });
  //retrive products list
  var productsMongo = [];
  productsMongo =  await Product.find();

  var productTally = [];
  productsMongo.forEach(product =>{
    productTally.push({id:product.id, amount: 0})
  })
  //go through each product in tally and find if it matches in all of the orders
  productTally.forEach(product =>{
    orders.forEach(order =>{
      var products = []
      products = order.products;
      products.forEach(orderProduct =>{
        if(product.id === orderProduct.id){
          product.amount = Number(product.amount) + Number(orderProduct.amount)
        }
      })
    })
  })
  
  //remove products in tally with 0 amounts
  productTally = productTally.filter(product => product.amount !== 0);

  //Product Tally FINISHED

  //Begin making Roasting LIst

  //Get all recipes
  var recipesMongo = await Recipe.find();
  var recipes = [];

  //find products with recipes in product tally and add amount to the recipe
  recipesMongo.forEach(recipe =>{
    productTally.forEach(product =>{
      if (recipe.product === product.id){
        recipes.push({product:product.id, tally:product.amount, beans:[{name: recipe.bean1Name, amount: recipe.bean1Amount, amountNeededToBeRoasted:0},{name: recipe.bean2Name, amount: recipe.bean2Amount, amountNeededToBeRoasted:0},{name: recipe.bean3Name, amount: recipe.bean3Amount, amountNeededToBeRoasted:0},{name: recipe.bean4Name, amount: recipe.bean4Amount, amountNeededToBeRoasted:0},{name: recipe.bean5Name, amount: recipe.bean5Amount, amountNeededToBeRoasted:0},{name: recipe.bean6Name, amount: recipe.bean6Amount, amountNeededToBeRoasted:0},{name: recipe.bean7Name, amount: recipe.bean7Amount, amountNeededToBeRoasted:0},{name: recipe.bean8Name, amount: recipe.bean8Amount, amountNeededToBeRoasted:0},]})
      }
    })
  })

  recipes.forEach(recipe=>{
    //remove empty beans
    var beans = recipe.beans;
    recipe.beans = beans.filter(bean => bean.amount !== "");
    //calculate amount needed to be roasted for each bean in the recipe
    recipe.beans.forEach(bean=>{
      bean.amountNeededToBeRoasted = Number(recipe.tally) * Number(bean.amount)
    })
  })
  
  var beans = [];
  recipes.forEach(recipe=>{
    recipe.beans.forEach(recipeBean =>{
      //check if bean has been saved in beans list
      var duplicate = false;
      beans.every(bean =>{
        if(bean.name === recipeBean.name){
          bean.amount = Number(bean.amount) + Number(recipeBean.amountNeededToBeRoasted)/1000
          duplicate = true;
          return false;
        }
        return true;
      })
      if(!duplicate){
        beans.push({name: recipeBean.name, amount: Number(recipeBean.amountNeededToBeRoasted)/1000})
      }
    })
  })
  var data = []
  data.push(beans)
  data.push(productTally)
  res.status(200).send(data)
  res.status(200)

}


const saveCalculation = async (req, res) => {
  var date = new Date();

  var calculation = {title: req.body.title, date:req.body.date, orderIDs:req.body.orderIDs , products: req.body.products, beans: req.body.beans}
  await Calculation.create(calculation);
  res.status(200).json(calculation)

}

const getCalculations = (async (req, res) => {
	Calculation.find({}, function (err, calculations) {
    var calculationsMap = [];
    calculations.forEach(function(calculation) {
      calculationsMap.push({id:calculation._id, title:calculation.title, date:calculation.date, products:calculation.products, beans:calculation.beans, orderIDs:calculation.orderIDs})
    });
    res.send(calculationsMap);
  })
})

const deleteCalculation = async (req, res, next) => {
  const { id: id } = req.params
  const recipe = await Calculation.findOneAndDelete({ _id: id })
  if (!recipe) {
    res.status(404).send("No recipe with id: " + id)
  }
  else{
    res.status(200).json({ recipe })

  }
}


module.exports = {
  saveCalculation,
  getCalculations,
  deleteCalculation,
  makeCalculation

}
