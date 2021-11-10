const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
})

module.exports = mongoose.model('Product', ProductSchema)
