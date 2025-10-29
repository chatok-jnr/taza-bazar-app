const express = require('express');
const bidController = require('./../controllers/farmerBidController');

const { protect } = require('./../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

//https://taza-bazar-admin.onrender.com/api/v1/farmerBid
router
  .route('/')
  .post(bidController.placeBid)


router
  .route('/:id')
  .get(bidController.getAllBid)
  .patch(bidController.consumerDecession) //https://taza-bazar-admin.onrender.com/api/v1/farmerBid/paste_the_bid_id_here

module.exports = router;

