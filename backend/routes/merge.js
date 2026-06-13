const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const mergeController = require('../controllers/mergeController');

router.post('/', upload.array('files', 20), mergeController.merge);

module.exports = router;
