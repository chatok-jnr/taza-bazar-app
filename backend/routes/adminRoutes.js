const express = require('express');
const adminControll = require('../controllers/adminController');
const authAdmin = require('./../controllers/authAdmin');

const router = express.Router();

// router
//   .route('/signUp')
//   .post(authAdmin.signUp);

router
  .route('/signIn')
  .post(authAdmin.signIn)

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

// router
//   .route('/adminDeal/')
//   .get(adminControll.adminDeal)
module.exports = router;