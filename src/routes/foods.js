const express = require('express');
const router = express.Router()
const LogFoods = require("../../models/LogFoods")
const Users = require("../../models/Users")

router.get('/', (req, res) => {
  res.send('GET request to the food')
})

// check user middleware
const checkUser = async (req, res, next) =>{
  const {email} = req.body
  if(!email){
    return res.status(400).send("Email field empty!")
  }
  
  try {
    const user = await Users.findOne({email: email})
    if(!user){
      return res.status(404).send("User not found!")
    }
    next();
  } catch (error) {
    return res.status(500).send(error)
    
  }
}
// Add new log
router.post('/add', checkUser, async (req, res) => {
  const {email, food_name, calories, proteins, fats, carbs, date} = req.body
  let newDate = date
  if(!food_name || !calories || !proteins || !fats || !carbs){
    return res.status(400).send("Invalid fields")
  }
  if(!date){
    newDate = new Date
  }

  const newLog = {
    email: email,
    food_name: food_name,
    calories:calories,
    proteins:proteins,
    fats:fats,
    carbs:carbs,
    date:newDate
  }

  try {
    const insert = await LogFoods.create(newLog)
    return res.status(201).send(insert)
  } catch (error) {
    return res.status(500).send(error)
  }

})

module.exports = router