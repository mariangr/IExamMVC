$(document).ready(function () {
    ko.applyBindings(IExam.UsersPageManagement, document.getElementById(main_content));
    IExam.PageLogic.RefreshUsersStatistics();
    $('.selectUserRoleChange')

})

var IExam = IExam || {};

IExam.PageLogic = function () {
    function ChangeUserRole(event, userId) {
        var newRole = $(event.target).val();
        var userRole = $("#RoleId" + userId);
        var userId = userId;

        if ((userRole.html().trim() != newRole) && (newRole != "default")) {
            $.ajax({
                type: 'POST',
                url: '/Account/ChangeUserRole/',
                data: { newRole: newRole, userId: userId },
                success: function () {
                    userRole.html(newRole);
                    IExam.PageLogic.RefreshUsersStatistics()
                },
                error: function () {
                    alert('error');
                }
            })
        }
    }

    function DeleteUser(event, userId) {
        var UserRow = $(event.target).parent().parent();
        $.ajax({
            type: 'POST',
            url: '/Account/DeleteUser/',
            data: { userId: userId },
            success: function () {
                $(UserRow).hide();
                IExam.PageLogic.RefreshUsersStatistics()
            },
            error: function () {
                alert('error');
            }
        })
    }

    function RefreshUsersStatistics() {
        $.ajax({
            type: 'Get',
            url: '/Account/GetUserStatistics/',
            data: JSON,
            success: function (result) {
                IExam.UsersPageManagement.usersNumber(result.users);
                IExam.UsersPageManagement.adminsNumbers(result.admins);
                IExam.UsersPageManagement.moderatorsNumber(result.moderators);
                IExam.UsersPageManagement.allUsersNumber(result.allUsers);
            },
            error: function () {
                alert('error');
            }
        })
    }
    return {
        RefreshUsersStatistics: RefreshUsersStatistics,
        DeleteUser: DeleteUser,
        ChangeUserRole: ChangeUserRole
    }
}();

IExam.UsersPageManagement = function () {
    var self = this;

    self.usersNumber = ko.observable(0);
    self.adminsNumber = ko.observable(0);
    self.moderatorsNumber = ko.observable(0);
    self.allUsersNumber = ko.observable(0);
}




