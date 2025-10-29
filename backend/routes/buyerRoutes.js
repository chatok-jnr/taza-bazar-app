const express = require('express');
const buyerController = require('./../controllers/buyerController');
const {protect} = require('./../middleware/authMiddleware');
const alreadyBid = require('./../middleware/alreadyBid');
const router = express.Router();

//router.use(protect);

router  
  .route('/')
  .post(alreadyBid.alreadyBid, buyerController.placeBid)  //https://taza-bazar-admin.onrender.com/api/v1/buyer

router
  .route('/accepted') //https://taza-bazar-admin.onrender.com/api/v1/buyer/accepted
  .post(buyerController.acceptedBid)

router
  .route('/bids') //https://taza-bazar-admin.onrender.com/api/v1/buyer/bids
  .post(buyerController.bidPlaced)
  .patch(buyerController.updateBid)

module.exports = router;