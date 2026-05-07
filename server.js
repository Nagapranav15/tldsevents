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
const Event = require("./models/Event");

const app = express();

/* ================= CONFIG ================= */

app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5000",
    "http://localhost:5500",
    "https://tldsevents.vercel.app",
    process.env.RENDER_EXTERNAL_URL
  ].filter(Boolean)
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

/* ================= CHECK BOOKING ================= */

app.post("/check-booking", async (req,res)=>{
  try{
    const {bookingId} = req.body;
    
    const booking = await Booking.findOne({bookingId});
    if(!booking){
      return res.json({status:"error",message:"Booking not found"});
    }
    
    res.json({
      status:"ok",
      name: booking.name,
      type: booking.ticketType,
      quantity: booking.totalTickets,
      used: booking.used || false
    });
  }catch(err){
    console.error("CHECK BOOKING ERROR:", err);
    res.status(500).json({status:"error",message:"Server error"});
  }
});

/* ================= DOWNLOAD TICKET ================= */

app.get("/download-ticket/:bookingId", async (req,res)=>{
  try{
    const {bookingId} = req.params;
    
    const booking = await Booking.findOne({bookingId});
    if(!booking){
      return res.status(404).json({error:"Booking not found"});
    }
    
    const event = await Event.findById(booking.eventId);
    if(!event){
      return res.status(404).json({error:"Event not found"});
    }
    
    // Generate QR code
    const qrData = {
      bookingId: booking.bookingId,
      name: booking.name,
      email: booking.email,
      ticketType: booking.ticketType,
      quantity: booking.totalTickets,
      eventId: booking.eventId,
      eventTitle: event.title,
      timestamp: booking.createdAt
    };
    
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData));
    
    // Generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const ticketHTML = ticketTemplate(booking, event, qrCodeDataURL);
    
    await page.setContent(ticketHTML);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true
    });
    
    await browser.close();
    
    // Set headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="ticket_${bookingId}.pdf"`);
    res.send(pdfBuffer);
    
  }catch(err){
    console.error("DOWNLOAD TICKET ERROR:", err);
    res.status(500).json({error:"Failed to generate ticket"});
  }
});

/* ================= MARK BOOKING UNUSED ================= */

app.post("/mark-booking-unused", verifyAdmin, async (req,res)=>{
  try{
    const {bookingId} = req.body;
    
    const booking = await Booking.findOne({bookingId});
    if(!booking){
      return res.json({status:"error",message:"Booking not found"});
    }
    
    booking.used = false;
    await booking.save();
    
    res.json({status:"ok"});
  }catch(err){
    console.error("MARK BOOKING UNUSED ERROR:", err);
    res.status(500).json({status:"error",message:"Server error"});
  }
});

/* ================= MARK BOOKING USED ================= */

app.post("/mark-booking-used", verifyAdmin, async (req,res)=>{
  try{
    const {bookingId} = req.body;
    
    const booking = await Booking.findOne({bookingId});
    if(!booking){
      return res.json({status:"error",message:"Booking not found"});
    }
    
    booking.used = true;
    await booking.save();
    
    res.json({status:"ok"});
  }catch(err){
    console.error("MARK BOOKING USED ERROR:", err);
    res.status(500).json({status:"error",message:"Server error"});
  }
});

/* ================= BOOKING ID COUNTER ================= */

async function getNextBookingId() {
  const Booking = require('./models/Booking');
  const lastBooking = await Booking.findOne().sort({ _id: -1 });
  
  let nextNumber = 1;
  if (lastBooking && lastBooking.bookingId) {
    const lastNumber = parseInt(lastBooking.bookingId.replace('TLDS_', ''));
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }
  
  return `TLDS_${nextNumber.toString().padStart(3, '0')}`;
}

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

