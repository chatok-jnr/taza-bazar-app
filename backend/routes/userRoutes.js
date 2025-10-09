const express = require('express');
const userController = require('./../controllers/userController');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser)
  .delete(userController.deleteUser)

router
  .route('/login')
  .post(userController.loginUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router;