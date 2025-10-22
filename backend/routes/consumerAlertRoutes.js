const express = require("express");
const consumerAlertController = require("./../controllers/consumerAlertController");
//const {protect} = require('./../middleware/authMiddleware');

const router = express.Router();

//router.user(protect);

router
    .route("/")
    .post(consumerAlertController.createAlert);

router
    .route("/:id")
    .get(consumerAlertController.allAlert);

module.exports = router;