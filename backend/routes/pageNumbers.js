const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const pageNumbersController = require('../controllers/pageNumbersController');

router.post('/', upload.single('file'), pageNumbersController.addPageNumbers);

module.exports = router;
