var IExamVideo = IExamVideo || {};

IExamVideo.PageLogic = function () {

    var manageLink = function() {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var link = $('#link').val();
        var match = link.match(regExp);
        if (match && match[2].length == 11) {
            link = match[2];
        }
        $('#link').val(link);
    }

    var loadVideosList = function() {
        $.ajax({
            type: 'GET',
            url: '/Video/GetVideoElements/',
            success: function (result) {
                $('#videosContainer').html(result);

            },
            error: function (result) {
                alert(result.statusText)
            }
        })
        return false;
    }

    var LoadVideo = function(id) {
        if (id != null) {
            $.ajax({
                type: 'GET',
                url: '/Video/GetVideoPlayer/',
                data: { id: id },
                success: function (result) {
                    $('#videosPlayerContainer').html(result);
                    getCurrentVideoComments();

                    $('textarea').width($('#videoComents').width());
                    $('#videosPlayerContainer').show();
                    $('iframe').width($('#videosPlayerContainer').width());
                    $('iframe').height($('iframe').width() * 3 / 4);
                    $('#videoComents').width($('iframe').width());
                },
                error: function (result) {
                    alert(result.statusText)
                }
            })
            return false;
        }
        else {
            $('#videosPlayerContainer').html("");
        }
    }

    var DeleteVideo = function DeleteVideo(id) {
        $.ajax({
            type: 'GET',
            url: '/Video/DeleteVideo/',
            data: { id: id },
            success: function (result) {
                LoadVideo(null);
                $('#videoComents').html("");
                loadVideosList();
                $('#videosPlayerContainer').hide();

            },
            error: function (result) {
                alert(result.statusText)
            }
        })
        return false;
    }

    var getCurrentVideoComments = function() {
        var id = $('#selectedVideoInPlayerID').val();
        var link = $('#selectedVideoInPlayerLink').val();
        $.ajax({
            type: 'GET',
            url: '/Video/GetVideoComments/',
            data: { id: id, link: link },
            success: function (result) {
                $('#videoComents').html(result);
            },
            error: function (result) {
                alert(result.statusText)
            }
        })
        return false;
    }

    var deleteComment = function(id) {
        $.ajax({
            type: 'GET',
            url: '/Video/DeleteVideoComment/',
            data: { id: id },
            success: function (result) {
                getCurrentVideoComments();
            },
            error: function (result) {
                alert(result.statusText)
            }
        })
        return false;
    }

    var sendComment = function () {
        var linkOfComment = $('#selectedVideoInPlayerLink').val();
        var message = $('#commentForVideo').val();
        var user = $('#currentUser').val();
        $.ajax({
            type: 'GET',
            url: '/Video/CreateVideoComment/',
            data: { link: linkOfComment, message: message, user: user },
            success: function (result) {
                if (result == "CommentAddedSuccessfully") {
                    getCurrentVideoComments();
                }
                else if (result == "EmptyComment") {
                    $('#commentForVideo').attr('placeholder', "Please write a comment...");
                }
                else if (result == "UnspecifiedException") {
                    alert('Server Error');
                }

            },
            error: function (result) {
                alert(result.statusText)
            }
        })
        return false;
    }

    var textAreaEnterEvent = function(e) {

        if (e.which == 13) {
            sendComment();
        }
        else {
            return;
        }
    }

    var countDown = function() {
        $('.countdown').html('1000' - $('#commentForVideo').val().length + " remaining symbols");
    }

    return {
        manageLink: manageLink,
        loadVideosList: loadVideosList,
        LoadVideo: LoadVideo,
        DeleteVideo: DeleteVideo,
        deleteComment: deleteComment,
        sendComment: sendComment,
        textAreaEnterEvent: textAreaEnterEvent,
        countDown: countDown
    }

}();