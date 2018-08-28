const express = require('express');
const router = express.Router();
// const Book = require('../models').Book;

// GET all books
router.get('/', (req, res) => {
  // Book.findAll()
  //   .then(books => res.render('books/index', {books: books}))
  //   .catch(err => res.sendStatus(500));
  res.render('books/index');
});

module.exports = router;