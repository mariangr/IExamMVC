$(document).ready(function () {
    loadSelectedPage('_Home');
});

function loadSelectedPage(page) {
    $.ajax({
        type: 'POST',
        url: '/Home/ReturnPartialView/',
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

//var VIDEO_RESPONSE = {
//    "SUCCESS": "Video Successfully added!",
//    "DUPLICATE": "Video already exists",
//    "FAILURE": "Service error!"
//}

function addNewVideo() {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var link = $('#linkForNewVideo').val();
    var match = link.match(regExp);
    if (match && match[2].length == 11) {
        link = match[2];
    }

    $.ajax({
        type: 'POST',
        url: '/Video/CreateVideo/',
        data: { name: $('#nameForNewVideo').val(), link: link },
        success: function (result) {
            if (result == "videoAddedSuccessfully") {
                alert("Video Successfully Added")
                loadVideosList();
                $('#nameForNewVideo').val("");
                $('#linkForNewVideo').val("");
            }
            else if (result == "videoExists") {
                alert("Video Already Exists")
            } else if (result == "unknownExeption") {
                alert("Unknown Server Error! Check fields.")
            }

        },
        error: function () {
            alert("Ading Video Unsuccessfull")
        }
    })
    return false;
}

function loadVideosList() {
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

function LoadVideo(id) {
    if (id != null) {
        $.ajax({
            type: 'GET',
            url: '/Video/GetVideoPlayer/',
            data: { id: id },
            success: function (result) {
                $('#videosPlayerContainer').html(result);
                getCurrentVideoComments();
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

function DeleteVideo(id) {
    $.ajax({
        type: 'GET',
        url: '/Video/DeleteVideo/',
        data: { id: id },
        success: function (result) {
            LoadVideo(null);
            $('#videoComents').html("");
            loadVideosList();
        },
        error: function (result) {
            alert(result.statusText)
        }
    })
    return false;
}

function getCurrentVideoComments() {

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

function SendComment() {
    var linkOfComment = $('#selectedVideoInPlayerLink').val();
    var message = $('#commentForVideo').val();
    $.ajax({
        type: 'GET',
        url: '/Video/CreateVideoComment/',
        data: { link: linkOfComment, message: message },
        success: function (result) {
            if (result == "CommentAddedSuccessfully") {
                getCurrentVideoComments();
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