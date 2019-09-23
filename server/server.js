const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const multer = require('multer')

app.use(bodyParser.json())

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/my-uploads')
  },
  filename: function (req, file, cb) {
    var extension = file.originalname.substr(file.originalname.lastIndexOf('.'))
    cb(null, file.fieldname + '-' + Date.now() + extension)
  }
})
 
var upload = multer({ storage: storage })

// DB Option
const dbUrl = "mongodb+srv://florianasho:Flor4394@cluster0-lfkaq.mongodb.net/test"
const dbOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.Promise = global.Promise
mongoose.connect(dbUrl, dbOption)

var customers = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  address: {
    type: String,
    trim: true,
    required: true
  },
  image: {
    type: String,
    trim: true,
    required: true
  }
})

var Customers = mongoose.model('customers', customers)

// Insert
app.post('/insert', upload.single('image'), function (req, res) {
  try {
    var img = req.file.filename

    var myobj = { 
      name: req.body.name, 
      address: req.body.address,
      image: img
    }
    const customer = new Customers(myobj)
    customer.save()
    res.status(201).send("1 document inserted")
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Find One
app.get('/findOne/:id', async function (req, res) {
  try {
    const id = req.params.id
    var filter = {
      _id: id
    }
    const customers = await Customers.findOne(filter)
    res.send(customers)
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Find All
app.get('/findAll', async function (req, res) {
  try {
    const customers = await Customers.find({})
    res.send(customers)
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Find All + Filter
app.get('/findAllFilter', async function (req, res) {
  try {
    var filter = {
      address: req.body.address
    }
    const customers = await Customers.find(filter)
    res.send(customers)
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Delete One
app.delete('/deleteOne/:id', async function (req, res) {
  try {
    var myquery = { 
      _id: req.params.id 
    }
    await Customers.deleteOne(myquery)
    res.send("1 document deleted")
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Delete Many
app.delete('/deleteMany', async function (req, res) {
  try {
    var myquery = { 
      address: "Highway 37 2"
    }
    var result = await Customers.deleteMany(myquery)
    res.send(result.n + " document(s) deleted")
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Update One
app.patch('/updateOne/:id', async function (req, res) {
  try {
    var myquery = { 
      _id: req.params.id
    }
    var newvalues = { 
      $set: {
        name: req.body.name,
        address: req.body.address
      } 
    }
    await Customers.updateOne(myquery, newvalues)
    res.send("1 document updated")
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Update Many
app.put('/updateMany', async function (req, res) {
  try {
    var myquery = { 
      name: "Company Inc 2"
    }
    var newvalues = {
      $set: {
        name: "Minnie s"
      } 
    }
    var result = await Customers.updateMany(myquery, newvalues)
    res.send(result.nModified + " document(s) updated")
  } catch (error) {
    res.status(400).send('Error')
  }
})

app.listen(3000, function () {
  console.log('Run in Port 3000')
})