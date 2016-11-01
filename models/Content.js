const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  content_title: String,
  content: String,
}, { timestamps: true });

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
