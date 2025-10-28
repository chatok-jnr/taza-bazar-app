const express = require("express");
const farmAlertController = require("./../controllers/farmAlertController");
const { protect } = require("./../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router
  .route("/")
  .post(farmAlertController.createAlert); //https://taza-bazar-admin.onrender.com/api/v1/farmAlert

router
  .route("/:id")
  .get(farmAlertController.allAlert);

module.exports = router;
