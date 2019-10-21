const mongoose = require('mongoose');

// my schema goes here!
const Review = new mongoose.Schema({
    courseNumber: String,
    courseName: String,
    semester:String,
    year: Number,
    professor: String,
    review: String,
    sid: String,
});
module.exports = mongoose.model('Reviews', Review);