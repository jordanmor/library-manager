const express = require('express');
const router = express.Router();
const { Books, Patrons, Loans } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

/*=============-=============-=============-=============
                       GET all loans
===============-=============-=============-===========*/

router.get('/', (req, res) => {
  Loans.findAll({
    // Include all attributes of all models related to the loans model
    include: [{
      all: true 
      }]
    })
    .then(loans => res.render('loans/index', {loans}))
    .catch(err => res.sendStatus(500));
});

/*=============-=============-=============-=============
                    GET all overdue loans
===============-=============-=============-===========*/

router.get('/overdue', (req, res) => {
  Loans.findAll({
    // Query filters: 
    // loan has a loaned_on date / return_by date is before today's date / no returned_on date
    where: {
      loaned_on: {
        [Op.ne]: null
      },
      return_by: {
        [Op.lt]: new Date()
      },
      returned_on: null
    },
    // Include all attributes of all models related to the loans model
    include: [{
      all: true
    }]
  })
  .then(loans => res.render('loans/index', {loans}))
  .catch(err => res.sendStatus(500));
});

/*=============-=============-=============-=============
                GET all checked out loans
===============-=============-=============-===========*/

router.get('/checked_out', (req, res) => {
  Loans.findAll({
    // Query filters: loan has a loaned_on date / no returned_on date
    where: {
      loaned_on: {
        [Op.ne]: null
      },
      returned_on: null
    },
    // Include all attributes of all models related to the loans model
    include: [{
      all: true
    }]
  })
  .then(loans => res.render('loans/index', {loans}))
  .catch(err => res.sendStatus(500));
});

/*=============-=============-=============-=============
                Create a new loan form
===============-=============-=============-===========*/

router.get('/new', (req, res) => {

  const books = Books.findAll();
  const patrons = Patrons.findAll();
  Promise.all([books, patrons])
    .then( results => {
      const templateData = {
        loan: Loans.build(),
        books: results[0],
        patrons: results[1],
        loaned_on: moment().format('YYYY-MM-DD'),
        return_by: moment().add(7, 'days').format('YYYY-MM-DD')
      }
      res.render('loans/new', { templateData })
    })
    .catch(err => res.sendStatus(500));
});

/*=============-=============-=============-=============
                    POST create loan
===============-=============-=============-===========*/

router.post('/new', (req, res) => {
  Loans.create(req.body)
    .then(loan => res.redirect('/loans'))
    .catch(err => {
      if (err.name === 'SequelizeValidationError') {

        const booksPromise = Books.findAll();
        const patronsPromise = Patrons.findAll();
        Promise.all([booksPromise, patronsPromise])
          .then( results => {
            
            // If book selected by user, keep same book selected after failed post request
            const books = results[0].map(book => {
              const { id, title } = book;
              if(book.id == req.body.book_id) {
                return { id, title, selected: true };
              } else {
                return { id, title };
              }
            });
            // If patron selected by user, keep same patron selected after failed post request
            const patrons = results[1].map(patron => {
              const { id, first_name, last_name } = patron;
              if(patron.id == req.body.patron_id) {
                return { id, first_name, last_name, selected: true };
              } else {
                return { id, first_name, last_name };
              }
            });
            // If user enters date, keep same date after failed post request
            const { loaned_on, return_by } = req.body;

            const templateData = {
              loan: Loans.build(),
              errors: err.errors,
              books,
              patrons,
              loaned_on,
              return_by
            }
            res.render('loans/new', { templateData });
        })
        .catch(err => res.sendStatus(500));
      }  
    })
    .catch(err => res.sendStatus(500));
});

/*=============-=============-=============-=============
                Create a new return form
===============-=============-=============-===========*/

router.get('/:id/return', (req, res) => {
  Loans.findById(req.params.id, {
    // Include all attributes of all models related to the loans model
    include: [{
      all: true 
      }]
    })
    .then(loan => {
      const now = moment().format('YYYY-MM-DD');
      res.render('loans/return', {loan, date: now})
    })
    .catch(err => res.sendStatus(500));
});

/*=============-=============-=============-=============
            PUT update loan with return date
===============-=============-=============-===========*/

router.put('/:id/return', (req, res) => {
  Loans.findById(req.params.id)
    .then(loan => loan.update(req.body))
    .then(loan => res.redirect('/loans'))
    .catch(err => {
      if (err.name === 'SequelizeValidationError') {
        Loans.findById(req.params.id, {
          // Include all attributes of all models related to the loans model
          include: [{
            all: true 
            }]
          })
          .then(loan => {
            const errors = err.errors;
            res.render('loans/return', {loan, errors})
          })
          .catch(err => res.sendStatus(500));
      }
    });
});

module.exports = router;