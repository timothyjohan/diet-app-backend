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


// Format before and after harus dalam bentuk date YYYY-MM-DD
// contoh: 2024-6-18
router.get('/dates', async (req, res) => {
  const {before, after} = req.query
  try {
    const result = await LogFoods.find({
      date:{
        $gt: new Date(after),
        $lt: new Date(before)
      }
    })
    return res.status(200).send(result)
    
  } catch (error) {
    return res.status(500).send(error)
    
  }
  res.send('GET request to the homepage')
})


// INI BELUM BENARRRRR (tapi jalan)
async function getDailyNutritionSummary(email) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  try {
      const result = await LogFoods.aggregate([
          { $match: { email, date: { $gte: startOfToday, $lt: endOfToday } } },
          { $group: { _id: null, totalCalories: { $sum: "$calories" }, totalProteins: { $sum: "$proteins" }, totalFats: { $sum: "$fats" }, totalCarbs: { $sum: "$carbs" } } },
          { $project: { _id: 0, totalCalories: 1, totalProteins: 1, totalFats: 1, totalCarbs: 1 } }
      ]);

      if (result.length > 0) {
          return result[0];
      } else {
          return { totalCalories: 0, totalProteins: 0, totalFats: 0, totalCarbs: 0 };
      }
  } catch (error) {
      console.error("Error fetching daily nutrition summary:", error.message);
      throw error;
  }
}

router.get('/summary/today/:email', async (req, res) => {
  const { email } = req.params;

  try {
      const summary = await getDailyNutritionSummary(email);
      res.json(summary);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

module.exports = router