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

 var sw = this.innerWidth;

 if (sw <= 600) {
     var elementWow = ['lightSpeedIn', 'fadeInRight', 'bounceInUp', 'bounceInRight', 'bounceInLeft'];

    for (let a = 0; a < elementWow.length; a++) {
        const element = elementWow[a];
        $('.' + element).each(function(){
           $(this).removeClass(element);
           $(this).addClass('fadeInUp');
        });
    }

}

$(document).ready(function(){
    $('#progress-loader').animate({
        width: "100%"
    }, 100, function(){
        setTimeout(() => {
            $('#loader').remove();
            $('html').css('overflow-y', 'auto');
        }, 3000);
    });

    setTimeout(() => {
        wow = new WOW({
            animateClass: 'animated',
            boxClass: 'wow',
            mobile: true
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


    }, 3100);


    
});
