const express = require('express');
const router = express.Router();
const Books = require('../models').Books;
const Patrons = require('../models').Patrons;
const Loans = require('../models').Loans;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// GET all books / overdue books / checked out books
router.get('/', (req, res) => {

  if (req.query.filter === 'overdue') {

    Books.findAll({
      include: [{
        model: Loans,
        where: {
          loaned_on: {
            [Op.ne]: null
          },
          return_by: {
            [Op.lt]: new Date()
          },
          returned_on: null
        }
      }]
    })
    .then(books => res.render('books/index', {books: books}))
    .catch(err => res.sendStatus(500));

  } else if (req.query.filter === 'checked_out'){
      Books.findAll({
        include: [{
          model: Loans,
          where: {
            loaned_on: {
              [Op.ne]: null
            },
            returned_on: null
          }
        }]
      })
      .then(books => res.render('books/index', {books: books}))
      .catch(err => res.sendStatus(500));

  } else {

      Books.findAll()
      .then(books => res.render('books/index', {books: books}))
      .catch(err => res.sendStatus(500));
  }
});

// Create a new book form
router.get('/new', (req, res) => {
  res.render('books/new', { book: Books.build() });
});

// POST create book
router.post('/new', (req, res) => {
  Books.create(req.body)
    .then( book => res.redirect('/books'))
    .catch(err => {
      if (err.name === 'SequelizeValidationError') {
        res.render("books/new", {
          book: Books.build(req.body), 
          errors: err.errors
        });
      } else {throw err;}
    })
    .catch(err => res.sendStatus(500));
});

// GET individual book
router.get("/:id", (req, res) => {
  // Use nested eager loading to load all related models of a related model
  Books.findById(req.params.id, {
    include: [{
      model: Loans, 
        include: [{
          model: Patrons
        }]
      }]
    })
    .then( book => {
      if (book) {
        res.render('books/detail', { 
          form: book, 
          book: book, 
          loans: book.Loans 
        })
      } else {
        res.sendStatus(404)
      }
    })
    .catch(err => res.sendStatus(500));
});

// PUT update book
router.put("/:id", (req, res) => {
  Books.findById(req.params.id)
    .then(book => book.update(req.body))
    .then(book => res.redirect('/books'))
    .catch(err => {

      if (err.name === 'SequelizeValidationError') {
        const updatedBook = Books.build(req.body);
        updatedBook.id = req.params.id;

        Books.findById(req.params.id, {
          include: [{
            model: Loans, 
              include: [{
                model: Patrons
              }]
            }]
          })
          .then( book => {
            if (book) {
              res.render('books/detail', { 
                form: updatedBook, 
                book: book, 
                loans: book.Loans, 
                errors: err.errors 
              })
            } else {
              res.sendStatus(404)
            }
          })
          .catch(err => res.sendStatus(500));

      } else {throw err;}
    })
    .catch(err => res.sendStatus(500));
});

module.exports = router;