const express = require('express');
const router = express.Router();
const conversionService = require('../services/conversionService');

// GET /api/stats - Get usage statistics
router.get('/', async (req, res, next) => {
  try {
    const stats = await conversionService.getStats();
    res.json({ success: true, ...stats });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
