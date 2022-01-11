const connectDB = require('../db/connect');
const Order = require('../models/Order')
const RecipeMongo = require('../models/Recipe')

const getAllRecipes = (async (req, res) => {
	RecipeMongo.find({}, function (err, recipes) {
    var recipesMap = [];
    recipes.forEach(function(recipe) {
      console.log("found")
      var beans = [];

      console.log(beans);
      
      recipesMap.push({_id:recipe._id, id: recipe.product, bean1Name: recipe.bean1Name,bean1Amount: recipe.bean1Amount, bean2Name: recipe.bean2Name, bean2Amount: recipe.bean2Amount})
    });
    res.send(recipesMap);
  })
})

const createRecipe = async (req, res) => {
  // recipe = {product:"Haywire Blend Recipe",bean1Name:"Columbia",bean1Amount:"1000", bean2Name:"Ethiopian",bean2Amount:"500",bean3Name:"Ethiopian",bean3Amount:"500",bean4Name:"Ethiopian",bean4Amount:"500",bean5Name:"Columbia",bean5Amount:"1000", bean6Name:"Ethiopian",bean6Amount:"500",bean7Name:"Ethiopian",bean7Amount:"500",bean8Name:"Ethiopian",bean8Amount:"500", };
  recipe = {product: req.body.product, bean1Name: req.body.bean1Name}
  var duplicate = false;
  console.log(recipe)
  await RecipeMongo.create(req.body).catch(function (error){
    console.log("duplicate")
    duplicate = true;
  })
  if(duplicate){
    res.status(404).send("duplicate")

  }
  else{
    res.status(201).json({ recipe })

  }
}

const deleteRecipe = async (req, res, next) => {
  const { id: id } = req.params
  console.log(req.params)
  const recipe = await RecipeMongo.findOneAndDelete({ product: id })
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

  const recipe = await RecipeMongo.findOne({ _id: id })
  if (!recipe) {
    res.status(404).send("No recipe with id: " + id)
  }
  else{
     const recipesFormatted = {_id: recipe._id, id: recipe.product, bean1Name: recipe.bean1Name,bean1Amount: recipe.bean1Amount, bean2Name: recipe.bean2Name, bean2Amount: recipe.bean2Amount, bean3Name: recipe.bean3Name,bean3Amount: recipe.bean3Amount, bean4Name: recipe.bean4Name, bean4Amount: recipe.bean4Amount, bean5Name: recipe.bean5Name,bean5Amount: recipe.bean5Amount, bean6Name: recipe.bean6Name, bean6Amount: recipe.bean6Amount, bean7Name: recipe.bean7Name,bean7Amount: recipe.bean7Amount, bean8Name: recipe.bean8Name, bean8Amount: recipe.bean8Amount}
    res.status(200).json(recipesFormatted);

  }
})

