const express = require('express');
const mongoose = require('mongoose');

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.listen(process.env.PORT, async () => {
    
    console.log(`Server is running on port ${process.env.PORT}`);

})