const Farm_alert = require('./../models/farmAlert');

//Create Alert
exports.createAlert = async(req, res) => {
  try{
    const newAlert = await Farm_alert.create(req.body);

    res.status(201).json({
      success:true,
      message:"Alert created successfully",
      data:newAlert
    });
  } catch(err) {
    res.status(400).json({
      status:"Failed",
      message:err.message
    });
  } 
}

//Get all alert of user
exports.allAlert = async(req, res) => {
  try{
    const allAlert = await Farm_alert.find({user_id:req.params.id})
      .sort({createdAt:-1})
      .populate('reqInfo')
      .populate('bidInfo');

    res.status(200).json({
      status:"success",
      data:allAlert
    });
  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    });
  }
}

/*

When a consumer select accept or reject on a bid
then it will call on this api link with a post method
http://127.0.0.1:8000/api/v1/farmAlert
and the body will be look like this

  {
    "user_id":paste_the_farmer_id_here,
    "bidInfo":paste_the_bid_object_id_here,
    "reqInfo":paste_the_req_object_id here,
    "status":"Accepted"
  }





when someone will come to the notification page
it will call on this api link with get method
http://127.0.0.1:8000/api/v1/farmAlert/paste_the_user_id_here

and it will get a respone like this
{
    "status": "success",
    "data": [
        {
            "_id": "68f7cf3d6b1685949dccab3b",
            "user_id": "68e7f137030f97d4fe40fd7d",
            "bidInfo": "68f7cf3dfae1011db28a500e",
            "reqInfo": "68f7cea06b1685949dccab17",
            "status": "Rejected",
            "createdAt": "2025-10-21T18:21:49.977Z",
            "updatedAt": "2025-10-21T18:21:49.977Z",
            "__v": 0
        }
    ]
}

now if the status is reject it must be shown in red color
if its accepted it must be shown as green

*/