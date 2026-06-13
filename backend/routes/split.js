const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const splitController = require('../controllers/splitController');

router.post('/', upload.single('file'), splitController.split);

module.exports = router;
