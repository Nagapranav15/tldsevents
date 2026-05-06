const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  longDescription: String,
  image: String,
  date: String,
  time: String,
  venue: String,
  singlePrice: Number,
  couplePrice: Number,
  singleLimit: Number,
  coupleLimit: Number,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", eventSchema);
