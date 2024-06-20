const { default: axios } = require('axios');
const express = require('express');
const router = express.Router()

router.get('/', (req, res) => {
  res.send('GET request to the syndigo')
})

router.get('/autocomplete', async (req, res) => {
    const { q } = req.query;
    try {
        const result = await axios.get(`https://trackapi.nutritionix.com/v2/search/instant/?query=${q}`, {
            headers: {
                "x-app-id": process.env.X_APP_ID,
                "x-app-key": process.env.X_APP_KEY
            }
        });
        const data = result.data;
        const commonFoods = data.common.map(item => item.food_name);
        const brandedFoods = data.branded.map(item => item.food_name);

        const allFoodNames = [...commonFoods, ...brandedFoods];

        const foodDetailsPromises = allFoodNames.map(async foodName => {
            try {
                const nutritionResult = await axios.post(
                    'https://trackapi.nutritionix.com/v2/natural/nutrients/',
                    { query: foodName },
                    {
                        headers: {
                            'x-app-id': process.env.X_APP_ID,
                            'x-app-key': process.env.X_APP_KEY
                        }
                    }
                );

                const foodDetails = nutritionResult.data.foods[0];
                return {
                    food_name: foodDetails.food_name,
                    serving_qty: foodDetails.serving_qty,
                    serving_unit: foodDetails.serving_unit,
                    calories: foodDetails.nf_calories,
                    fats: foodDetails.nf_total_fat,
                    protein: foodDetails.nf_protein,
                    carbohydrate: foodDetails.nf_total_carbohydrate,
                    img: foodDetails.photo.thumb
                };
            } catch (nutritionError) {
                console.error(`Error fetching nutrition for ${foodName}: ${nutritionError.message}`);
                return null;
            }
        });

        const foodDetails = await Promise.all(foodDetailsPromises);

        const validFoodDetails = foodDetails.filter(details => details !== null);

        return res.status(200).send(validFoodDetails);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

// router.get('/autocomplete', async (req, res) => {
//     const {q} = req.query
//     try {
//         const result = await axios.get(`https://trackapi.nutritionix.com/v2/search/instant/?query=${q}`,{
//             headers:{
//                 "x-app-id":process.env.X_APP_ID,
//                 "x-app-key":process.env.X_APP_KEY
//             }
//         })
//         const data = result.data;
//         const commonFoodNames = data.common.map(item => item.food_name);
//         const brandedFoodNames = data.branded.map(item => item.food_name);

//         // Combine the food names into one array
//         const allFoodNames = [...commonFoodNames, ...brandedFoodNames];
//         return res.status(200).send(allFoodNames)
//     } catch (error) {
//         return res.status(500).send(error.message)
        
//     }
// })

// router.get('/nutritions', async (req, res) => {
//     const { q } = req.query
//     try {
//         const result = await axios.post(
//             'https://trackapi.nutritionix.com/v2/natural/nutrients/',
//             {
//                 query: q
//             },
//             {
//                 headers: {
//                     'x-app-id': process.env.X_APP_ID,
//                     'x-app-key': process.env.X_APP_KEY
//                 }
//             }
//         );
//         let newResult = {
//             food_name: result.data.foods[0].food_name,
//             serving_qty: result.data.foods[0].serving_qty,
//             serving_unit: result.data.foods[0].serving_unit,
//             calories: result.data.foods[0].nf_calories,
//             fats: result.data.foods[0].nf_total_fat,
//             protein: result.data.foods[0].nf_protein,
//             carbohydrate: result.data.foods[0].nf_total_carbohydrate,
//             img: result.data.foods[0].photo.thumb

//         }
//         return res.status(200).send(newResult)
//     } catch (error) {
//         return res.status(500).send(error)
//     }
// })

module.exports = router