const mongoose = require("mongoose");
const Buyer_request = require("./buyerModel");
const Farmer_product = require("./farmerModel");

const alertScheam = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    bidInfo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Buyer_request",
    },
    productInfo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Farmer_product",
    },
    status: {
      type: String,
      enum: ["Accepted", "Rejected"],
    },
  },
  {
    timestamps: true,
  }
);

const Consumer_alert = mongoose.model("Consumer_alert", alertScheam);
module.exports = Consumer_alert;

/*
When a farmer accept or reject a bid it will call on this api using a post method
api link = http://127.0.0.1:8000/api/v1/consumerAlert
with this body
{ 
  "user_id":paste_the_consumer_id_here,
  "bidInfo":paste_the_bid_object_id_here,
  "productInfo":paste_the_product_id_here,
  "status":"Accepted"
}
if user select accepted the status will be accepted otherwise it will be rejected



when a user come to the notification page it will call on this api link
with get method
http://127.0.0.1:8000/api/v1/consumerAlert/paste_the_user_id_here

and you will be get a response like this

{"status":"success","data":[{"_id":"68f891aa81e13e04b8f2d477","user_id":"68ebbdf27fe68ef34520a660","bidInfo":"68f88def81e13e04b8f2d474","productInfo":"68f88dda81e13e04b8f2d468","status":"Accepted","createdAt":"2025-10-22T08:11:22.620Z","updatedAt":"2025-10-22T08:11:22.620Z","__v":0},{"_id":"68f89458ca80c3888ae0343d","user_id":"68ebbdf27fe68ef34520a660","bidInfo":"68f8943cca80c3888ae03430","productInfo":"68f8941bca80c3888ae03420","status":"Rejected","createdAt":"2025-10-22T08:22:48.700Z","updatedAt":"2025-10-22T08:22:48.700Z","__v":0}]}

now if the status is rejected make the notificaion color red
and if the status is accepted make the notification color green
*/
