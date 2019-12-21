const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegionCFASchema = new Schema({
  _cfa: {
    type: Schema.Types.ObjectId,
    ref: "CFA"
  },
  name: String,
  firebanStatus: String,
  fireDangerRating: String
});

module.exports = mongoose.model('RegionCFA', RegionCFASchema);