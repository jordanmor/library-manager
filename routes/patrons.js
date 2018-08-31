const express = require('express');
const router = express.Router();
const Patrons = require('../models').Patrons;
const Books = require('../models').Books;
const Loans = require('../models').Loans;
const paginate = require('../utilities/paginate');
const calculateOffset = require('../utilities/calculateOffset');
const pageLimit = 5;

// GET all patrons
router.get('/', (req, res) => {

  const offset = calculateOffset(req.query.page, pageLimit);

  Patrons.findAndCountAll({
    limit: pageLimit,
    offset: offset
  })
    .then(result => {
      const pageUrl = '/patrons';
      const pages = paginate(result.count, pageLimit);  
      res.render('patrons/index', {
        pageUrl,
        pages,
        patrons: result.rows
      })
    })
    .catch(err => res.sendStatus(500));
});

// Create a new patron form
router.get('/new', (req, res) => {
  res.render('patrons/new', { patron: Patrons.build() });
});

// POST create patron
router.post('/new', (req, res) => {
  Patrons.create(req.body)
    .then(patrons => res.redirect('/patrons'))
    .catch(err => {
      if(err.name === 'SequelizeValidationError') {
        res.render('patrons/new', {
          patron: Patrons.build(req.body),
          errors: err.errors
        })
      } else {throw err;}
    })
    .catch(err => res.sendStatus(500));
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
    .then( patron => {
      if (patron) {
        res.render('patrons/detail', {
          form: patron,
          patron: patron,
          loans: patron.Loans
        })
      }
    })
    .catch(err => res.sendStatus(500));
});

// PUT update book
router.put("/:id", (req, res) => {
  Patrons.findById(req.params.id)
    .then(patron => patron.update(req.body))
    .then(patron => res.redirect('/patrons'))
    .catch(err => {

      if (err.name === 'SequelizeValidationError') {
        const updatedPatron = Patrons.build(req.body);
        updatedPatron.id = req.params.id;

        Patrons.findById(req.params.id, {
          include: [{
            model: Loans, 
              include: [{
                model: Books
              }]
            }]
          })
          .then( patron => {
            if (patron) {
              res.render('patrons/detail', { 
                form: updatedPatron,
                patron: patron,
                loans: patron.Loans,
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