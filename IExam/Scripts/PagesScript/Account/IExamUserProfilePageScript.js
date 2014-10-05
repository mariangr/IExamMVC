/// <reference path="../../bootstrap.min.js" />
/// <reference path="../../jquery-2.1.1.min.js" />

var IExamUserProfile = IExamUserProfile || {};

IExamUserProfile.PageLogic = function () {
    var photoUploadModalManagement = function () {
        $('#user_profile_upload_picture').modal();
    }
    


    return {
        photoUploadModalManagement: photoUploadModalManagement,
    }
}()