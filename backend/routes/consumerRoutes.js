const express = require('express');
const consumerController = require('./../controllers/consumerController');

const router = express.Router();

router
  .route('/')
  .post(consumerController.createReq)
  .get(consumerController.getAllReq)

router
  .route('/:id')
  .get(consumerController.getUserReq)
  .patch(consumerController.updateReq)

module.exports = router;