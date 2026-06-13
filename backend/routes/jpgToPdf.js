const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const jpgToPdfController = require('../controllers/jpgToPdfController');

router.post('/', upload.array('files', 20), jpgToPdfController.convert);

module.exports = router;
