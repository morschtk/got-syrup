"use strict"; // Start of use strict

function addItem(item) {
  var str = '#'+item+'Quantity';
  $(str).val(+$(str).val() + 1);
  var price = 0;
  switch(item) {
    case '12oz':
      price = 9;
      break;
    case '32oz':
      price = 18;
      break;
    case '64oz':
      price = 30;
      break;
    case '128oz':
      price = 54;
      break;
  }
  var total = +$('#total').text() + price;
  $('#total').text(total);
}

function removeItem(item) {
  var str = '#'+item+'Quantity';
  if (+$(str).val()) {
    $(str).val(+$(str).val() - 1);
    var price = 0;
    switch(item) {
      case '12oz':
      price = 9;
      break;
      case '32oz':
      price = 18;
      break;
      case '64oz':
      price = 30;
      break;
      case '128oz':
      price = 54;
      break;
    }
    var total = +$('#total').text() - price;
    $('#total').text(total);
  }
}

$('.quantity').change(function() {
  $('#total').text((+$('#12ozQuantity').val()*9) + (+$('#32ozQuantity').val()*18) + (+$('#64ozQuantity').val()*30) + (+$('#128ozQuantity').val()*54));
});

var stripe = Stripe('');
var elements = stripe.elements({
  fonts: [
    {
      cssSrc: 'https://fonts.googleapis.com/css?family=Source+Code+Pro',
    },
  ]
});

var elementStyles = {
  base: {
    color: '#32325D',
    fontWeight: 500,
    fontFamily: 'Source Code Pro, Consolas, Menlo, monospace',
    fontSize: '16px',
    fontSmoothing: 'antialiased',

    '::placeholder': {
      color: '#CFD7DF',
    },
    ':-webkit-autofill': {
      color: '#e39f48',
    },
  },
  invalid: {
    color: '#E25950',

    '::placeholder': {
      color: '#FFCCA5',
    },
  },
};

var elementClasses = {
  focus: 'focused',
  // empty: 'empty',
  invalid: 'invalid',
};

var card = elements.create('cardNumber', {
  style: elementStyles,
  classes: elementClasses,
});
card.mount('#card-number');

var cardExpiry = elements.create('cardExpiry', {
  style: elementStyles,
  classes: elementClasses,
});
cardExpiry.mount('#card-expiry');

var cardCvc = elements.create('cardCvc', {
  style: elementStyles,
  classes: elementClasses,
});
cardCvc.mount('#card-cvc');

card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-number-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

cardExpiry.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-expiry-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

cardCvc.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-cvc-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (!result.error) {
    //   var errorElement = document.getElementById('card-errors');
    //   errorElement.textContent = result.error.message;
    // } else {
      stripeTokenHandler(result.token);
    }
  });
});

function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('payment-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  // Submit the form
  $.post('', {
    stripeToken: token.id
  }, function(cred) {
    console.log(cred);
  }).fail(function(err) {
    console.log(err);
  });
}
