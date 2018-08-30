const express = require('express');
const router = express.Router();
const Books = require('../models').Books;
const Patrons = require('../models').Patrons;
const Loans = require('../models').Loans;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// GET all books
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


router.get('/new', (req, res) => {
  res.render('books/new');
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
    .then( book => 
      book ? res.render('books/detail', {book: book}) : res.sendStatus(404))
    .catch(err => res.sendStatus(500));
});

router.get('/detail', (req, res) => {
  res.render('books/detail');
});

/* Edit article form. */
// router.get("/:id/edit", (req, res) => {
//   Article.findById(req.params.id)
//     .then(article =>
//       article ? res.render("articles/edit", {article: article, title: "Edit Article"}) : res.sendStatus(404))
//     .catch(err => res.sendStatus(500));
// });

module.exports = router;