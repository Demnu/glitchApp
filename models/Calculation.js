const mongoose = require('mongoose')

const CalculationSchema = new mongoose.Schema({
title: {
    type: String,
    required: [true, 'must provide title'],
    //maxlength: [20, 'name can not be more than 20 characters'],
    },
  date:{
    type:Date,
    required: true
  },
  orderIDs:{
    type:Array,
    "orderIDs" : {},
    required: true
  },
  products:{
    type:Array,
    "products" : {},
    required: true
  },
  beans:{
    type:Array,
    "beans:" : {},
    required: true
  },

})

module.exports = mongoose.model('Calculation', CalculationSchema)
