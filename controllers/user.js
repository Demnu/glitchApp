const connectDB = require('../db/connect');
const Calculation = require('../models/Calculation')
const Order = require('../models/Order')
const Product = require('../models/Product')
const Recipe = require('../models/Recipe')
const User = require('../models/User')
const {hash, compare} = require('bcryptjs')
const {sign} = require ('jsonwebtoken')
const register = async (req,res) =>{
    const hashedPassword = await hash(req.body.password,12);
    await User.create({
        email: req.body.email,
        password: hashedPassword
    }).catch( e =>{
        console.log(e)
    })
    
    res.status(200)

}

const login = async(req, res) =>{
  const user = await User.findOne({email: req.body.email})
  var error;
  var valid = false;
  try{
    if(!user){
      error = "Could not find user"
      throw new Error("could not find user");
    }
    valid = await compare(req.body.password, user.password)
    if(!valid){
      error = "Incorrect password"
      throw new Error("incorrect password");
    }
    var token = sign({userID:String(user._id), email: String(user.email), isAdmin: true},process.env.TOKEN_KEY,{expiresIn:"2m"})
    var refreshToken = sign({userID:String(user._id), email: String(user.email), isAdmin: true},process.env.REFRESH_TOKEN_KEY,{expiresIn:"2m"})
    await User.updateOne({_id: user._id}, {refreshToken: refreshToken})
    res.status(200)
    .cookie('refreshToken', token, {
      httpOnly: true,
      path: '/refreshToken'
    })
    .send({token,refreshToken});
  }
  catch(e){
    res.status(406).send(error);
  }


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
  register,
  login

}
