const Product = require("../models/Product");
const Recipe = require("../models/Recipe");

const getAllProducts = async (req, res) => {
  Product.find({}, function (err, products) {
    var productsMap = [];

    products.forEach(function (product) {
      productsMap.push({ label: product.id, id: product.id });
    });
    res.setHeader("Content-Range", products.length);
    res.send(productsMap);
  });
};

const deleteProduct = async (req, res, next) => {
  const { id: id } = req.params;
  console.log(req.params.id);
  const product = await Product.findOneAndDelete({ id: id });
  if (!product) {
    res.status(404).send("No product with id: " + id);
  } else {
    res.status(200).json({ product });
  }
};

const getUnusedProducts = async (req, res) => {
  var recipesMap = [];
  var productsMap = [];
  var unusedProducts = [];

  const products = await Product.find({});
  products.forEach(function (product) {
    productsMap.push({ label: product.id });
  });

  const recipes = await Recipe.find({});
  recipes.forEach(function (recipe) {
    recipesMap.push({ label: recipe.product });
  });
  for (var i = 0; i < productsMap.length; i++) {
    var duplicate = false;
    for (var j = 0; j < recipesMap.length; j++) {
      if (productsMap[i].label === recipesMap[j].label) {
        duplicate = true;
      }
    }
    if (!duplicate) {
      unusedProducts.push(productsMap[i]);
    }
  }
  unusedProducts.reverse();

  res.status(200).send({ unusedProducts });
};

const createProduct = async (req, res) => {
  product = { id: req.body.id };
  console.log(product);
  await Product.create(product);
  res.status(201).json({ product });
};

module.exports = {
  getAllProducts,
  deleteProduct,
  createProduct,
  getUnusedProducts,
};
