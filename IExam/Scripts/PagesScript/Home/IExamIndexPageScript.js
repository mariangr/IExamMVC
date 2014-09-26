var IExamIndex = IExamIndex || {};

$(document).ready(function () {
    IExamIndex.PageLogic.loadSelectedPage('/Home/ReturnPartialView/', '_Home');
});

IExamIndex.PageLogic = function () {
    var loadSelectedPage = function (url, page) {
        $.ajax({
            type: 'POST',
            url: url,
            data: { pageName: page },
            success: function (html) {
                $("#main_Container_Div").html(html);
            },
            error: function () {
                $('#main_Container_Div').html("Error");
            }
        })
        return false;
    }

    return {
        loadSelectedPage: loadSelectedPage

    }
}();