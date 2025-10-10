const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const {protect} = require('./../middleware/authMiddleware');
const router = express.Router();



router
  .route('/')
  .post(authController.createUser)

router
  .route('/login')
  .post(authController.loginUser);

router.use(protect);

router
  .route('/')
  .get(userController.getAllUser)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router;