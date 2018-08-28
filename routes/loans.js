const express = require('express');
const router = express.Router();

// GET all loans
router.get('/', (req, res) => {
  res.render('loans/index');
});

module.exports = router;