$(function () {

  //  listCookies();

  // if (!isMobile()) {
  //     $('.js-stickybox').stickybox({
  //         context: function (elm) {
  //             return elm.parents('.knowledge');
  //         }
  //     })
  // }

  if (!localStorage.getItem('preloader')) runPreloader();
  else startAnimation();

  sbjs.init({
    domain: 'serenity.school',
    lifetime: 24,
    session_length: 30,
    timezone_offset: 3,
    referrals: [
      {
        host: 'yandex.ru',
        medium: 'organic',
        display: 'yandex'
      },
      {
        host: 'go.mail.ru',
        medium: 'organic',
        display: 'mail'
      },
      {
        host: 'rambler.ru',
        medium: 'organic',
        display: 'rambler'
      }
    ]
  });

  $('.js-show-all-reviews').on('click', function(e){
    e.preventDefault();
    $(this).hide();
    $('.first-two').removeClass('first-two');
  })

  $('.js-play-video').on('click', function (e) {
    e.preventDefault();
    $('.js-video').removeClass('hide');

    var
      link = this.dataset.link,
      code = '<iframe width="840" height="473" src="' + link + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'

    $('#video').html(code);

  });

  var programm = $('.program').offset().top,
    scrollPrev = 0,
    headerHeight = $('.js-header').height(),
    windowWidth = getWidth(),
    resize;

  $('.js-modal').on('click', function (e) {
    e.preventDefault();
    var href = this.getAttribute('href');
    $(href).removeClass('hide');
  })

  $(window).on("resize", function () {

    clearTimeout(resize);
    resize = setTimeout(function () {
      var newWidth = getWidth();

      if (((newWidth <= 768) && (windowWidth <= 768)) || (newWidth > 768) && (windowWidth > 768)) return;
      windowWidth = newWidth;

      if (windowWidth <= 768) {
        slicked();
        $('.js-header').removeClass('header_fixed');
      } else {
        $('.js-slider').slick('unslick');
      }
    }, 500);
  });


  $(window).scroll(function () {
    var scrolled = $(window).scrollTop(),
      valParallax = isMobile() ? 3 : -7;

    if (!isMobile() || (getWidth() > 768)) {
      if (scrolled < scrollPrev) {
        if (scrolled < headerHeight) {
          $('.js-header').removeClass('header_fixed').addClass('header_top');
        } else {
          if (Math.abs(scrollPrev - scrolled) > 20) $('.js-header').addClass('header_fixed header_top');
        }
      } else {
        if (scrolled > headerHeight) $('.js-header').removeClass('header_fixed header_top');
      }
    }

    scrollPrev = scrolled;

    if (scrolled >= programm) return
    window.requestAnimationFrame(function () {
      $('.js-paralaxed img').css({'transform': 'translateY(' + scrolled / 9 + 'px)'});
      $('.js-paralaxed-2 img').css({'transform': 'translateY(' + scrolled / valParallax + 'px)'});
    });
  });

  $('.js-spoiler').on('click', function () {
    var offset = $(this).closest('.js-direction').toggleClass('active').offset().top;

    $('html, body').animate({
      scrollTop: offset
    }, 500);

    if (isMobile() && (getWidth() < 768)) {
      $(this).siblings('.js-spoiler-content').slideToggle();
    }
  });

  $('.js-menu-icon').on('click', function (e) {
    $('.js-menu-box').toggleClass('hide');
    $('body, html').toggleClass('oh');
  });


  $('.js-icon').on('mouseenter', function (e) {
    var id = this.dataset.id;
    $('.tech, .js-icon').removeClass('active');
    $('.tech-' + id).addClass('active');
    $(this).addClass('active');
  });

  $('.js-open-spoiler').on('click', function () {
    var currentSpoiler = this;
    $('.js-open-spoiler').each(function (i, o) {
      if (o === currentSpoiler) return true;
      $(o).closest('.js-question').removeClass('active').end().next('p').slideUp(200);
    });

    $(currentSpoiler).closest('.js-question').toggleClass('active').end().next('p').slideToggle(200);
  });

  $(document).on('click', '.js-anchor', function (event) {
    event.preventDefault();

    $('html, body').animate({
      scrollTop: $($.attr(this, 'href')).offset().top + 100
    }, 500);
  });

  $('form').on('submit', function (e) {
    e.preventDefault();

    var form = $(this).closest('form'),
      error = false,
      phone = form.find('input[name="phone"]'),
      button = form.find('button');

    var tel_val = /^((8|\+62)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
    error = !tel_val.test(phone.val());

    phone.toggleClass('error', error);


    if (!error) {
      button.prop('disabled', true);
      form.find('input').removeClass('error');
      var data = form.serialize();
      $.ajax({
        type: 'POST',
        url: 'mail.php',
        dataType: 'json',
        data: data,
        beforeSend: function (data) {

        },
        error: function (d) {
          console.log('ERROR: ' + JSON.stringify(d))
        },
        success: function (d) {
          //console.log(d)

          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': 'sendForm'
          });

          $('.js-final').removeClass('hide');
          $('body, html').addClass('oh');
          form[0].reset();

        },
        complete: function (data) {
          button.prop('disabled', false);
        }
      });
    }
  })

  $('.js-close').on('click', function (e) {
    $('.js-final, .js-order-form, .js-video').addClass('hide');
    $('body, html').removeClass('oh');
    $('#video').html('');
  });


  $('input[type="tel"]').inputmask("+62(999)999-99-99");


  if (isMobile() && (getWidth() <= 768)) {
    slicked();
  }

  function isMobile() {
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  }

  function slicked() {
    $('.js-slider').slick({
      arrows: false,
      dots: true,
      infinite: false
    })
  }


  function getWidth() {
    if (document.documentElement && document.documentElement.clientWidth) {
      return document.documentElement.clientWidth;
    }

    if (document.body) {
      return document.body.clientWidth;
    }
  }

  function listCookies() {
    var theCookies = document.cookie.split(';');
    var aString = '';
    for (var i = 1; i <= theCookies.length; i++) {
      aString += i + ' ' + theCookies[i - 1] + "\n";
    }
  }


  function runPreloader() {
    var $preloader = $('#preloader'),
      preloaderBar = $('.js-preloader'),
      imagesCount = $('img').length,
      percent = 100 / imagesCount,
      progress = 0,
      loadedImg = 0;

    $preloader.parent().removeClass('hide');
//    $preloader.parent().addClass('hide');
    $preloader.removeClass('disabled');

    for (var i = 0; i < imagesCount; i++) {
      var img_copy = new Image();
      img_copy.src = document.images[i].src;
      img_copy.onload = img_load;
      img_copy.onerror = img_load;
    }

    function img_load() {
      progress += percent;
      loadedImg++;
      if (progress >= 100 || loadedImg === imagesCount) {
        setTimeout(function () {
          $preloader.parent().addClass('hide');
          startAnimation();
        }, 800);

      }
      preloaderBar.css({'width': progress + '%'});

    }

    localStorage.setItem('preloader', true)
  }

  function startAnimation(){
    setTimeout(function () {
      $('.js-preload').removeClass('preload');
      $('.js-main-header').removeClass('off');
      $('.js-header').addClass('header_top');
    }, 600)
  }

});



