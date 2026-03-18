window.pay = async function(){

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const ticketType = document.getElementById("ticketType").value;
  const quantity = parseInt(document.getElementById("quantity").value);

  const status = document.getElementById("status");
  const payBtn = document.getElementById("payBtn");

  status.innerText = "";

  /* BASIC VALIDATION */

  if(!name || !email || !ticketType || !quantity){
    status.innerText = "Fill all fields";
    return;
  }

  /* LIMIT CHECK (FRONTEND) */

  if(ticketType === "single" && quantity > 10){
    status.innerText = "Max 10 single tickets allowed";
    return;
  }

  if(ticketType === "couple" && quantity > 5){
    status.innerText = "Max 5 couple tickets allowed";
    return;
  }

  /* PRICE */

  let price = ticketType === "single" ? 499 : 899;
  let amount = price * quantity;

  payBtn.disabled = true;
  payBtn.innerText = "Processing...";

  try{

    const {key} = await (await fetch("/config")).json();

    const order = await (await fetch("/create-order",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({amount})
    })).json();

    const rzp = new Razorpay({
      key,
      amount: order.amount,
      currency:"INR",
      order_id: order.id,

      handler: async function(response){

        try{

          const verifyRes = await fetch("/verify-payment",{
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

          const result = await verifyRes.json();

          console.log("BACKEND RESPONSE:", result);

          if(result.status === "success"){

            const url =
`/success.html?booking=${result.bookingId}&qr=${encodeURIComponent(result.qrData)}&file=${result.downloadUrl}&qty=${result.quantity}&type=${result.ticketType}&name=${encodeURIComponent(result.name)}`;

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
    const res = await fetch("/availability");
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