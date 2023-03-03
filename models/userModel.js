const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, "user must have username"],
        unique: true
    },
    password: {
        type: String,
        require: [true, "user must have password"],
    },
});

const User = mongoose.model("User", userSchema)

module.exports = User