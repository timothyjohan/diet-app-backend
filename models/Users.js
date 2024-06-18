const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    gender:{
        type: Boolean,
        required: true
    },
    streaks:{
        type: Number,
        required: true
    },
})

module.exports = mongoose.model("users", UserSchema)