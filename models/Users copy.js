const { default: mongoose } = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: Int32Array,
        required: true
    },

})

module.exports = mongoose.model("leaderboard", LeaderboardSchema)