async function sendMailBuffer(email, pdfBuffer, bookingId){
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
      text: `Your booking is confirmed! Your ticket ID is ${bookingId}. Ticket is attached.`,
      attachments: [{
        filename: `ticket_${bookingId}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }]
    });

    console.log("MAIL SENT:", email, "Booking ID:", bookingId);
  }catch(err){
    console.error("MAIL ERROR:", err.message);
  }
}

/* ================= CONFIG ================= */

app.get("/config",(req,res)=>{
  res.json({key:process.env.RAZORPAY_KEY_ID});
});

/* ================= EVENTS ================= */

app.get("/events", async (req,res)=>{
  try{
    const events = await Event.find({isActive:true}).sort({createdAt:-1});
    res.json(events);
  }catch(err){
    res.status(500).json({error:"Failed to fetch events"});
  }
});

app.get("/events/:id", async (req,res)=>{
  try{
    const event = await Event.findById(req.params.id);
    if(!event) return res.status(404).json({error:"Event not found"});
    res.json(event);
  }catch(err){
    res.status(500).json({error:"Failed to fetch event"});
  }
});

app.post("/events", verifyAdmin, async (req,res)=>{
  try{
    const event = await Event.create(req.body);
    res.json({success:true, event});
  }catch(err){
    console.error("CREATE EVENT ERROR:", err);
    res.status(500).json({error:"Failed to create event"});
  }
});

app.put("/events/:id", verifyAdmin, async (req,res)=>{
  try{
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {new:true});
    if(!event) return res.status(404).json({error:"Event not found"});
    res.json({success:true, event});
  }catch(err){
    console.error("UPDATE EVENT ERROR:", err);
    res.status(500).json({error:"Failed to update event"});
  }
});

app.delete("/events/:id", verifyAdmin, async (req,res)=>{
  try{
    const event = await Event.findByIdAndDelete(req.params.id);
    if(!event) return res.status(404).json({error:"Event not found"});
    res.json({success:true});
  }catch(err){
    console.error("DELETE EVENT ERROR:", err);
    res.status(500).json({error:"Failed to delete event"});
  }
});

/* ================= AVAILABILITY ================= */

app.get("/availability", async (req,res)=>{
  const eventId = req.query.eventId;

  const single = await Booking.aggregate([
    {$match:{ticketType:"single", eventId}},
    {$group:{_id:null,total:{$sum:"$totalTickets"}}}
  ]);

  const couple = await Booking.aggregate([
    {$match:{ticketType:"couple", eventId}},
    {$group:{_id:null,total:{$sum:"$totalTickets"}}}
  ]);

  const event = await Event.findById(eventId);

  res.json({
    singleAvailable: (event?.singleLimit || 100) - (single[0]?.total || 0),
    coupleAvailable: (event?.coupleLimit || 25) - (couple[0]?.total || 0)
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
    quantity,
    eventId,
    eventTitle
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if(expected !== razorpay_signature){
    return res.json({status:"failure"});
  }

  const event = await Event.findById(eventId);
  if(!event) return res.json({status:"invalid_event"});

  if(ticketType === "single" && quantity > 10) return res.json({status:"max_limit"});
  if(ticketType === "couple" && quantity > 5) return res.json({status:"max_limit"});

  const sold = await Booking.aggregate([
    {$match:{ticketType, eventId}},
    {$group:{_id:null,total:{$sum:"$totalTickets"}}}
  ]);

  const limit = ticketType === "single" ? event.singleLimit : event.coupleLimit;
  const available = limit - (sold[0]?.total || 0);

  if(quantity > available){
    return res.json({status:"sold_out"});
  }

  const bookingId = await getNextBookingId();

  await Booking.create({
    bookingId,
    name,
    email,
    ticketType,
    totalTickets: quantity,
    eventId,
    eventTitle
  });

  const qrData = JSON.stringify({
    bookingId,
    name,
    email,
    ticketType,
    quantity,
    eventId,
    eventTitle,
    timestamp: new Date().toISOString()
  });
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

  /* BACKGROUND WORK - Generate PDF in memory only */

  setImmediate(async () => {

    if(activePDFs >= MAX_PDFS){
      console.log("Skipping PDF:", bookingId);
      return;
    }

    activePDFs++;

    try{

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

      const pdfBuffer = await page.pdf({
        format:"A4",
        printBackground:true
      });

      await browser.close();

      // Send email with PDF buffer (no local file)
      await sendMailBuffer(email, pdfBuffer, bookingId);

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
    const eventId = req.query.eventId;

    const bookings = await Booking.find(eventId ? {eventId} : {}).sort({ _id: -1 });
    const events = await Event.find({isActive:true});

    let single = 0;
    let couple = 0;
    let totalRevenue = 0;

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

    // Calculate revenue based on event prices
    if(eventId){
      const event = await Event.findById(eventId);
      if(event){
        totalRevenue = (single * event.singlePrice) + (couple * event.couplePrice);
      }
    }else{
      // Calculate revenue for all events
      for(const booking of bookings){
        const event = await Event.findById(booking.eventId);
        if(event){
          const qty = Number(booking.totalTickets) || 0;
          if(booking.ticketType === "single"){
            totalRevenue += qty * event.singlePrice;
          }else if(booking.ticketType === "couple"){
            totalRevenue += qty * event.couplePrice;
          }
        }
      }
    }

    const stats = {
      totalRevenue,
      singleSold: single,
      coupleSold: couple,
      eventId
    };

    console.log("STATS:", stats);

    res.json({
      bookings,
      stats,
      events
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

/* ================= CONTACT FORM ================= */

app.post("/contact", async (req,res)=>{
  try{
    const { name, email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Contact Form: ${subject}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `
    });

    res.json({success:true});
  }catch(err){
    console.error("CONTACT FORM ERROR:", err);
    res.status(500).json({success:false});
  }
});

/* ================= START ================= */

app.listen(process.env.PORT || 5000, ()=>{
  console.log("Server running");
});