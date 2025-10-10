const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUser)
  .post(authController.createUser)
  .delete(userController.deleteUser)

router
  .route('/login')
  .post(authController.loginUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router;