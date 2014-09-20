var IExamUsers = IExamUsers || {};

$(document).ready(function () {
    IExamUsers.UsersPageManagement = new IExamUsers.UsersPageManagementModel();
    ko.applyBindings(IExamUsers.UsersPageManagement, document.getElementById(main_content));
    IExamUsers.PageLogic.RefreshUsersStatistics();
    IExamUsers.PageLogic.FillUsersTable();
})

IExamUsers.UsersPageManagementModel = function () {
    var self = this;

    self.UserStats = {
        usersNumber: ko.observable(0),
        adminsNumber: ko.observable(0),
        moderatorsNumber: ko.observable(0),
        allUsersNumber: ko.observable(0)
    };

    self.users = ko.observableArray([]);

}

IExamUsers.UserVM = function (id, name, role, firstName, lastName, identityNumber, FN ) {
    var self = this;

    self.id = ko.observable(id);
    self.name = ko.observable(name);
    self.role = ko.observable(role);
    self.firstName = ko.observable(firstName);
    self.lastName = ko.observable(lastName);
    self.identityNumber = ko.observable(identityNumber);
    self.FN = ko.observable(FN);
}

IExamUsers.PageLogic = function () {
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
                    IExamUsers.PageLogic.RefreshUsersStatistics()
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
                IExamUsers.PageLogic.RefreshUsersStatistics()
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
                IExamUsers.UsersPageManagement.UserStats.usersNumber(statsResult.users);
                IExamUsers.UsersPageManagement.UserStats.adminsNumber(statsResult.admins);
                IExamUsers.UsersPageManagement.UserStats.moderatorsNumber(statsResult.moderators);
                IExamUsers.UsersPageManagement.UserStats.allUsersNumber(statsResult.allUsers);
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
                    tempArray.push(new IExamUsers.UserVM(
                        tableResult[userI].Id,
                        tableResult[userI].UserName,
                        tableResult[userI].Roles[0].RoleId,
                        tableResult[userI].FirstName,
                        tableResult[userI].LastName,
                        tableResult[userI].IdentityNumber,
                        tableResult[userI].FN
                        ))
                }
                ko.utils.arrayPushAll(IExamUsers.UsersPageManagement.users(), tempArray);
                IExamUsers.UsersPageManagement.users.valueHasMutated();
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


