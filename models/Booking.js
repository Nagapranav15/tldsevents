const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookingId: String,
  name: String,
  email: String,
  ticketType: String,
  totalTickets: Number,
  eventId: String,
  eventTitle: String,
  used: { type: Boolean, default: false }
});

module.exports = mongoose.model("Booking", bookingSchema);