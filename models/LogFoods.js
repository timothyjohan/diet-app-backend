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
        type: Double,
        required: true
    },
    proteins:{
        type: Double,
        required: true
    },
    fats:{
        type: Double,
        required: true
    },
    carbs:{
        type: Double,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
})

module.exports = mongoose.model("log_food", LogFoodSchema)