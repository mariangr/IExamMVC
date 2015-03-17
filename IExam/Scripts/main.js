/// <reference path="jquery-2.1.1.min.js" />

$(document).ready(function () {
    sliderManager.initSlider();
    stopClosingChat();
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

function htmlEncode(value) {
    var encodedValue = $('<div />').text(value).html();
    return encodedValue;
}

function stopClosingChat(){
    $('#chatContainer').on({
        "click": function (event) {
            if (!$(event.target).hasClass('dropdown-toggle')) {
                return false;
            }
            $('#showChatButton').addClass('btn-info').removeClass('btn-danger');
        },
        "hide.bs.dropdown": function (event) {
            return this.closable;
        }
    });
}