const connectDB = require('../db/connect');
const Calculation = require('../models/Calculation')
const Order = require('../models/Order')
const Product = require('../models/Product')
const Recipe = require('../models/Recipe')
const User = require('../models/User')

import {hash} from 'bcryptjs'

const register = async (req,res) =>{
    const hashedPassword = await hash(req.body.password,12);
    await User.create({
        email: req.body.email,
        password: hashedPassword
    }).catch( e =>{
        console.log(e)
    })
    





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
