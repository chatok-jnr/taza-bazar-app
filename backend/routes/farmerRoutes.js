const express = require('express');
const farmerController = require('./../controllers/farmerController');

const router = express.Router();

router
  .route('/')
  .post(farmerController.createProduct)
  .get(farmerController.getAllProduct)

router
  .route('/:id')
  .get(farmerController.getProductByUser)

module.exports = router;