const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  question_text: String,
  answer_types: String,
}, { timestamps: true });

/**
 * Password hash middleware.
 */
questionSchema.pre('save', function save(next) {
  const question = this;
  if (!question.isModified('answer_types')) { return next(); }
});


const Question = mongoose.model('Question', questionSchema);

module.exports = Question;