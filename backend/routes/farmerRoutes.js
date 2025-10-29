const express = require('express');
const farmerController = require('./../controllers/farmerController');
const {protect} = require('./../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(farmerController.createProduct)
  .get(farmerController.getAllProduct)

router
  .route('/:id')
  .get(farmerController.getProductByUser)
  .patch(farmerController.updateProduct)
  .delete(farmerController.deleteProduct)

module.exports = router;