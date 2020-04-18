wow = new WOW({
    animateClass: 'animated',
    boxClass: 'wow',
    mobile: false
});

wow.init();

var swiper = new Swiper('.swiper-container', {
    slidesPerView: 2,
    spaceBetween: 30,
    autoplay: {
        delay: 2000,
    },
    centeredSlides: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        640: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 1,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});


$(window).scroll(function(e) {
    var tinggiHome = $('#home')[0].offsetHeight;
    var tinggiScroll = e.currentTarget.scrollY;
    var btnToTop = $('.to-top');
    var btnToBottom = $('.to-bottom');

    if (tinggiScroll >= tinggiHome) {
        btnToTop.show();
        btnToBottom.hide();
    } else{
        btnToTop.hide();
        btnToBottom.show();
    }

 });