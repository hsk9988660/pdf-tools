const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const rotateController = require('../controllers/rotateController');

router.post('/', upload.single('file'), rotateController.rotate);

module.exports = router;
