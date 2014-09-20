var IExam = IExam || {};

$(document).ready(function () {
    IExam.UsersPageManagement = new IExam.UsersPageManagementModel();
    ko.applyBindings(IExam.UsersPageManagement, document.getElementById(main_content));
    IExam.PageLogic.RefreshUsersStatistics();
    IExam.PageLogic.FillUsersTable();
})

IExam.UsersPageManagementModel = function () {
    var self = this;

    self.UserStats = {
        usersNumber: ko.observable(0),
        adminsNumber: ko.observable(0),
        moderatorsNumber: ko.observable(0),
        allUsersNumber: ko.observable(0)
    };

    self.users = ko.observableArray([]);

}

IExam.UserVM = function (id, name, roles) {
    var self = this;

    self.id = id;
    self.name = name;
    self.role = roles[0];
}

IExam.PageLogic = function () {
    function ChangeUserRole(event) {
        var newRole = $(event.target).val();
        var userId = $(event.target).attr('id');
        var userRole = $("#RoleId" + userId);

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

    function DeleteUser(event) {
        var userId = $(event.target).attr('id');
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
            type: 'GET',
            url: '/Account/GetUserStatistics/',
            data: JSON,
            success: function (statsResult) {
                IExam.UsersPageManagement.UserStats.usersNumber(statsResult.users);
                IExam.UsersPageManagement.UserStats.adminsNumber(statsResult.admins);
                IExam.UsersPageManagement.UserStats.moderatorsNumber(statsResult.moderators);
                IExam.UsersPageManagement.UserStats.allUsersNumber(statsResult.allUsers);
            },
            error: function () {
                alert('error');
            }
        })
    }

    function FillUsersTable() {
        $.ajax({
            type: 'GET',
            url: '/Account/AllUsersData/',
            data: JSON,
            success: function (tableResult) {
                var tempArray = [];
                for (var userI in tableResult) {
                    tempArray.push(new IExam.UserVM(tableResult[userI].id, tableResult[userI].name, tableResult[userI].role))
                }
                ko.utils.arrayPushAll(IExam.UsersPageManagement.users(), tempArray);
                IExam.UsersPageManagement.users.valueHasMutated();
            },
            error: function () {
                alert('error');
            }
        })

                
    }

    return {
        RefreshUsersStatistics: RefreshUsersStatistics,
        DeleteUser: DeleteUser,
        ChangeUserRole: ChangeUserRole,
        FillUsersTable: FillUsersTable
    }
}();


