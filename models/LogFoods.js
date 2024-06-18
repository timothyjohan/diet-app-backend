const { default: mongoose } = require("mongoose");

const LogFoodSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    food_name:{
        type: String,
        required: true
    },
    calories:{
        type: Number,
        required: true
    },
    proteins:{
        type: Number,
        required: true
    },
    fats:{
        type: Number,
        required: true
    },
    carbs:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
})

module.exports = mongoose.model("log_food", LogFoodSchema)