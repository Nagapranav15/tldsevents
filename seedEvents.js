require("dotenv").config();
const mongoose = require("mongoose");
const Event = require("./models/Event");

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => {
  console.log("MongoDB Connection Error:", err);
  process.exit(1);
});

const sampleEvents = [
  {
    title: "Tollywood Mehfil",
    description: "Electrifying jamming session celebrating Telugu cinema music",
    longDescription: "Tollywood Mehfil is an electrifying jamming session that brings together music lovers, performers, and enthusiasts to celebrate the vibrant spirit of Telugu cinema. Experience live performances of your favorite Telugu film songs in an unforgettable atmosphere.",
    image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
    date: "June 15, 2026",
    time: "7:00 PM",
    venue: "Vijayawada Convention Center",
    singlePrice: 499,
    couplePrice: 899,
    singleLimit: 100,
    coupleLimit: 25,
    isActive: true
  },
  {
    title: "Bollywood Night",
    description: "An evening of mesmerizing Bollywood music and dance",
    longDescription: "Join us for an unforgettable Bollywood Night featuring top performers and dancers. Experience the magic of Indian cinema with live music, spectacular performances, and an energetic atmosphere.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    date: "July 20, 2026",
    time: "8:00 PM",
    venue: "Novotel Vijayawada",
    singlePrice: 599,
    couplePrice: 1099,
    singleLimit: 150,
    coupleLimit: 50,
    isActive: true
  },
  {
    title: "Tech Summit 2026",
    description: "Premier technology conference featuring industry leaders",
    longDescription: "Tech Summit 2026 brings together the brightest minds in technology. Learn from industry leaders, network with professionals, and discover the latest innovations shaping our future.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    date: "August 10, 2026",
    time: "9:00 AM",
    venue: "HICC Vijayawada",
    singlePrice: 1999,
    couplePrice: 3499,
    singleLimit: 500,
    coupleLimit: 100,
    isActive: true
  }
];

async function seedEvents() {
  try {
    await Event.deleteMany({});
    console.log("Cleared existing events");
    
    const createdEvents = await Event.insertMany(sampleEvents);
    console.log("Sample events created:", createdEvents.length);
    
    console.log("\nEvents:");
    createdEvents.forEach(event => {
      console.log(`- ${event.title} (${event.date})`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error("Error seeding events:", err);
    process.exit(1);
  }
}

seedEvents();
