module.exports = ({ name, ticketType, quantity, bookingId, qrImage }) => {

return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Tollywood Mehfil Ticket</title>

<link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;600;700&display=swap" rel="stylesheet">

<style>
body {
  margin: 0;
  font-family: Helvetica, Arial, sans-serif;
  background: #e6e6e6;
  display: flex;
  justify-content: center;
  padding: 40px 10px;
}

.ticket {
  width: 100%;
  max-width: 1050px;
  background: linear-gradient(135deg, #7877e6, #7e86ee);
  border-radius: 28px;
  padding: 45px 50px;
  color: white;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

.ticket::before {
  content: "";
  position: absolute;
  top: -45px;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  height: 90px;
  background: #e6e6e6;
  border-bottom-left-radius: 120px;
  border-bottom-right-radius: 120px;
}

.logo img {
  height: 70px;
  margin-bottom: 30px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
}

.left {
  flex: 1;
}

.right {
  width: 260px;
}

.right img {
  width: 100%;
  border-radius: 16px;
}

.ticket-id {
  font-size: 14px;
  opacity: 0.85;
  margin-bottom: 10px;
}

.title {
  font-family: 'League Spartan', sans-serif;
  font-size: 56px;
  font-weight: 700;
  margin: 10px 0 20px;
}

.date, .time {
  font-family: 'League Spartan', sans-serif;
  font-size: 28px;
  font-weight: 600;
}

.venue-title {
  margin-top: 25px;
  font-family: 'League Spartan', sans-serif;
  font-weight: 700;
  font-size: 18px;
}

.venue {
  font-size: 18px;
  opacity: 0.95;
}

.info {
  display: flex;
  justify-content: space-between;
  margin-top: 45px;
  padding: 0 120px;
}

.info div {
  text-align: center;
}

.info h4 {
  font-family: 'League Spartan', sans-serif;
  font-size: 22px;
}

.info span {
  font-size: 20px;
}

.qr {
  margin-top: 45px;
  display: flex;
  justify-content: center;
}

.qr img {
  width: 220px;
  background: white;
  padding: 10px;
  border-radius: 10px;
}
</style>
</head>

<body>

<div class="ticket">

  <div class="logo">
    <img src="https://res.cloudinary.com/ddr8ylakx/image/upload/v1773825169/Untitled_design_27_m2fqif.png">
  </div>

  <div class="row">

    <div class="left">
      <div class="ticket-id">Ticket ID - ${bookingId}</div>

      <div class="title">Tollywood Mehfil</div>

      <div class="date">Friday, 27th March</div>
      <div class="time">7:00 PM - 10:00 PM</div>

      <div class="venue-title">VENUE</div>
      <div class="venue">
        Novotel, Vijayawada
      </div>
    </div>

    <div class="right">
      <img src="https://res.cloudinary.com/ddr8ylakx/image/upload/v1773827453/Screenshot_2026-03-18_152025_stxwsc.png">
    </div>

  </div>

  <div class="info">
    <div>
      <h4>Ticket Type</h4>
      <span>${ticketType}</span>
    </div>

    <div>
      <h4>Quantity</h4>
      <span>${quantity}</span>
    </div>
  </div>

  <div class="qr">
    <img src="${qrImage}">
  </div>

</div>
<div style="margin-top:20px; padding:15px; border-top:1px solid #ccc; font-size:12px; color:#555;">

  <b>Terms & Conditions:</b><br><br>

  • Seating will be based on First Come First Served basis.<br>
  • The Event Has been listed by Thinklab Digital Solutions LLP, any issues please contact us at info@thinklabdigitalsolutions.com.<br>
  • Entry allowed only with valid QR code.<br>
  • If you were denied entry, please email at info@thinklabdigitalsolutions.com<br>
  • All refund requests must be submitted to @info@thinklabdigitalsolutions.com within 2 days of the event's completion. Any requests received after this period — whether for denied entry or other reasons — will not be processed unless the event was ocially cancelled. In such cases, customers will need to directly contact the venue or event organiser for any further assistance regarding refunds.<br>
  • Additionally, SortMyScene shall not be held liable or responsible for any violation of intellectual property rights that may arise out of any Artist performance at the event.<br>
  • Tickets are non-cancelable, non-refundable and non-transferable.<br>
  • Guestlist may shut earlier than the mentioned time once it is full.<br>
  • Entry must be no later than the time on your ticket.<br>
  • Consumption of alcohol and illegal substances is strictly prohibited.<br>
  • The venue and schedule maybe subject to change.<br>
  • No refund/replacement on a purchased ticket. Tickets you purchase are for personal use. You must not transfer (or seek to transfer) the tickets in breach of the applicable terms. A breach of this condition will entitle us to cancel the tickets without prior notication, refund, compensation or liability.<br>
  • The management reserves the exclusive right without refund or other recourse, to refuse admission to anyone who is found to be in breach of these terms and conditions including, if necessary, ejecting the holder/s of the ticket from the venue after they have entered the premises. <br>
  • These terms and conditions are subject to change from time to time at the discretion of the organizer.<br>


</div>
</body>
</html>
`;
};