const express = require('express');
const adminControll = require('../controllers/adminController');
const authAdmin = require('./../controllers/authAdmin');
const { protect } = require('./../controllers/authAdmin');
const router = express.Router();

// router
//   .route('/signUp')
//   .post(authAdmin.signUp);

router
  .route('/signIn')
  .post(authAdmin.signIn)

router.use(protect);
router 
  .route('/allUser')
  .get(adminControll.getAllUser)

router
  .route('/allList')
  .get(adminControll.getAllList);

router
  .route('/allReq')
  .get(adminControll.getAllReq);

router
  .route('/allBid')
  .get(adminControll.getAllBid);

router 
  .route('/userStatus/:id')
  .patch(adminControll.userStatus)

router
  .route('/deal/farmerReq') // If Accepted or Rejected
  .get(adminControll.getAllFarmerReq)
  .patch(adminControll.updateVerdict)
  .delete(adminControll.deleteProduct);

router 
  .route('/deal/consumerReq')
  .get(adminControll.getAllConsumerReq)
  .patch(adminControll.updateVerdictConsumer)
  .delete(adminControll.deleteConsumerReq);

router
  .route('/announcement')
  .post(adminControll.createAnnouncemnet)
  .get(adminControll.getAllAnnouncement);

router
  .route('/announcement/:id') 
  .get(adminControll.getMyAnnouncement)
  .delete(adminControll.deleteAnnouncement); 

router  
  .route('/auditLogs')
  .get(adminControll.auditLogs);

module.exports = router;