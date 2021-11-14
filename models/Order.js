const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
  orderID: {
    type: String,
    required: [true, 'must provide id'],
    trim: true,
    //maxlength: [20, 'name can not be more than 20 characters'],
    unique: true,

  },
  date:{
    type:Date
  },
  products:{
    type:Array,
    "product" : {
      
  },
  }
})

module.exports = mongoose.model('Order', OrderSchema)
