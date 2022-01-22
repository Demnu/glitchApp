const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'must provide id'],
    //maxlength: [20, 'name can not be more than 20 characters'],
    unique: true,

  },
  password:{
    type:String,
    required: true
  },
  refreshToken:{
    type:String,
  },
})

module.exports = mongoose.model('User', UserSchema)
