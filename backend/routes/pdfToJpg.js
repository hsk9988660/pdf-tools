const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const pdfToJpgController = require('../controllers/pdfToJpgController');

router.post('/', upload.single('file'), pdfToJpgController.convert);

module.exports = router;
