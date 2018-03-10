(function($) {
  "use strict"; // Start of use strict

  // var stripe = Stripe('');
  // var elements = stripe.elements();
  //
  // var style = {
  //   base: {
  //     fontSize: '16px',
  //     color: "#32325d",
  //   }
  // };

  // var card = elements.create('card', {style: style});

  // card.mount('#card-element');

  // card.addEventListener('change', function(event) {
  //   var displayError = document.getElementById('card-errors');
  //   if (event.error) {
  //     displayError.textContent = event.error.message;
  //   } else {
  //     displayError.textContent = '';
  //   }
  // });

  // var form = document.getElementById('payment-form');
  // form.addEventListener('submit', function(event) {
  //   event.preventDefault();
  //
  //   stripe.createToken(card).then(function(result) {
  //     if (result.error) {
  //       var errorElement = document.getElementById('card-errors');
  //       errorElement.textContent = result.error.message;
  //     } else {
  //       stripeTokenHandler(result.token);
  //     }
  //   });
  // });

  // function stripeTokenHandler(token) {
  //   // Insert the token ID into the form so it gets submitted to the server
  //   var form = document.getElementById('payment-form');
  //   var hiddenInput = document.createElement('input');
  //   hiddenInput.setAttribute('type', 'hidden');
  //   hiddenInput.setAttribute('name', 'stripeToken');
  //   hiddenInput.setAttribute('value', token.id);
  //   form.appendChild(hiddenInput);
  //
  //   // Submit the form
  //   // form.submit();
  //   $.post('', {
  //     stripeToken: token.id
  //   }, function(cred) {
  //     console.log(cred);
  //   }).fail(function(err) {
  //     console.log(err);
  //   });
  // }


  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 57)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 57
  });

  // Collapse Navbar
  // var navbarCollapse = function() {
  //   if ($("#mainNav").offset().top > 100) {
  //     $("#mainNav").addClass("navbar-shrink");
  //   } else {
  //     $("#mainNav").removeClass("navbar-shrink");
  //   }
  // };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  // Scroll reveal calls
  window.sr = ScrollReveal();
  sr.reveal('.sr-icons', {
    duration: 600,
    scale: 0.3,
    distance: '0px'
  }, 200);
  sr.reveal('.sr-button', {
    duration: 1000,
    delay: 200
  });
  sr.reveal('.sr-contact', {
    duration: 600,
    scale: 0.3,
    distance: '0px'
  }, 300);

  // Magnific popup calls
  $('.popup-gallery').magnificPopup({
    delegate: 'a',
    type: 'image',
    tLoading: 'Loading image #%curr%...',
    mainClass: 'mfp-img-mobile',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1]
    },
    image: {
      tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
    }
  });

})(jQuery); // End of use strict
