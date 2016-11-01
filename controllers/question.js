const Question = require('../models/Question');

/**
 * GET /create
 * Create question page.
 */
exports.getCreate = (req, res) => {
  // if (req.question) {
  //   return res.redirect('/');
  // }
  res.render('question/create', {
    title: 'Create Question'
  });
};

/**
 * POST /create
 * Create a new question.
 */
exports.postCreate = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  const question = new Question({
    email: req.body.email,
    password: req.body.password
  });

  Question.findOne({ email: req.body.email }, (err, existingQuestion) => {
    if (err) { return next(err); }
    if (existingQuestion) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/signup');
    }
    question.save((err) => {
      if (err) { return next(err); }
      req.logIn(question, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
};

/**
 * GET /question
 * Profile page.
 */
exports.getQuestion = (req, res) => {
  // const id = req.params.id;
  res.render('question/profile', {
    title: 'Question'
  });
};

/**
 * POST /question/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/question');
  }

  Question.findById(req.question.id, (err, question) => {
    if (err) { return next(err); }
    question.email = req.body.email || '';
    question.profile.name = req.body.name || '';
    question.profile.gender = req.body.gender || '';
    question.profile.location = req.body.location || '';
    question.profile.website = req.body.website || '';
    question.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The email address you have entered is already associated with an question.' });
          return res.redirect('/question');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Profile information has been updated.' });
      res.redirect('/question');
    });
  });
};

/**
 * POST /question/delete
 * Delete  question.
 */
exports.postDeleteAccount = (req, res, next) => {
  Question.remove({ _id: req.question.id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    req.flash('info', { msg: 'Your question has been deleted.' });
    res.redirect('/');
  });
};