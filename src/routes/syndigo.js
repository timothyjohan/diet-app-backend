const { default: axios } = require('axios');
const express = require('express');
const router = express.Router()

router.get('/', (req, res) => {
  res.send('GET request to the syndigo')
})

router.get('/autocomplete', async (req, res) => {
    const {q} = req.query
    try {
        console.log(q);
        const result = await axios.get(`https://trackapi.nutritionix.com/v2/search/instant/?query=${q}`,{
            headers:{
                "x-app-id":process.env.X_APP_ID,
                "x-app-key":process.env.X_APP_KEY
            }
        })
        const data = result.data;
        const commonFoodNames = data.common.map(item => item.food_name);
        const brandedFoodNames = data.branded.map(item => item.food_name);

        // Combine the food names into one array
        const allFoodNames = [...commonFoodNames, ...brandedFoodNames];
        return res.status(200).send(allFoodNames)
    } catch (error) {
        return res.status(500).send(error.message)
        
    }
    
    
})

module.exports = router