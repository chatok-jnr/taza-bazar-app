const express = require('express');
const bidController = require('./../controllers/farmerBidController');

const { protect } = require('./../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

//http://127.0.0.1:8000/api/v1/farmerBid
router
  .route('/')
  .post(bidController.placeBid)


router
  .route('/:id')
  .get(bidController.getAllBid)
  .patch(bidController.consumerDecession)

module.exports = router;

