const express = require('express');
const adminControll = require('../controllers/adminController');
const authAdmin = require('./../controllers/authAdmin');

const router = express.Router();

router
  .route('/signUp')
  .post(authAdmin.signUp);

router
  .route('/signIn')
  .post(authAdmin.signIn)
module.exports = router;