const express = require("express");
const farmAlertController = require("./../controllers/farmAlertController");
const { protect } = require("./../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router
  .route("/")
  .post(farmAlertController.createAlert); //http://127.0.0.1:8000/api/v1/farmAlert

router
  .route("/:id")
  .get(farmAlertController.allAlert);

module.exports = router;
