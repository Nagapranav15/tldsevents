const BASE_URL = "https://tldsevents.onrender.com"; // CHANGE TO RENDER URL AFTER DEPLOY

window.pay = async function(){

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const ticketType = document.getElementById("ticketType").value;
  const quantity = parseInt(document.getElementById("quantity").value);

  const status = document.getElementById("status");
  const payBtn = document.getElementById("payBtn");

  status.innerText = "";

  /* ================= VALIDATION ================= */

  if(!name || !email || !ticketType || isNaN(quantity) || quantity < 1){
    status.innerText = "Fill all fields";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if(!emailRegex.test(email)){
    status.innerText = "Enter valid email";
    return;
  }

  if(ticketType === "single" && quantity > 10){
    status.innerText = "Max 10 single tickets allowed";
    return;
  }

  if(ticketType === "couple" && quantity > 5){
    status.innerText = "Max 5 couple tickets allowed";
    return;
  }

  /* ================= PRICE ================= */

  const price = ticketType === "single" ? 499 : 899;
  const amount = price * quantity;

  payBtn.disabled = true;
  payBtn.innerText = "Processing...";

  try{

    /* GET KEY */

    const configRes = await fetch(BASE_URL + "/config");

    if(!configRes.ok){
      throw new Error("Server not responding");
    }

    const {key} = await configRes.json();

    /* CREATE ORDER */

    const orderRes = await fetch(BASE_URL + "/create-order",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({amount})
    });

    if(!orderRes.ok){
      throw new Error("Order creation failed");
    }

    const order = await orderRes.json();

    /* RAZORPAY */

    const rzp = new Razorpay({
      key,
      amount: order.amount,
      currency:"INR",
      order_id: order.id,

      handler: async function(response){

        try{

          const verifyRes = await fetch(BASE_URL + "/verify-payment",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
              ...response,
              name,
              email,
              ticketType,
              quantity
            })
          });

          if(!verifyRes.ok){
            throw new Error("Verification failed");
          }

          const result = await verifyRes.json();

          console.log("BACKEND RESPONSE:", result);

          if(result.status === "success"){

            // prevent double booking
            payBtn.disabled = true;
            payBtn.innerText = "Booked";

            // redirect (no downloadUrl now)
            const url =
`/success.html?booking=${result.bookingId}&qr=${encodeURIComponent(result.qrData)}&qty=${result.quantity}&type=${result.ticketType}&name=${encodeURIComponent(result.name)}`;

            window.location.href = url;

          }else if(result.status === "max_limit"){
            status.innerText = "Ticket limit exceeded";
            resetButton();
          }else if(result.status === "sold_out"){
            status.innerText = "Tickets sold out";
            resetButton();
          }else{
            status.innerText = "Payment failed";
            resetButton();
          }

        }catch(err){
          console.error(err);
          status.innerText = "Verification error";
          resetButton();
        }

      },

      modal: {
        ondismiss: function(){
          resetButton();
        }
      }

    });

    rzp.open();

  }catch(err){
    console.error(err);
    status.innerText = "Something went wrong";
    resetButton();
  }

  function resetButton(){
    payBtn.disabled = false;
    payBtn.innerText = "Proceed to Payment";
  }

};

/* ================= AVAILABILITY ================= */

async function loadAvailability(){

  try{
    const res = await fetch(BASE_URL + "/availability");
    const data = await res.json();

    document.getElementById("availability").innerText =
      `Single Left: ${data.singleAvailable} | Couple Left: ${data.coupleAvailable}`;

  }catch{
    document.getElementById("availability").innerText = "Unable to load availability";
  }

}

/* ================= LIMIT CONTROL ================= */

document.getElementById("ticketType").addEventListener("change", function(){

  const type = this.value;
  const quantityInput = document.getElementById("quantity");

  if(type === "single"){
    quantityInput.max = 10;
  }else if(type === "couple"){
    quantityInput.max = 5;
  }else{
    quantityInput.max = 1;
  }

  quantityInput.value = 1;
});

/* ================= INIT ================= */

window.onload = loadAvailability;

document.getElementById("quantity").addEventListener("input", function(){
  const max = this.max ? parseInt(this.max) : 1;

  if(this.value > max){
    this.value = max;
  }
});