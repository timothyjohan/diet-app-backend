const express = require('express');
const router = express.Router()
const Users = require('../../models/Users');

router.get('/', (req, res) => {
  res.send('GET request to the ')
})

router.get('/getUsers', async (req, res) => {
  const userTemp = await Users.find()
  res.send(userTemp)
})

// Check email exist middleware
const checkEmailExist = async (req,res,next) => {
  const {email} = req.body

  if (!email) {
    return res.status(400).send('Email is required');
  }

  try {
    const user = await Users.findOne({email: email})
    if (user) {
      return res.status(400).send('Email is already in use');
    }
    next();
  } catch (error) {
    return res.status(500).send(`Error checking email: ${error.message}`);
  }
}

// Add account
router.post('/add', checkEmailExist, async (req, res) => {
  const {email, password, name, gender} = req.body

  if(!email || !password || !name || !gender){
    return res.status(400).send('invalid fields')
  }

  let newUser = {
    email:email,
    password:password,
    name:name,
    gender:gender
  }
  try {
    const insert = await Users.create(newUser)
    return res.status(201).send(insert)
    
  } catch (error) {
    return res.status(400).send(`${error}`)
  }
})

module.exports = router