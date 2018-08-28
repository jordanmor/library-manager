const express = require('express');
const router = express.Router();

// GET all patrons
router.get('/', (req, res) => {
  res.render('patrons/index');
});

module.exports = router;