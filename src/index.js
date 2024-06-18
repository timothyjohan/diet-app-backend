const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv").config();
const user = require('./routes/user')
const foods = require('./routes/foods')
const syndigo = require('./routes/syndigo')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use('/api/user', user)
app.use('/api/foods', foods)
app.use('/api/3rdparty', syndigo)

app.listen(process.env.PORT, async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.klxoze2.mongodb.net/${process.env.DB_NAME}`
        );
        console.log("hehehhehee");
    } catch (error) {
        console.log(error);
    }

    console.log(`Server is running on port ${process.env.PORT}`);

})


app.get('/', (req, res) => {
  res.send('GET request to the homepage')
})