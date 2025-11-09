// --- Footer year ---
document.getElementById("year").textContent = new Date().getFullYear();

$(document).ready(function () {

  // Smooth scroll to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) $("#toTop").fadeIn();
    else $("#toTop").fadeOut();
  });
  $("#toTop").click(() => $("html, body").animate({ scrollTop: 0 }, 600));

  // --- GALLERY MODAL ---
  $(".gallery-img").click(function () {
    $("#modalImage").attr("src", $(this).attr("src"));
    $("#imgModal").modal("show");
  });

  // --- CONTACT FORM VALIDATION ---
  $("#contactForm").on("submit", function (e) {
    e.preventDefault();
    let name = $("#name").val().trim();
    let email = $("#email").val().trim();
    let message = $("#message").val().trim();

    if (name && email && message) {
      $("#formAlert").html("<div class='alert alert-success'>Message sent successfully!</div>");
      $(this).trigger("reset");
    } else {
      $("#formAlert").html("<div class='alert alert-danger'>Please fill in all fields.</div>");
    }
  });

  // --- CART FUNCTIONALITY ---
  const cartKey = "cartItems";

  // Add to cart
  $(".order-btn").click(function () {
    const card = $(this).closest(".card");
    const title = card.find("h5").text().trim();
    const priceText = card.find(".fw-bold").text().replace(/[^\d]/g, "");
    const price = parseInt(priceText);

    if (isNaN(price)) {
      alert("Error: Price not found.");
      return;
    }

    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    cart.push({ title, price });
    localStorage.setItem(cartKey, JSON.stringify(cart));
    alert(`${title} added to cart!`);
  });

  // Display cart items
  if ($("#cartItems").length) {
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const container = $("#cartItems");
    const emptyMsg = $("#emptyCart");
    const totalSection = $("#totalSection");
    const totalAmount = $("#totalAmount");

    if (cart.length === 0) {
      emptyMsg.show();
      totalSection.hide();
    } else {
      emptyMsg.hide();
      totalSection.show();
      cart.forEach((item, index) => {
        container.append(`
          <div class="col-md-4 mb-3">
            <div class="card p-3 border-0 shadow-sm text-start">
              <div class="d-flex align-items-center">
                <input type="checkbox" class="form-check-input me-2 select-item" data-index="${index}" data-price="${item.price}">
                <h5 class="mb-0">${item.title}</h5>
              </div>
              <p class="mt-2 mb-1">${item.price.toLocaleString()} ₸</p>
              <button class="btn btn-outline-danger remove-item" data-index="${index}">Remove</button>
            </div>
          </div>
        `);
      });
    }

    // Update total dynamically
    function updateTotal() {
      let total = 0;
      $(".select-item:checked").each(function () {
        total += parseInt($(this).data("price"));
      });
      totalAmount.text(total.toLocaleString() + " ₸");
    }

    $(document).on("change", ".select-item", updateTotal);

    // Remove item
    $(document).on("click", ".remove-item", function () {
      const index = $(this).data("index");
      let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      cart.splice(index, 1);
      localStorage.setItem(cartKey, JSON.stringify(cart));
      location.reload();
    });

    // Clear all
    $("#clearCart").click(function () {
      localStorage.removeItem(cartKey);
      location.reload();
    });

    // Payment modal
    $("#placeOrder").click(function () {
      const selected = $(".select-item:checked");
      if (selected.length === 0) {
        alert("Please select at least one item!");
        return;
      }

      let total = 0;
      selected.each(function () {
        total += parseInt($(this).data("price"));
      });

      $("#modalTotal").text(total.toLocaleString() + " ₸");
      $("#paymentModal").modal("show");
    });

    // Payment validation
    $("#paymentForm").on("submit", function (e) {
      e.preventDefault();
      const name = $("#cardName").val().trim();
      const number = $("#cardNumber").val().trim();
      const expiry = $("#cardExpiry").val().trim();
      const cvv = $("#cardCVV").val().trim();

      if (!name || number.length !== 16 || !expiry || cvv.length !== 3) {
        alert("Please fill out all fields correctly!");
        return;
      }

      $("#paymentModal").modal("hide");
      alert("Payment successful! Thank you!");
      localStorage.removeItem(cartKey);
      location.reload();
    });
  }

  // --- FETCH: Dynamic Quote (API) ---
  if ($("#dailyQuote").length) {
    fetch("https://api.quotable.io/random")
      .then(res => res.json())
      .then(data => {
        $("#dailyQuote").text(`"${data.content}" — ${data.author}`);
      })
      .catch(() => {
        $("#dailyQuote").text("Could not load quote. Please try again later.");
      });
  }

});