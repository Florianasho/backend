const mongoose = require('mongoose')

// DB Option
const dbUrl = "mongodb+srv://florianasho:Flor4394@cluster0-lfkaq.mongodb.net/test"
const dbOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.Promise = global.Promise
mongoose.connect(dbUrl, dbOption)

module.exports = {mongoose}