const updateRecipe = (async (req, res, next) => {
  const { id: id } = req.params
  const recipe = await RecipeMongo.findOneAndUpdate({ _id: id }, req.body, {
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

const getRoastingList = (async (req, res) => {
  function Recipe(recipe){
    this.product = recipe.product,
    this.beans = [{bean:recipe.bean1Name,amount:recipe.bean1Amount},{bean:recipe.bean2Name ,amount:recipe.bean2Amount},{bean:recipe.bean3Name,amount:recipe.bean3Amount},{bean:recipe.bean4Name ,amount:recipe.bean4Amount},{bean:recipe.bean5Name,amount:recipe.bean5Amount},{bean:recipe.bean6Name ,amount:recipe.bean6Amount},{bean:recipe.bean7Name,amount:recipe.bean7Amount},{bean:recipe.bean8Name ,amount:recipe.bean8Amount}]
    this.amountOrders = 0;
    this.test = function(name){
      console.log(name)
    }
    this.clearEmptyBeans = function(){
      for (var i = this.beans.length-1 ; i >=0 ; i--){
        if (this.beans[i].bean === ""){
          this.beans.splice(i, 1);
        }
      }
    }
    this.clearEmptyBeans();
    this.addToAmountOfOrders = function(qty){
      this.amountOrders += Number(qty);
    }
  }
  function BeanOrder(bean){
    this.id = bean,
    this.amount = 0;
    this.addToAmount = function(qty){
      this.amount += Number(qty);
    }
  }
  //Add all recipes to array
  var recipes = []
  const recipesMongo = await RecipeMongo.find({})
  console.log("recipe")

  recipesMongo.forEach(function(recipe){

    recipes.push(new Recipe(recipe));
  })

  //add beans to map no duplicates
  var beansMap =  new Map()
  for (var i = 0 ; i<recipes.length; i++){
    for (var j = 0 ; j<recipes[i].beans.length; j++){
      beansMap.set(recipes[i].beans[j].bean,recipes[i].beans[j].bean);
    }
  }

  var roastingList =[]
  beansMap.forEach(function(bean){
    console.log("new bean " + bean)
    roastingList.push(new BeanOrder(bean))
  })
  //get Orders
  var productsOrdered = [];
  const orders = await Order.find({})
  orders.forEach(function(order){
    for (var i = 0 ; i <order.products.length ; i++){

      if(String(order.products[i]))
      productsOrdered.push(order.products[i]);
      // if(order.products[i].name === "RETAIL HAYWIRE BLEND 250G" ){
      //   amountOfCustomBlend += Number(order.products[i].amount);
      // }
    }
  })

  for (var i = 0 ; i<recipes.length; i++){
    for(var j = 0; j<productsOrdered.length;j++){
      if (recipes[i].product === productsOrdered[j].name){
          recipes[i].addToAmountOfOrders(productsOrdered[j].amount)
      }
    }
  }

  for(var i = 0 ; i<roastingList.length;i++){
    for (var j = 0 ; j <recipes.length;j++){
      var qtyOfRecipe = recipes[j].amountOrders;
      for (var k = 0 ; k <recipes[j].beans.length;k++){
        if (roastingList[i].id === recipes[j].beans[k].bean){
          // console.log(`${roastingList[i].bean}   ${recipes[j].beans[k].bean}`)
          roastingList[i].addToAmount((Number(recipes[j].beans[k].amount)*Number(qtyOfRecipe))/1000)
        }
      }
    }
  }

  var roastingOrder
  res.send(roastingList)
})

const createRoastingList = (async (req, res) => {

  function Recipe(recipe){
    this.product = recipe.product,
    this.beans = [{bean:recipe.bean1Name,amount:recipe.bean1Amount},{bean:recipe.bean2Name ,amount:recipe.bean2Amount},{bean:recipe.bean3Name,amount:recipe.bean3Amount},{bean:recipe.bean4Name ,amount:recipe.bean4Amount},{bean:recipe.bean5Name,amount:recipe.bean5Amount},{bean:recipe.bean6Name ,amount:recipe.bean6Amount},{bean:recipe.bean7Name,amount:recipe.bean7Amount},{bean:recipe.bean8Name ,amount:recipe.bean8Amount}]
    this.amountOrders = 0;
    this.clearEmptyBeans = function(){
      for (var i = this.beans.length-1 ; i >=0 ; i--){
        if (this.beans[i].bean === ""){
          this.beans.splice(i, 1);
        }
      }
    }
    this.clearEmptyBeans();
    this.addToAmountOfOrders = function(qty){
      this.amountOrders += Number(qty);
    }
  }
  function BeanOrder(bean){
    this.id = bean,
    this.amount = 0;
    this.addToAmount = function(qty){
      this.amount += Number(qty);
    }
  }
  //Add all recipes to array
  var recipes = []
  const recipesMongo = await RecipeMongo.find({})
  recipesMongo.forEach(function(recipe){
    recipes.push(new Recipe(recipe));
  })

  //add beans to map no duplicates
  var beansMap =  new Map()
  for (var i = 0 ; i<recipes.length; i++){
    for (var j = 0 ; j<recipes[i].beans.length; j++){
      beansMap.set(recipes[i].beans[j].bean,recipes[i].beans[j].bean);
    }
  }

  var roastingList =[]
  beansMap.forEach(function(bean){
    roastingList.push(new BeanOrder(bean))
  })
  //get Orders
  
  var ordersReq = req.body.orderIDs
  var ordersMongo = []
  for (var i = 0 ; i < ordersReq.length;i++){
    //BOTTLENECK
    const order = await Order.findOne({ orderID: ordersReq[i] });
    console.log(order)
    ordersMongo.push(order)
  }

  
  //get products in each order
  var productsOrdered = [];
  var amountOfCustomBlend = 0;
  ordersMongo.forEach(function(order){
    for (var i = 0 ; i <order.products.length ; i++){
      if(!order.products[i].id){
        productsOrdered.push({id: order.products[i].name, amount: order.products[i].amount})
      }
      else{
        productsOrdered.push(order.products[i]);
      }
      console.log(order.products[i])
    }
  })
  for (var i = 0 ; i<recipes.length; i++){
    for(var j = 0; j<productsOrdered.length;j++){
      if(String(productsOrdered[j].id)===(String(recipes[i].product))){
        recipes[i].addToAmountOfOrders(productsOrdered[j].amount)
      }
    }
  }
  for (var i = 0 ; i<recipes.length; i++){
    var beansInRecipe = []
    beansInRecipe = recipes[i].beans;
    for (var j = 0 ; j <beansInRecipe.length;j++){
      for (var k = 0 ; k< roastingList.length ; k++){
        if (beansInRecipe[j].bean === roastingList[k].id){
          roastingList[k].addToAmount(Number(recipes[i].amountOrders)*Number(beansInRecipe[j].amount)/1000)
          if(Number(recipes[i].amountOrders)*Number(beansInRecipe[j].amount)/1000!=0){
            console.log(`Adding from recipe ${recipes[i].product} amount: ${recipes[i].amountOrders} \n ${Number(recipes[i].amountOrders)*Number(beansInRecipe[j].amount)/1000} to ${roastingList[k].id}`)

          }
        }
      }
    }
  }


  // for(var i = 0 ; i<roastingList.length;i++){
  //   for (var j = 0 ; j <recipes.length;j++){
  //     var qtyOfRecipe = recipes[j].amountOrders;
  //     for (var k = 0 ; k <recipes[j].beans.length;k++){
  //       if (roastingList[i].id === recipes[j].beans[k].bean){
  //         roastingList[i].addToAmount((Number(recipes[j].beans[k].amount)*Number(qtyOfRecipe))/1000)
  //         // console.log(`${i} - ${j} - ${k} \n ${roastingList[i].id} - ${roastingList[i].amount}   ${recipes[j].beans[k].bean} added `)

  //       }
  //     }
  //   }
  // }
  //remove roastingList with 0 amounts
  for (var i = roastingList.length-1  ; i >=0 ; i--){
    if (roastingList[i].amount === 0){

      roastingList.splice(i,1)
    }
  }



  var productsList = []
  productsOrdered.forEach(function(product){
    var duplicate = false;
    productsList.forEach(function(savedProduct){
      if (String(product.id)===(String(savedProduct.id))){
        duplicate = true;
        savedProduct.amount = Number(savedProduct.amount) + Number(product.amount)
      }

    })

    if (!duplicate){
      productsList.push(product)
    }
    
  });
  //categorise products in products list


  for (var i = 0 ; i<productsList.length; i++){
    var recipeProduct = false;
    for (var j = 0 ; j<recipes.length; j++){
      if (productsList[i].id === recipes[j].product){
        recipeProduct = true;
      }
    }
    if (recipeProduct){
      productsList[i].id= "[r] - " + productsList[i].id;
    }
    else{
      
    }
  }
  console.log("DONE")
  roastingList.sort();
  productsList.sort();
  var data = []
  data.push(roastingList)
  data.push(productsList)
  res.status(200).send(data)
})

function getBeansFromRecipes(recipes){

}

module.exports = {
  getAllRecipes,
  createRecipe,
  deleteRecipe,
  getRecipe,
  updateRecipe,
  getRoastingList,
  createRoastingList

}
