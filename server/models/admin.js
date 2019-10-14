const {mongoose} = require('../config/db')
const bcrypt = require('bcryptjs')

var admins = new mongoose.Schema({
  username: {
    required: true,
    trim: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  name: {
    required: true,
    trim: true,
    type: String
  }
})

admins.pre('save', async function (next) {
  var admin = this

  if (admin.isModified('password')) {
    var admin_password = admin.password
    admin.password = await new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(admin_password, salt, function (err, hash) {
          if (hash) {
            resolve(hash)
          } else {
            reject(err)
          }
        })
      })
    })
    next()
  } else {
    next()
  }
});

admins.statics.findByCredential = async function (username, password) {
  var admin = this
  var query = {
    username: username
  }
  var adminData = await admin.findOne(query)

  if (!adminData) {
    Promise.reject()
  } else {
    return new Promise(function (resolve, reject) {
      bcrypt.compare(password, adminData.password, function (err, res) {
        if (res) {
          resolve(adminData)
        } else {
          reject(err)
        }
      })
    })
  }
}

var Admins = mongoose.model('admins', admins)
module.exports = {
  Admins: Admins
}
