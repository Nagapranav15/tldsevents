const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  ticketID: String,
  name: String,
  email: String,
  ticketType: String,
  used: { type: Boolean, default: false }
});

module.exports = mongoose.model("Ticket", ticketSchema);