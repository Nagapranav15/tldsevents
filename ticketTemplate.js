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
        ICON Sports, Vijayawada
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

</body>
</html>
`;
};