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

const deleteProduct = async (req, res, next) => {
  const { id: id } = req.params
  console.log(req.params)
  const product = await Product.findOneAndDelete({ id: id })
  if (!product) {
    res.status(404).send("No product with id: " + id)
  }
  else{
    res.status(200).json({ product })

  }
  
}
module.exports = {
    getAllProducts,
    deleteProduct

  }
  