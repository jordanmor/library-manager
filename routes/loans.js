const express = require('express');
const router = express.Router();
const Loans = require('../models').Loans;
// const Books = require('../models').Books;
// const Patrons = require('../models').Patrons;

// GET all books
router.get('/', (req, res) => {
  Loans.findAll({
    include: [{
      all: true 
      }]
    })
    .then(loans => res.render('loans/index', {loans: loans}))
    .catch(err => res.sendStatus(500));
});

router.get('/new', (req, res) => {
  res.render('loans/new');
});

router.get('/return', (req, res) => {
  res.render('loans/return');
});

module.exports = router;