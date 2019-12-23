const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LGASchema = new Schema({
  name: String, 
  author: String,
  fireBanStatus: Boolean,
  fireBanDescription: String,
  startDate: String,
  endDate: String,
  publishDate: String
});

module.exports = mongoose.model('LGA', LGASchema);