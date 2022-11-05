
const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    name: {
        type: String
    },
    image: {
        data: Buffer,
        contentType: String
    },
    imageName: {type: String}
})


module.exports = mongoose.model('imageModel', ImageSchema)