const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CFASchema = new Schema({
  title: String,
  link: String,
  content: String,
  contentSnippet: String,
  guid: String,
  totalFireBanStatus: Boolean
});

module.exports = mongoose.model('CFA', CFASchema);