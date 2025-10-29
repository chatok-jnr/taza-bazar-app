const express = require('express');
const consumerController = require('./../controllers/consumerController');
const { protect } = require('./../middleware/authMiddleware');
const router = express.Router();

//router.use(protect);

router
  .route('/')
  .post(consumerController.createReq)
  .get(consumerController.getAllReq)

router
  .route('/:id')
  .get(consumerController.getUserReq)
  .patch(consumerController.updateReq)
  .delete(consumerController.deleteReq)
module.exports = router;