const express = require('express');
const router = express.Router();
const Loans = require('../models').Loans;
const Books = require('../models').Books;
const Patrons = require('../models').Patrons;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');

// GET all loans / overdue loans / checked out loans
router.get('/', (req, res) => {
  Loans.findAll({
    include: [{
      all: true 
      }]
    })
    .then(loans => res.render('loans/index', {loans: loans}))
    .catch(err => res.sendStatus(500));
});

// GET overdue loans
router.get('/overdue', (req, res) => {
  Loans.findAll({
    include: [{
      all: true
    }],
    where: {
      loaned_on: {
        [Op.ne]: null
      },
      return_by: {
        [Op.lt]: new Date()
      },
      returned_on: null
    }
  })
  .then(loans => res.render('loans/index', {loans: loans}))
  .catch(err => res.sendStatus(500));
});

// GET checked out loans
router.get('/checked_out', (req, res) => {
  Loans.findAll({
    include: [{
      all: true
    }],
    where: {
      loaned_on: {
        [Op.ne]: null
      },
      returned_on: null
    }
  })
  .then(loans => res.render('loans/index', {loans: loans}))
  .catch(err => res.sendStatus(500));
});

router.get('/new', (req, res) => {

  const books = Books.findAll();
  const patrons = Patrons.findAll();
  Promise.all([books, patrons])
    .then( results => {
      const now = moment().format('YYYY-MM-DD');
      const nextWeek = moment().add(7, 'days').format('YYYY-MM-DD');
      res.render('loans/new', {
        loan: Loans.build(),
        books: results[0],
        patrons: results[1],
        loaned_on: now,
        return_by: nextWeek
      });
    })
    .catch(err => res.sendStatus(500));
});

router.post('/new', (req, res) => {
  Loans.create(req.body)
    .then(loan => res.redirect('/loans'))
    .catch(err => {
      if (err.name === 'SequelizeValidationError') {

        const booksPromise = Books.findAll();
        const patronsPromise = Patrons.findAll();
        Promise.all([booksPromise, patronsPromise])
          .then( results => {

            const books = results[0].map(book => {
              const { id, title } = book;
              if(book.id == req.body.book_id) {
                return { id, title, selected: true };
              } else {
                return { id, title };
              }
            });

            const patrons = results[1].map(patron => {
              const { id, first_name, last_name } = patron;
              if(patron.id == req.body.patron_id) {
                return { id, first_name, last_name, selected: true };
              } else {
                return { id, first_name, last_name };
              }
            });

            res.render('loans/new', {
              loan: Loans.build(),
              books: books,
              patrons: patrons,
              loaned_on: req.body.loaned_on,
              return_by: req.body.return_by,
              errors: err.errors
          });
        })
        .catch(err => res.sendStatus(500));
      }  
    })
    .catch(err => res.sendStatus(500));
});

router.get('/:id/return', (req, res) => {
  Loans.findById(req.params.id, {
    include: [{
      all: true 
      }]
    })
    .then(loan => {
      const now = moment().format('YYYY-MM-DD');
      res.render('loans/return', {loan: loan, date: now})
    })
    .catch(err => res.sendStatus(500));
});

// PUT update loan
router.put('/:id/return', (req, res) => {
  Loans.findById(req.params.id)
    .then(loan => loan.update(req.body))
    .then(loan => res.redirect('/loans'))
    .catch(err => {
      if (err.name === 'SequelizeValidationError') {
        Loans.findById(req.params.id, {
          include: [{
            all: true 
            }]
          })
          .then(loan => {
            res.render('loans/return', {loan: loan, errors: err.errors})
          })
          .catch(err => res.sendStatus(500));
      }
    });
});

module.exports = router;