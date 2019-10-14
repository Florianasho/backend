const {mongoose} = require('../config/db')

var products = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  brand: {
    type: String,
    trim: true,
    required: true
  },
  image: {
    type: String,
    trim: true,
    required: true
  },
  desc: {
    type: String,
    trim: true,
    required: true
  },
  default: {
    type: String,
    trim: true,
    required: true
  },
  price: {
    type: String,
    trim: true,
    required: true
  }
})

var Products = mongoose.model('products', products)
module.exports = {
  Products : Products
}