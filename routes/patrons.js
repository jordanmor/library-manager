const express = require('express');
const router = express.Router();
const { Books, Patrons, Loans } = require('../models');
const { paginate, setOffset } = require('../utilities/paginate');
const { Op } = require('sequelize');
const pageLimit = 5;

/*=============-=============-=============-=============
        GET searched for patrons / GET all patrons
===============-=============-=============-===========*/

router.get('/', (req, res) => {
  const { keyword, input, page: currentPage } = req.query;
  const searchWasPerformed = keyword && input;
  const offset = setOffset(currentPage, pageLimit);

  if (searchWasPerformed) {

    Patrons.findAndCountAll({
      // Query filtered with search keyword and input
      where: {
        [keyword]: {
          [Op.like]: `%${input}%`
        }
      },
      limit: pageLimit,
      offset: offset
    })
    .then(result => {
      const templateData = {
        patrons: result.rows,
        pageUrl: '/patrons',
        search: {
          searchResult: true,
          list: 'patrons'
        },
        pagination: {
          pages: paginate(result.count, pageLimit, currentPage),
          query: `keyword=${keyword}&input=${input}&` 
        }
      }
      res.render('patrons/index', { templateData })
    })
    .catch(err => res.sendStatus(500));

  } else {
    // When no search is performed, all patrons listed
    Patrons.findAndCountAll({
      limit: pageLimit,
      offset: offset
    })
    .then(result => {
      const templateData = {
        patrons: result.rows,
        pageUrl: '/patrons',
        search: {
          list: 'patrons'
        },
        pagination: {
          pages: paginate(result.count, pageLimit, currentPage)
        }
      }
      res.render('patrons/index', { templateData })
    })
    .catch(err => res.sendStatus(500));
  }
});

/*=============-=============-=============-=============
                Create a new patron form
===============-=============-=============-===========*/

router.get('/new', (req, res) => {
  res.render('patrons/new', { patron: Patrons.build() });
});

/*=============-=============-=============-=============
                    POST create patron
===============-=============-=============-===========*/

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

/*=============-=============-=============-=============
                    GET individual patron
===============-=============-=============-===========*/

router.get("/:id", (req, res) => {
  // Use nested eager loading to load all related models of the patron model
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

/*=============-=============-=============-=============
                      PUT update patron
===============-=============-=============-===========*/

router.put("/:id", (req, res) => {
  Patrons.findById(req.params.id)
    .then(patron => patron.update(req.body))
    .then(patron => res.redirect('/patrons'))
    .catch(err => {

      if (err.name === 'SequelizeValidationError') {
        const updatedPatron = Patrons.build(req.body);
        updatedPatron.id = req.params.id;

        Patrons.findById(req.params.id, {
          // Use nested eager loading to load all related models of the patron model
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