const mongoose = require('mongoose')

const RecipeSchema = new mongoose.Schema({
  product: {
    type: String,
    unique: true,
    required: true
  },
  bean1Name:{
    type: String,

  },
  bean1Amount:{
    type: String,

  },
  bean2Name:{
    type: String,

  },
  bean2Amount:{
    type: String,

  },  bean3Name:{
    type: String,

  },
  bean3Amount:{
    type: String,

  },  bean4Name:{
    type: String,

  },
  bean4Amount:{
    type: String,

  },
  bean5Name:{
    type: String,

  },
  bean5Amount:{
    type: String,

  },
  bean6Name:{
    type: String,

  },
  bean6Amount:{
    type: String,

  },
  bean7Name:{
    type: String,

  },
  bean7Amount:{
    type: String,

  },
  bean8Name:{
    type: String,

  },
  bean8Amount:{
    type: String,

  },
  
  
})

module.exports = mongoose.model('Recipe', RecipeSchema)
