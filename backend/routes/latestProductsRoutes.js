const express = require('express');
const latestProducts = require('../controllers/latestProductsController');

const router = express.Router();

router
  .route('/')
  .get(latestProducts.getLatestProducts);

module.exports = router;