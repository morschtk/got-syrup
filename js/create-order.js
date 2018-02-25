"use strict"; // Start of use strict
$(checkTotal);

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

function checkTotal() {
  $('#total').text((+$('#12ozQuantity').val()*9) + (+$('#32ozQuantity').val()*18) + (+$('#64ozQuantity').val()*30) + (+$('#128ozQuantity').val()*54));
  $('#qtyTotal').text((+$('#12ozQuantity').val()) + (+$('#32ozQuantity').val()) + (+$('#64ozQuantity').val()) + (+$('#128ozQuantity').val()));
}

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
  $('#qtyTotal').text(parseInt($('#qtyTotal').text()) + 1)
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
    $('#qtyTotal').text(parseInt($('#qtyTotal').text()) - 1)
  }
}

$('.quantity').change(function() {
  checkTotal();
});

var stripe = Stripe('pk_test_iP6MbEvM9ZpbYwGiV0RvA49I');
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

document.getElementById('shipping-form').addEventListener('submit', function(event) {
  event.preventDefault();
  nextPage('billing');
});

var tok;
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();
  if ($('#total').text() == '0') {
    toastr.error('Please select a quantity of syrup');
  } else {
  stripe.createToken(card).then(function(result) {
    if (!result.error) {
    //   var errorElement = document.getElementById('card-errors');
    //   errorElement.textContent = result.error.message;
    // } else {
      tok = result.token.id;
      nextPage('confirmation')

      $('#confirm-name').text($('#payment-form input[name=first_name]').val() + ' ' + $('#payment-form input[name=last_name]').val());
      $('#confirm-addr1').text($('#payment-form input[name=address_1]').val());
      $('#confirm-addr2').text($('#payment-form input[name=address_2]').val());
      $('#confirm-state').text($('#payment-form input[name=city]').val() + ', ' + $('#payment-form select[name=state]').val() + ' ' + $('#payment-form input[name=zip]').val());
      $('#confirm-email').text($('#payment-form input[name=email]').val());

      $('#confirm-card').text(result.token.card.brand + ' ending in ' + result.token.card.last4);

      var quantity = $('.quantity');
      var quantityHtml = `
          <tr>
              <td>PRODUCT</td>
              <td>UNIT PRICE</td>
              <td>QUANTITY</td>
              <td>PRICE</td>
          </tr>
      `;
      quantity.each(function (index) {
        if ($(this).val().length > 0) {
            let color = "white"
            if (index % 2)
                color = '#f5f5f5'
          quantityHtml += `
              <tr>
                  <td>
                      <h3 class="ui image header">
                          <img src="img/500ml.jpg" class="ui rounded image">
                          <div class="content">
                              ${$(this).attr('name')} Glen Haven Pure Maple Syrup
                              <div class="sub header">${$(this).attr('data-size')}</div>
                          </div>
                      </h3>
                  </td>
                  <td>
                      ${$(this).attr('data-price')}
                  </td>
                  <td>${$(this).val()}</td>
                  <td>
                      ${$(this).attr('data-price') * $(this).val()}
                  </td>
              </tr>
          `;
        }
      });

      quantityHtml += `
          <tr>
              <td>TOTAL</td>
              <td></td>
              <td></td>
              <td><h3 class="ui header orange">${$('#total').text()}</h3></td>
          </tr>
      `

      $('#confirm-quantity').html(quantityHtml);

      // $('#confirm-total').text($('#total').text());
    }
  });
  }
});

function confirmPurchase() {
    if (tok !== null) {
      stripeTokenHandler(tok);
    }
}

function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = $('form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token);
  form.append(hiddenInput);
  var totalInput = document.createElement('input');
  totalInput.setAttribute('type', 'hidden');
  totalInput.setAttribute('name', 'total_amount');
  totalInput.setAttribute('value', $('#total').text());
  form.append(totalInput);

  // Submit the form
  $.post('https://q0t84mg1j6.execute-api.us-east-1.amazonaws.com/prod/got-syrup-dev-authenticate', form.serialize(), function(cred) {
    thankCustomer();
  }).fail(function(err) {
    console.log(err);
    toastr.error(err.responseJSON.message);
  });
}

function thankCustomer() {
  $('.order').hide();
  $('.confirmation').hide();
  $('.thank-you').show();
  var thankText = `<span>Thank you so much ` + $('#confirm-name').text() + `! We apprciate your business and your love for locally grown quality syrup.</span><span>You will receive an email at ` + $('#confirm-email').text() + ` with more information about your order!</span>`;
  $('.thank-you .message').html(thankText);
}

function nextPage(page) {
  if (page == 'shipping' && $('#total').text() == '0') {
      toastr.error('Please select a quantity of syrup');
  } else {
    $('.order').hide();
    $('.shipping').hide();
    $('.billing').hide();
    $('.confirmation').hide();
    $('.thank-you').hide();
    $('.step').removeClass('active')

    $(`.${page}`).show()
    $(`#${page}tab`).addClass('active')
  }
}
