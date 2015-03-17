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


$(function () {
    var chat = $.connection.chatHub;

    chat.client.addNewMessageToPage = function (name, message) {
        if (!$('#chatContainer').hasClass('open')) {
            $('#showChatButton').removeClass('btn-info').addClass('btn-danger');
        }
        $('#discussion').append('<li><strong>' + htmlEncode(name)
            + '</strong>: ' + htmlEncode(message) + '</li>');

        $('.chatMessages').scrollTop(Infinity);
    };

    $('#message').focus();

    $.connection.hub.start().done(function () {
        $('#sendmessage').click(function () {
            if ($('#message').val().length > 0) {
                chat.server.send($('#displayname').val(), $('#message').val().trim());
                $('#message').val('').focus();
            }
        });

        $('#message').on('keydown', function (e) {
            if (e.which == 13) {
                if ($('#message').val().length > 0) {
                    chat.server.send($('#displayname').val(), $('#message').val().trim());
                    $('#message').val('').focus();
                }
            }
            else {
                return;
            }
        })
    });
});

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