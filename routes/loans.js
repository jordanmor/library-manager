const express = require('express');
const router = express.Router();

// GET all loans
router.get('/', (req, res) => {
  res.render('loans/index');
});

router.get('/new', (req, res) => {
  res.render('loans/new');
});

router.get('/return', (req, res) => {
  res.render('loans/return');
});

module.exports = router;