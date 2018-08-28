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

router.get('/new', (req, res) => {
  res.render('books/new');
});

router.get('/detail', (req, res) => {
  res.render('books/detail');
});

module.exports = router;