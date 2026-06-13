const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const watermarkController = require('../controllers/watermarkController');

router.post('/', upload.single('file'), watermarkController.watermark);

module.exports = router;
