const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LGASchema = new Schema({
  name: String, 
  author: String,
  fireBanStatus: Boolean,
  startDate: String,
  endDate: String,
  publishDate: String,
  modifiedDate: String
});

module.exports = mongoose.model('LGA', LGASchema);