var IExamUsers = IExamUsers || {};
IExamUsers.UsersPageManagement = null;

$(document).ready(function () {
    IExamUsers.UsersPageManagement = new IExamUsers.UsersPageManagementModel();
    ko.applyBindings(IExamUsers.UsersPageManagement, document.getElementById(main_content));
    IExamUsers.PageLogic.RefreshUsersStatistics();
    IExamUsers.PageLogic.FillUsersTable();

    $('#user_update_data_popup').on('shown.bs.modal', function () {
        $('#userFirstName').focus();
    })
})

IExamUsers.UsersPageManagementModel = function () {
    var self = this;

    self.usersTableVisibility = ko.observable(false);

    self.UserStats = {
        usersNumber: ko.observable(0),
        adminsNumber: ko.observable(0),
        moderatorsNumber: ko.observable(0),
        allUsersNumber: ko.observable(0)
    };

    self.users = ko.observableArray([]);

    self.ShowHideUsersTable = function () {
        var visibility = self.usersTableVisibility();
        self.usersTableVisibility(!visibility);
    }
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
    function stopPropagations(event) {
        if (event.stopPropagation) {
            event.stopPropagation()
        }
        else if (event.cancelBubble) {
            event.cancelBubble = true;
        }
        else {
            window.event.cancelBubble = true;
        }
    }

    function ChangeUserRole(event) {
        IExamUsers.PageLogic.stopPropagations(event);
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
                    IExamUsers.PageLogic.RefreshUsersStatistics();
                    $(event.target).val('default');
                },
                error: function () {
                    alert('error');
                }
            })
        }
    }

    function DeleteUser(event) {
        IExamUsers.PageLogic.stopPropagations(event);
        var userId = $(event.target).attr('id');
        var UserRow = $(event.target).parent().parent();
        $.ajax({
            type: 'POST',
            url: '/Account/DeleteUser/',
            data: { userId: userId },
            success: function () {
                $(UserRow).hide();
                //IExamUsers.PageLogic.FillUsersTable()
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
                IExamUsers.UsersPageManagement.users.removeAll();
                ko.utils.arrayPushAll(IExamUsers.UsersPageManagement.users(), tempArray);
                IExamUsers.UsersPageManagement.users.valueHasMutated();
            },
            error: function () {
                alert('error');
            }
        })
    }

    function ChangeUserData(event) {
        var row = $(event.target).parents();
        var tr = null;
        for (var rowI in row) {
            if ($(row[rowI])[0].nodeName == "TR") {
                tr = row[rowI];
                break;
            }
        }
        var id = $(tr).attr('id');
        $('#userID').val(id);
        $('#username').html($(tr)[0].childNodes['1'].innerHTML);
        $('#userFirstName').val($(tr)[0].childNodes['3'].innerHTML);
        $('#userLastName').val($(tr)[0].childNodes['5'].innerHTML);
        $('#userIdentityNumber').val($(tr)[0].childNodes['7'].innerHTML);
        $('#userFN').val($(tr)[0].childNodes['9'].innerHTML);

        $('#user_update_data_popup').modal();
    }

    function UpdateUser() {
        var userID = $('#userID').val();
        var UserName = $('#username').html();
        var UserFName = $('#userFirstName').val();
        var userLName = $('#userLastName').val();
        var userIdentityNumber = $('#userIdentityNumber').val();
        var userFN = $('#userFN').val();

        $.ajax({
            type: 'POST',
            url: '/Account/UpdateUser/',
            data: { Id: userID, FirstName: UserFName, LastName: userLName, FN: userFN, IdentityNumber: userIdentityNumber },
            success: function (result) {
                IExamUsers.PageLogic.FillUsersTable();
                $('#user_update_data_popup').modal('hide');
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
        FillUsersTable: FillUsersTable,
        ChangeUserData: ChangeUserData,
        UpdateUser: UpdateUser,
        stopPropagations: stopPropagations
    }
}();


