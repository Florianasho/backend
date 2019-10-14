const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')

// Model
const {Products} = require('../models/product')

var imagePath = 'tmp/my-uploads/'
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagePath)
  },
  filename: function (req, file, cb) {
    var extension = file.originalname.substr(file.originalname.lastIndexOf('.'))
    cb(null, file.fieldname + '-' + Date.now() + extension)
  }
})

var upload = multer({ storage: storage })

// Insert
router.post('/insert', upload.single('image'), function (req, res) {
  try {
    var img = req.file.filename
    
    var myobj = { 
      name: req.body.name, 
      brand: req.body.brand,
      image: img,
      price: req.body.price,
      desc: req.body.desc,
      default: req.body.default
    }
    const product = new Products(myobj)
    product.save()
    res.status(201).send("1 document inserted")
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Find One
router.get('/findOne/:id', async function (req, res) {
  try {
    const id = req.params.id
    var filter = {
      _id: id
    }
    const products = await Products.findOne(filter)
    products.image = 'http://localhost:3000/img/'+products.image
    res.send(products)
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Find All
router.get('/findAll', async function (req, res) {
  try {
    const products = await Products.find({})
    const productData = []
    if (products) {
      for (var index in products) {
        productData.push({
          id: products[index].id,
          name: products[index].name,
          brand: products[index].brand,
          desc: products[index].desc,
          default: products[index].default,
          image: 'http://localhost:3000/img/'+products[index].image,
          price: products[index].price
        })
      }
    }
    res.send(productData)
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Find All + Filter
router.get('/findAllFilter', async function (req, res) {
  try {
    var filter = {
      name: req.body.name,
      brand: req.body.brand
    }
    const products = await Products.find(filter)
    res.send(products)
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Delete One
router.delete('/deleteOne/:id', async function (req, res) {
  try {
    var myquery = { 
      _id: req.params.id 
    }
    
    var product = await Products.findOne(myquery)
    if (product) {
      // Hapus Image
      fs.unlink(imagePath + product.image, (err) => {
        if (err) throw err
        console.log(imagePath + product.image + ' was deleted')
      })
    }

    await Products.deleteOne(myquery)
    res.send("1 document deleted")
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Delete Many
router.delete('/deleteMany', async function (req, res) {
  try {
    var myquery = { 
      // address: "Highway 37 2"
    }
    var result = await Products.deleteMany(myquery)
    res.send(result.n + " document(s) deleted")
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Update One
router.patch('/updateOne/:id', upload.single('image'), async function (req, res) {
  try {
    var myquery = { 
      _id: req.params.id
    }
    var image = req.file.filename
    var newvalues = { 
      $set: {
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
        desc: req.body.desc,
        default: req.body.default,
        image: image
      } 
    }
    var product = await Products.findOne(myquery)
    if (product) {
      // Hapus Image
      fs.unlink(imagePath + product.image, (err) => {
        if (err) throw err;
        console.log(imagePath + product.image + ' was deleted');
      });
    }
    await Products.updateOne(myquery, newvalues)
    res.send("1 document updated")
  } catch (error) {
    res.status(400).send('Error')
  }
})

// Update Many
router.put('/updateMany', async function (req, res) {
  try {
    var myquery = { 
      name: "Company Inc 2"
    }
    var newvalues = {
      $set: {
        name: "Minnie s"
      } 
    }
    var result = await Products.updateMany(myquery, newvalues)
    res.send(result.nModified + " document(s) updated")
  } catch (error) {
    res.status(400).send('Error')
  }
})

module.exports = router