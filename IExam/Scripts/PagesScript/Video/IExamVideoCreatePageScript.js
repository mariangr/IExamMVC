var IExamVideoCreate = IExamVideoCreate || {};

IExamVideoCreate.PageLogic = function () {
    var manageLink = function () {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var link = $('#link').val();
        var match = link.match(regExp);
        if (match && match[2].length == 11) {
            link = match[2];
        }
        $('#link').val(link);
    }

    return {
        manageLink: manageLink
    }
}();