const express = require('express');
const latestRequest = require('./../controllers/latestRequestController');
const router = express.Router();

router
  .route('/')
  .get(latestRequest.latestRequest);

module.exports = router;