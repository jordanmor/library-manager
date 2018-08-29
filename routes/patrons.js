const express = require('express');
const router = express.Router();
const Patrons = require('../models').Patrons;
const Books = require('../models').Books;
const Loans = require('../models').Loans;

// GET all patrons
router.get('/', (req, res) => {
  Patrons.findAll()
    .then(patrons => res.render('patrons/index', {patrons: patrons}))
    .catch(err => res.sendStatus(500));
});

router.get('/new', (req, res) => {
  res.render('patrons/new');
});

// GET individual patron
router.get("/:id", (req, res) => {
  // Use nested eager loading to load all related models of a related model
  Patrons.findById(req.params.id, {
    include: [{
      model: Loans, 
        include: [{
          model: Books
        }]
      }]
    })
    .then( patron => 
      patron ? res.render('patrons/detail', {patron: patron}) : res.sendStatus(404))
    .catch(err => res.sendStatus(500));
});

module.exports = router;