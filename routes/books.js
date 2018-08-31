const express = require('express');
const router = express.Router();
const Books = require('../models').Books;
const Patrons = require('../models').Patrons;
const Loans = require('../models').Loans;
const Sequelize = require('sequelize');
const { paginate, setActivePage, setOffset } = require('../utilities/paginate');
const Op = Sequelize.Op;
const pageLimit = 5;

// GET all books
router.get('/', (req, res) => {

  const offset = setOffset(req.query.page, pageLimit);

  Books.findAndCountAll({
    limit: pageLimit,
    offset: offset
  })
  .then(result => {
    const pageUrl = '/books';
    const pages = paginate(result.count, pageLimit);
    setActivePage(pages, req.query.page);
    res.render('books/index', {
      pageUrl,
      pages,
      books: result.rows
    })
  })
  .catch(err => res.sendStatus(500));
});

// GET overdue books
router.get('/overdue', (req, res) => {

  const offset = setOffset(req.query.page, pageLimit);

  Books.findAndCountAll({
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
    }],
    limit: pageLimit,
    offset: offset
  })
  .then(result => {
    const pageUrl = '/books/overdue';
    const pages = paginate(result.count, pageLimit);
    setActivePage(pages, req.query.page);
    res.render('books/index', {
      pageUrl,
      pages,
      books: result.rows
    })
  })
  .catch(err => res.sendStatus(500));
});

// GET checked out books
router.get('/checked_out', (req, res) => {

  const offset = setOffset(req.query.page, pageLimit);

  Books.findAndCountAll({
    include: [{
      model: Loans,
      where: {
        loaned_on: {
          [Op.ne]: null
        },
        returned_on: null
      }
    }],
    limit: pageLimit,
    offset: offset
  })
  .then(result => {
    const pageUrl = '/books/checked_out';
    const pages = paginate(result.count, pageLimit);
    setActivePage(pages, req.query.page);
    res.render('books/index', {
      pageUrl,
      pages,
      books: result.rows
    })
  })
  .catch(err => res.sendStatus(500));
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