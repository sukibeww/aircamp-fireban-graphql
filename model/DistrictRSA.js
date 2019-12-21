const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DistrictRSASchema = new Schema({
  name: String, 
  regionNumber: Number,
  councils: [String],
  dangerLevelToday: String,
  dangerLevelTomorrow: String,
  fireBanToday: Boolean,
  fireBanTomorrow: Boolean
});

module.exports = mongoose.model('DistrictRSA', DistrictRSASchema);