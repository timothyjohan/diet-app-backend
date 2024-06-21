const { default: axios } = require('axios');
const express = require('express');
const router = express.Router()

router.get('/', (req, res) => {
  res.send('GET request to the syndigo')
})



router.get('/nutritions', async (req, res) => {
    const { q } = req.query
    try {
        const result = await axios.post(
            'https://trackapi.nutritionix.com/v2/natural/nutrients/',
            {
                query: q
            },
            {
                headers: {
                    'x-app-id': process.env.X_APP_ID,
                    'x-app-key': process.env.X_APP_KEY
                }
            }
        );
        let newResult = {
            food_name: result.data.foods[0].food_name,
            serving_qty: result.data.foods[0].serving_qty,
            serving_unit: result.data.foods[0].serving_unit,
            calories: result.data.foods[0].nf_calories,
            fats: result.data.foods[0].nf_total_fat,
            protein: result.data.foods[0].nf_protein,
            carbohydrate: result.data.foods[0].nf_total_carbohydrate,
            img: result.data.foods[0].photo.thumb

        }
        return res.status(200).send(newResult)
    } catch (error) {
        return res.status(500).send(error)
    }
})

module.exports = router