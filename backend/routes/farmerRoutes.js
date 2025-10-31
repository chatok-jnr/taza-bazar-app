const express = require('express');
const farmerController = require('./../controllers/farmerController');
const {protect} = require('./../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(farmerController.createProduct)
  .get(farmerController.getAllProduct);

router
  .route('/announcement')
  .get(farmerController.getAnnouncement); // 127.0.0.1:8000/api/v1/farmer/announcement

router
  .route('/:id')
  .get(farmerController.getProductByUser)
  .patch(farmerController.updateProduct)
  .delete(farmerController.deleteProduct)

module.exports = router;