const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  question_text: String,
  answer_text: String,
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
