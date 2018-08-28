const express = require('express');
const router = express.Router();

// GET all patrons
router.get('/', (req, res) => {
  res.render('patrons/index');
});

router.get('/new', (req, res) => {
  res.render('patrons/new');
});

router.get('/detail', (req, res) => {
  res.render('patrons/detail');
});

module.exports = router;