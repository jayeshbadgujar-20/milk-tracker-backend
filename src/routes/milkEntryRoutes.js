const express = require('express');
const router = express.Router();
const { createMilkEntry, getMilkEntries } = require('../controllers/milkEntryController');

router.route('/')
  .post(createMilkEntry)
  .get(getMilkEntries);

module.exports = router;
