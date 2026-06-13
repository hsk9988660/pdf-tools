const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const compressController = require('../controllers/compressController');

router.post('/', upload.single('file'), compressController.compress);

module.exports = router;
