// Create a Stripe client.
const stripe = Stripe("pk_test_51PsJkEIGs0AlYN90Gr1ZRAAfVI702zxbaP73m1W0W9nYusOEQabX0blrtDHLOXFCnfmGMdaUuELOEuMEJcX09kaG001l4zksRc");

// Create an instance of Elements.
const elements = stripe.elements();

const style = {
  base: {
    color: "#32325d",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a",
  },
};

// Create an instance of the card Element.
const card = elements.create("card", { style: style });

// Add an instance of the card Element into the `card-element` <div>.
card.mount("#card-element");

// Handle real-time validation errors from the card Element.
card.addEventListener("change", function (event) {
  const displayError = document.getElementById("card-errors");
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = "";
  }
});

// Handle form submission.
const $form = $("#checkout-form");

$form.submit(function (event) {
  event.preventDefault();
  $form.find("button").prop("disabled", true);

  const extraDetails = {
    name: $("#card-name").val(),
  };

  stripe.createToken(card, extraDetails).then(function (result) {
    if (result.error) {
      $form.find("button").prop("disabled", false); // Re-enable submission
    } else {
      // Send the token to your server.
      stripeTokenHandler(result.token);
    }
  });
});

// Submit the form with the token ID.
function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  $form.append($('<input type="hidden" name="stripeToken" />').val(token.id));
  // Submit the form
  $form.get(0).submit();
}
