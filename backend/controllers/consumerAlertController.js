const Consumer_alert = require("./../models/consumerAlertModel");

//create alert
exports.createAlert = async (req, res) => {
  try {
    const notify = await Consumer_alert.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Alert Created Successfully",
      data: notify,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

//Get all alert of user
exports.allAlert = async (req, res) => {
  try {
    const allNotify = await Consumer_alert.find({user_id:req.params.id})
      .populate("bidInfo")
      .populate("productInfo")

    res.status(200).json({
        status:"success",
        data:allNotify
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};