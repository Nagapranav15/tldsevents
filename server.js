require("dotenv").config();

const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");

const ticketTemplate = require("./ticketTemplate");
const Booking = require("./models/Booking");

const app = express();

/* ================= CONFIG ================= */

app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5500",
    "https://tldsevents.vercel.app"
  ]
}));

app.use(express.static("public"));
app.use("/tickets", express.static("uploads"));

/* ================= DB ================= */

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

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

/* ================= PDF CONTROL ================= */

let activePDFs = 0;
const MAX_PDFS = 3;

/* ================= EMAIL ================= */

async function sendMail(email, filePath){
  try{
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Event Ticket 🎟",
      text: "Your booking is confirmed. Ticket attached.",
      attachments: [{ path: filePath }]
    });

    console.log("MAIL SENT:", email);
  }catch(err){
    console.error("MAIL ERROR:", err.message);
  }
}

/* ================= CONFIG ================= */

app.get("/config",(req,res)=>{
  res.json({key:process.env.RAZORPAY_KEY_ID});
});

/* ================= AVAILABILITY ================= */

app.get("/availability", async (req,res)=>{

  const single = await Booking.aggregate([
    {$match:{ticketType:"single"}},
    {$group:{_id:null,total:{$sum:"$totalTickets"}}}
  ]);

  const couple = await Booking.aggregate([
    {$match:{ticketType:"couple"}},
    {$group:{_id:null,total:{$sum:"$totalTickets"}}}
  ]);

  res.json({
    singleAvailable: TOTAL_LIMIT.single - (single[0]?.total || 0),
    coupleAvailable: TOTAL_LIMIT.couple - (couple[0]?.total || 0)
  });

});

/* ================= CREATE ORDER ================= */

app.post("/create-order", async (req,res)=>{
  try{
    const order = await razorpay.orders.create({
      amount: req.body.amount * 100,
      currency:"INR",
      receipt:"receipt_"+Date.now()
    });

    res.json(order);
  }catch(err){
    console.error("RAZORPAY ERROR:", err);
    res.status(500).json({error:"Order failed"});
  }
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

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if(expected !== razorpay_signature){
    return res.json({status:"failure"});
  }

  if(ticketType === "single" && quantity > 10) return res.json({status:"max_limit"});
  if(ticketType === "couple" && quantity > 5) return res.json({status:"max_limit"});

  const sold = await Booking.aggregate([
    {$match:{ticketType}},
    {$group:{_id:null,total:{$sum:"$totalTickets"}}}
  ]);

  const available = TOTAL_LIMIT[ticketType] - (sold[0]?.total || 0);

  if(quantity > available){
    return res.json({status:"sold_out"});
  }

  const bookingId = "TLDS_" + Date.now();

  await Booking.create({
    bookingId,
    name,
    email,
    ticketType,
    totalTickets: quantity
  });

  const qrData = JSON.stringify({bookingId,name,ticketType,quantity});
  const qrImage = await QRCode.toDataURL(qrData);

  /* FAST RESPONSE */

  res.json({
    status:"success",
    bookingId,
    quantity,
    ticketType,
    name,
    qrData
  });

  /* BACKGROUND WORK */

  setImmediate(async () => {

    if(activePDFs >= MAX_PDFS){
      console.log("Skipping PDF:", bookingId);
      return;
    }

    activePDFs++;

    try{

      const uploadDir = path.join(__dirname,"uploads");
      if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

      const filePath = path.join(uploadDir, "ticket_"+Date.now()+".pdf");

      const html = ticketTemplate({
        name,
        ticketType,
        quantity,
        bookingId,
        qrImage
      });

      const browser = await puppeteer.launch({
        headless:true,
        args:["--no-sandbox","--disable-setuid-sandbox"]
      });

      const page = await browser.newPage();
      await page.setContent(html,{waitUntil:"networkidle0"});

      await page.pdf({
        path:filePath,
        format:"A4",
        printBackground:true
      });

      await browser.close();

      await sendMail(email,filePath);

      console.log("DONE:", bookingId);

    }catch(err){
      console.error("BACKGROUND ERROR:", err);
    }finally{
      activePDFs--;
    }

  });

});

/* ================= ADMIN ================= */

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_TOKEN = "secure_admin_token_123";

function verifyAdmin(req,res,next){
  const token = req.headers.authorization?.split(" ")[1];
  if(token !== ADMIN_TOKEN) return res.status(403).json({error:"Unauthorized"});
  next();
}

app.post("/admin-login",(req,res)=>{
  const {username,password} = req.body;

  if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD){
    return res.json({success:true, token: ADMIN_TOKEN});
  }

  res.json({success:false});
});

app.get("/admin-data", verifyAdmin, async (req,res)=>{

  try{

    const bookings = await Booking.find().sort({ _id: -1 });

    let single = 0;
    let couple = 0;

    bookings.forEach(b => {

      const type = (b.ticketType || "").toLowerCase().trim();
      const qty = Number(b.totalTickets) || 0;

      if(type === "single"){
        single += qty;
      } 
      else if(type === "couple"){
        couple += qty;
      }

    });

    const stats = {
      totalRevenue: (single * 499) + (couple * 899),
      singleSold: single,
      coupleSold: couple
    };

    console.log("STATS:", stats);

    res.json({
      bookings,
      stats
    });

  }catch(err){
    console.error("ADMIN DATA ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }

});

app.delete("/delete-booking", verifyAdmin, async (req,res)=>{
  await Booking.deleteOne({bookingId:req.body.bookingId});
  res.json({status:"deleted"});
});

/* ================= START ================= */

app.listen(process.env.PORT || 5000, ()=>{
  console.log("Server running");
});