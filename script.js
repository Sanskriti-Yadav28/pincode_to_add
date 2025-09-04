const btn = document.getElementById("searchBtn");
const pinInput = document.getElementById("pincode");
const statusDiv = document.getElementById("status");
const resultDiv = document.getElementById("result");

// 🔹 Allow pressing Enter to trigger search
pinInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    getAddress();
  }
});

btn.addEventListener("click", getAddress);

function getAddress() {
  const pincode = pinInput.value.trim();

  // Reset
  statusDiv.textContent = "";
  resultDiv.innerHTML = "";

  // Validation
  if (!/^[1-9][0-9]{5}$/.test(pincode)) {
    statusDiv.textContent = "❌ Please enter a valid 6-digit PIN.";
    return;
  }

  statusDiv.textContent = "⏳ Fetching details...";

  const API = `https://api.postalpincode.in/pincode/${pincode}`;

  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      const info = data[0];

      if (info.Status === "Success") {
        statusDiv.textContent = `✅ Found ${info.PostOffice.length} Post Offices`;

        info.PostOffice.forEach((office) => {
          const card = document.createElement("div");
          card.classList.add("card");
          card.innerHTML = `
            <p><strong>${office.Name}</strong></p>
            <p>📌 District: ${office.District}</p>
            <p>🏙️ State: ${office.State}</p>
            <p>🏤 Branch Type: ${office.BranchType}</p>
            <p>🚚 Delivery: ${office.DeliveryStatus}</p>
          `;
          resultDiv.appendChild(card);
        });
      } else {
        statusDiv.textContent = "⚠️ " + info.Message;
      }
    })
    .catch((err) => {
      console.error(err);
      statusDiv.textContent = "⚠️ Error fetching data. Try again later.";
    });
}
