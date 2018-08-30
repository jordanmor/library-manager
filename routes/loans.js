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

  if (req.query.filter === 'overdue') {

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

  } else if (req.query.filter === 'checked_out'){
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

  } else {

    Loans.findAll({
      include: [{
        all: true 
        }]
      })
      .then(loans => res.render('loans/index', {loans: loans}))
      .catch(err => res.sendStatus(500));
  }
});

router.get('/new', (req, res) => {

  const books = Books.findAll();
  const patrons = Patrons.findAll();
  Promise.all([books, patrons])
    .then( results => {
      const now = moment().format('YYYY-MM-DD');
      const nextWeek = moment().add(7, 'days').format('YYYY-MM-DD');
      res.render('loans/new', {
        books: results[0],
        patrons: results[1],
        date: now,
        nextWeek: nextWeek
      });
    })
    .catch(err => res.sendStatus(500));
});

router.post('/new', (req, res) => {
  console.log(req.body);
  res.redirect('/loans');
});

router.get('/return', (req, res) => {
  res.render('loans/return');
});

module.exports = router;