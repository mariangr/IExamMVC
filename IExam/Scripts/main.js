
$(document).ready(function () {
    sliderManager.initSlider();
})

var sliderManager = function () {

    var initSlider = function () {
        $.backstretch([
                    "../Content/images/bg1.jpg",
                    "../Content/images/bg2.jpg"
        ], { duration: 4000, fade: 750 });
    }

    return {
        initSlider: initSlider
    }
}()
