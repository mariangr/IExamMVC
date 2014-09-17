$(document).ready(function () {
    $('.selectUserRoleChange').on('change', function () {
        var newRole = $(this).val();
        var userRole = $(this).siblings();
        var userId = $(this).parent().siblings().attr('value');

        if (userRole.html().trim() != newRole && newRole != "default") {
            $.ajax({
                type: 'POST',
                url: '/Account/ChangeUserRole/',
                data: { newRole: newRole, userId: userId },
                success: function () {
                    userRole.html(newRole);
                },
                error: function () {
                    alert('error');
                }
            })
        }
    })
})

function DeleteUser(event, userId) {
    var UserRow = $(event.target).parent().parent();
    $.ajax({
        type: 'POST',
        url: '/Account/DeleteUser/',
        data: { userId: userId },
        success: function () {
            $(UserRow).hide();
        },
        error: function () {
            alert('error');
        }
    })
}