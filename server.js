require("dotenv").config();

const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const ticketTemplate = require("./ticketTemplate");

const app = express();

app.use(cors({origin:"*"}));
app.use(express.json());
app.use(express.static("public"));
app.use("/tickets", express.static("uploads"));

/* ================= DB ================= */

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

const Booking = require("./models/Booking");

/* ================= EMAIL ================= */

async function sendMail(email, filePath){

  try{

    console.log("📧 Attempting to send mail to:", email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Event Ticket 🎟",
      text: "Your booking is confirmed. Ticket attached.",
      attachments: [{ path: filePath }]
    });

    console.log("✅ MAIL SENT:", info.response);

  }catch(err){
    console.error("❌ MAIL ERROR:", err.message);
  }

}

/* ================= LIMIT ================= */

const TOTAL_LIMIT = {
  single: 100,
  couple: 25
};

/* ================= RAZORPAY ================= */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

/* ================= CONFIG ================= */

app.get("/config",(req,res)=>{
  res.json({key:process.env.RAZORPAY_KEY_ID});
});

/* ================= AVAILABILITY ================= */

app.get("/availability", async (req,res)=>{

  const singleSold = await Booking.aggregate([
    { $match: { ticketType: "single" } },
    { $group: { _id: null, total: { $sum: "$totalTickets" } } }
  ]);

  const coupleSold = await Booking.aggregate([
    { $match: { ticketType: "couple" } },
    { $group: { _id: null, total: { $sum: "$totalTickets" } } }
  ]);

  const singleCount = singleSold[0]?.total || 0;
  const coupleCount = coupleSold[0]?.total || 0;

  res.json({
    singleAvailable: TOTAL_LIMIT.single - singleCount,
    coupleAvailable: TOTAL_LIMIT.couple - coupleCount
  });

});

/* ================= CREATE ORDER ================= */

app.post("/create-order", async (req,res)=>{
  const { amount } = req.body;

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency:"INR",
    receipt:"receipt_"+Date.now()
  });

  res.json(order);
});

/* ================= VERIFY PAYMENT ================= */

app.post("/verify-payment", async (req,res)=>{

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    name,
    email,
    ticketType,
    quantity
  } = req.body;

  /* VERIFY SIGNATURE */

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expected = crypto
  .createHmac("sha256", process.env.RAZORPAY_SECRET)
  .update(body)
  .digest("hex");

  if(expected !== razorpay_signature){
    return res.json({status:"failure"});
  }

  /* LIMIT */

  if(ticketType === "single" && quantity > 10){
    return res.json({status:"max_limit"});
  }

  if(ticketType === "couple" && quantity > 5){
    return res.json({status:"max_limit"});
  }

  /* AVAILABILITY CHECK */

  const singleSold = await Booking.aggregate([
    { $match: { ticketType: "single" } },
    { $group: { _id: null, total: { $sum: "$totalTickets" } } }
  ]);

  const coupleSold = await Booking.aggregate([
    { $match: { ticketType: "couple" } },
    { $group: { _id: null, total: { $sum: "$totalTickets" } } }
  ]);

  const singleCount = singleSold[0]?.total || 0;
  const coupleCount = coupleSold[0]?.total || 0;

  const available = {
    single: TOTAL_LIMIT.single - singleCount,
    couple: TOTAL_LIMIT.couple - coupleCount
  };

  if(quantity > available[ticketType]){
    return res.json({status:"sold_out"});
  }

  /* CREATE BOOKING */

  const bookingId = "TLDS_" + Date.now();

  await Booking.create({
    bookingId,
    name,
    email,
    ticketType,
    totalTickets: quantity
  });

  /* QR */

  const qrData = JSON.stringify({
    bookingId,
    name,
    ticketType,
    quantity
  });

  const qrImage = await QRCode.toDataURL(qrData);

  /* PDF */

  const uploadDir = path.join(__dirname,"uploads");
  if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  const fileName = "booking_" + Date.now()+".pdf";
  const filePath = path.join(uploadDir,fileName);

  /* ================= PDF (DESIGNED) ================= */

const html = ticketTemplate({
  name,
  ticketType,
  quantity,
  bookingId,
  qrImage
});

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: "new"
});

const page = await browser.newPage();

await page.setContent(html, {
  waitUntil: "networkidle0"
});

await page.pdf({
  path: filePath,
  format: "A4",
  printBackground: true
});

await browser.close();

/* SEND MAIL */

try{
  await sendMail(email, filePath);
  console.log("MAIL SENT ✅");
}catch(err){
  console.error("MAIL ERROR ❌", err);
}

  

  /* RESPONSE */

  res.json({
    status:"success",
    bookingId,
    quantity,
    ticketType,
    name,
    qrData,
    downloadUrl:`/tickets/${fileName}`
  });

});

/* ================= ADMIN ================= */

const ADMIN_TOKEN = "secure_admin_token_123";

/* LOGIN */

app.post("/admin-login",(req,res)=>{
  const {username,password} = req.body;

  if(username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD){
    return res.json({success:true, token: ADMIN_TOKEN});
  }

  res.json({success:false});
});

/* ADMIN DATA */

app.get("/admin-data", async (req,res)=>{

  const token = req.headers.authorization;

  if(token !== ADMIN_TOKEN){
    return res.status(403).json({error:"Unauthorized"});
  }

  const bookings = await Booking.find().sort({ _id: -1 });

  let single = 0, couple = 0;

  bookings.forEach(b=>{
    if(b.ticketType==="single") single += b.totalTickets;
    if(b.ticketType==="couple") couple += b.totalTickets;
  });

  res.json({
    bookings,
    stats:{
      totalRevenue:(single*499)+(couple*899),
      singleSold:single,
      coupleSold:couple
    }
  });

});

/* DELETE */

app.delete("/delete-booking", async (req,res)=>{

  const token = req.headers.authorization;

  if(token !== ADMIN_TOKEN){
    return res.status(403).json({error:"Unauthorized"});
  }

  const { bookingId } = req.body;

  await Booking.deleteOne({bookingId});

  res.json({status:"deleted"});
});

app.post("/check-booking", async (req,res)=>{

  try{

    const { bookingId } = req.body;

    if(!bookingId){
      return res.json({status:"invalid"});
    }

    const booking = await Booking.findOne({ bookingId });

    if(!booking){
      return res.json({ status:"invalid" });
    }

    res.json({
      status:"ok",
      name: booking.name,
      type: booking.ticketType,
      quantity: booking.totalTickets,
      used: booking.used || false   // 🔥 FIX
    });

  }catch(err){
    console.error("CHECK ERROR:", err);
    res.status(500).json({status:"error"});
  }

});
app.post("/mark-booking-used", async (req,res)=>{

  try{

    const { bookingId } = req.body;

    const booking = await Booking.findOne({ bookingId });

    if(!booking){
      return res.json({ status:"invalid" });
    }

    if(booking.used){
      return res.json({ status:"already_used" });
    }

    booking.used = true;
    await booking.save();

    res.json({ status:"success" });

  }catch(err){
    console.error("MARK ERROR:", err);
    res.status(500).json({status:"error"});
  }

});

/* ================= START ================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));
