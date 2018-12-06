const mongoose = require('mongoose')
const Schema = mongoose.Schema

const articleSchema = new Schema({
    designation: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('articles', articleSchema)