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

router.post('/add', async (req, res) => {
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