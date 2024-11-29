(function($) {
    "use strict";

    /* ==============================================
    Fixed menu
    =============================================== */

    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 50) {
            $('.top-navbar').addClass('fixed-menu');
        } else {
            $('.top-navbar').removeClass('fixed-menu');
        }
    });

    /* ==============================================
       LOADER -->
    =============================================== */

    $(window).load(function() {
        $("#preloader").on(500).fadeOut();
        $(".preloader").on(600).fadeOut("slow");
    });

    /* ==============================================
    	Scroll to top  
    ============================================== */

    if ($('#scroll-to-top').length) {
        var scrollTrigger = 100, // px
            backToTop = function() {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > scrollTrigger) {
                    $('#scroll-to-top').addClass('show');
                } else {
                    $('#scroll-to-top').removeClass('show');
                }
            };
        backToTop();
        $(window).on('scroll', function() {
            backToTop();
        });
        $('#scroll-to-top').on('click', function(e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, 700);
        });
    }

    /* ==============================================
     FUN FACTS -->
     =============================================== */

    function count($this) {
        var current = parseInt($this.html(), 10);
        current = current + 50; /* Where 50 is increment */
        $this.html(++current);
        if (current > $this.data('count')) {
            $this.html($this.data('count'));
        } else {
            setTimeout(function() {
                count($this)
            }, 30);
        }
    }
    $(".stat_count, .stat_count_download").each(function() {
        $(this).data('count', parseInt($(this).html(), 10));
        $(this).html('0');
        count($(this));
    });

    /* ==============================================
     Full width Slider -->
     =============================================== */

    $(document).ready(function() {
        var owl = $('#full-width');
        $('#full-width').owlCarousel({
            items: 1,
            loop: true,
            nav: true,
            margin: 0,
            navText: [
                "<i class='fa fa-angle-left effect-1'></i>",
                "<i class='fa fa-angle-right effect-1'></i>"
            ],
            autoplay: true,
            smartSpeed: 500,
        });
        owl.on('changed.owl.carousel', function(event) {
            var item = event.item.index - 2;
            $('h2').removeClass('animated zoomIn');
            $('p').removeClass('animated fadeInUp');
            $('.butn').removeClass('animated zoomIn');
            $('.owl-item').not('.cloned').eq(item).find('h2').addClass('animated zoomIn');
            $('.owl-item').not('.cloned').eq(item).find('p').addClass('animated fadeInUp');
            $('.owl-item').not('.cloned').eq(item).find('.butn').addClass('animated zoomIn');
        });
    });

    /* ==============================================
     TOOLTIP -->
     =============================================== */
    $('[data-toggle="tooltip"]').tooltip()
    $('[data-toggle="popover"]').popover()

    /* ==============================================
     CONTACT -->
     =============================================== */
    jQuery(document).ready(function() {
        // Cache los selectores DOM
        const $contactForm = $('#contactform');
        const $message = $('#message');
        const $submit = $('#submit');

        $contactForm.submit(function(e) {
            e.preventDefault();
            const action = $(this).attr('action');

            // Reducir tiempo de animación
            $message.slideUp(300, function() {
                $message.hide();
                $submit.prop('disabled', true)
                    .after('<img src="images/ajax-loader.gif" class="loader" />');

                // Recoger datos del formulario de manera más eficiente
                const formData = {
                    first_name: $('#first_name').val(),
                    last_name: $('#last_name').val(),
                    email: $('#email').val(),
                    phone: $('#phone').val(),
                    select_service: $('#select_service').val(),
                    select_price: $('#select_price').val(),
                    comments: $('#comments').val(),
                    verify: $('#verify').val()
                };

                $.post(action, formData)
                    .done(function(data) {
                        $message.html(data).slideDown(300);
                        $contactForm.find('img.loader').fadeOut(200, function() {
                            $(this).remove();
                        });
                        $submit.prop('disabled', false);

                        if (data.includes('success')) {
                            $contactForm.slideUp(300);
                        }
                    })
                    .fail(function() {
                        $message.html('Error en el envío').slideDown(300);
                        $submit.prop('disabled', false);
                    });
            });
        });
    });

    /* ==============================================
     CODE WRAPPER -->
     =============================================== */

    $('.code-wrapper').on("mousemove", function(e) {
        var offsets = $(this).offset();
        var fullWidth = $(this).width();
        var mouseX = e.pageX - offsets.left;

        if (mouseX < 0) {
            mouseX = 0;
        } else if (mouseX > fullWidth) {
            mouseX = fullWidth
        }

        $(this).parent().find('.divider-bar').css({
            left: mouseX,
            transition: 'none'
        });
        $(this).find('.design-wrapper').css({
            transform: 'translateX(' + (mouseX) + 'px)',
            transition: 'none'
        });
        $(this).find('.design-image').css({
            transform: 'translateX(' + (-1 * mouseX) + 'px)',
            transition: 'none'
        });
    });
    $('.divider-wrapper').on("mouseleave", function() {
        $(this).parent().find('.divider-bar').css({
            left: '50%',
            transition: 'all .3s'
        });
        $(this).find('.design-wrapper').css({
            transform: 'translateX(50%)',
            transition: 'all .3s'
        });
        $(this).find('.design-image').css({
            transform: 'translateX(-50%)',
            transition: 'all .3s'
        });
    });

})(jQuery);