/**
 * Created by bai on 2015/8/14.
 */
var user = {
    user: {},
    login: function (fn) {
        $.ajax({
            type: 'POST',
            url: '/api/user/login',
            data: JSON.stringify(this.user),
            contentType: 'application/json',
            success: function (data) {
                if (data.length == 24) {
                    if (user.user.name == 'admin') {
                        window.location.href = '/Home/Admin';
                    }
                    user.user._id = data;
                    fn();
                    $('#userName').text(user.user.name);
                    $('#logout').text('注销');
                    $('#changePassword').text('修改密码');
                }
                else {
                    $.messager.alert('登录失败！', data, 'error');
                }
            }
        });
    },
    loginDialog: function () {
        $('#loginDialog').dialog({
            title: '用户登录',
            collapsible: false,
            minimizable: false,
            maximizable: false,
            closable: false,
            draggable: false,
            resizable: false,
            width: 300,
            height: 200,
            modal: true,
            buttons: [{
                text: '登录',
                handler: function () {
                    user.user.name = $('#loginDialog input[name="name"]').val();
                    user.user.password = $('#loginDialog input[name="password"]').val();
                    user.login(function () {
                        $('#loginDialog').dialog('close');
                    });
                }
            }]
        });
    },
    logout: function () {
        $.ajax({
            type: 'DELETE',
            url: '/api/user/logout/' + user.user._id,
            contentType: 'application/json',
            success: function () {
                //$('#loginDialog').dialog('open');
                location.reload();
            }
        });
    },
    userEdit: function (id, fn) {
        $.ajax({
            type: 'PUT',
            url: '/api/user/' + id,
            data: JSON.stringify(this.user),
            contentType: 'application/json',
            success: function (data) {
                fn();
            }
        });
    },
    changePassword: function () {
        $('#loginDialog').dialog({
            title: '修改密码',
            buttons: [{
                text: '保存',
                handler: function () {
                    user.user.password = $('#loginDialog input[name="password"]').val();
                    user.userEdit(user.user._id, function () {
                        $('#loginDialog').dialog('close');
                        $('#userDatagrid').datagrid('reload');
                    });
                }
            }, {
                text: '取消',
                handler: function () {
                    $('#loginDialog').dialog('close');
                }
            }]
        }).dialog('open');
    },
    enter: function () {
        $('#loginDialog input').on('keydown', function (e) {
            var btnCount = $('#loginDialog').parent().find('span.l-btn-text').length;
            if (e.keyCode == 13) {
                if (btnCount == 1) {
                    user.user.name = $('#loginDialog input[name="name"]').val();
                    user.user.password = $('#loginDialog input[name="password"]').val();
                    user.login(function () {
                        $('#loginDialog').dialog('close');
                    });
                } else if (btnCount == 2) {
                    user.user.password = $('#loginDialog input[name="password"]').val();
                    user.userEdit(user.user._id, function () {
                        $('#loginDialog').dialog('close');
                        $('#userDatagrid').datagrid('reload');
                    });
                }
            }
        });
    },
    init: function () {
        this.loginDialog();
        this.enter();
    }
}





$(function () {
    user.init();
})