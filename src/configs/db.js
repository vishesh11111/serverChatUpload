const mongoose = require("mongoose");

const connect = () => {
    mongoose.connect('mongodb://localhost:27017/practice')
}

module.exports = connect;