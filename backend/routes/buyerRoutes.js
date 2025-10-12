const express = require('express');
const buyerController = require('./../controllers/buyerController');
const {protect} = require('./../middleware/authMiddleware');
const alreadyBid = require('./../middleware/alreadyBid');
const router = express.Router();

router.use(protect);

router  
  .route('/')
  .post(alreadyBid.alreadyBid, buyerController.placeBid)  //http://127.0.0.1:8000/api/v1/buyer

router
  .route('/accepted') //http://127.0.0.1:8000/api/v1/buyer/accepted
  .post(buyerController.acceptedBid)

router
  .route('/bids') //http://127.0.0.1:8000/api/v1/buyer/bids
  .post(buyerController.bidPlaced)
  .patch(buyerController.updateBid)

module.exports = router;