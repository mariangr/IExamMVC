var IExamVideo = IExamVideo || {};

$(document).ready(function () {
    IExamVideo.VideoList = new IExamVideo.VideoListModel();
    ko.applyBindings(IExamVideo.VideoList, document.getElementById(videosContainer))
    IExamVideo.PageLogic.loadVideosList();
})

IExamVideo.VideoListModel = function () {
    var self = this;

    self.videos = ko.observableArray([]).extend({notify: 'always'});
    self.videoListIsVisible = ko.observable(false);
}

IExamVideo.VideoElementVM = function (id, name, link) {
    var self = this;

    self.id = ko.observable(id);
    self.name = ko.observable(name);
    self.link = ko.observable(link);
}

IExamVideo.PageLogic = function () {

    var loadVideosList = function() {
        $.ajax({
            type: 'GET',
            url: '/Video/GetVideoElements/',
            success: function (result) {
                if (result.length > 0) {
                    var tempArray = [];
                    for (var video in result) {
                        var newVideo = new IExamVideo.VideoElementVM(result[video].ID, result[video].name, result[video].link);
                        tempArray.push(newVideo);
                    }
                    IExamVideo.VideoList.videos.removeAll();
                    ko.utils.arrayPushAll(IExamVideo.VideoList.videos(), tempArray);
                    IExamVideo.VideoList.videos.valueHasMutated();
                    IExamVideo.VideoList.videoListIsVisible(true);
                }
                else {
                    IExamVideo.VideoList.videoListIsVisible(false);
                }
                //$('#videosContainer').html(result);

            },
            error: function (result) {
                alert(result.statusText)
            }
        })
        return false;
    }

    var LoadVideo = function (event) {
        if (event != null) {
            var id = $(event.target).attr('id');
        }
        else {
            var id = null;
        }
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

    var DeleteVideo = function DeleteVideo(event) {
        var id = $(event.target).attr('id');
        $.ajax({
            type: 'POST',
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
        loadVideosList: loadVideosList,
        LoadVideo: LoadVideo,
        DeleteVideo: DeleteVideo,
        deleteComment: deleteComment,
        sendComment: sendComment,
        textAreaEnterEvent: textAreaEnterEvent,
        countDown: countDown
    }

}();