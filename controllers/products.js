const Product = require('../models/Product')

const getAllProducts = (async (req, res) => {
	Product.find({}, function (err, products) {
    var productsMap = [];

    products.forEach(function(product) {
        productsMap.push({label : product.id, id : product.id})
    });
    res.setHeader('Content-Range', products.length)
    res.send(productsMap);
  })
})
module.exports = {
    getAllProducts,

  }
  