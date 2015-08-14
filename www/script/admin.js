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
    loginDialog: function (fn) {
        $('#loginDialog').dialog({
            title: '管理员登录',
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
                        fn();
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
                $('#loginDialog').dialog('open');
                location.reload();
            }
        });
    },
    userAddDialog: function () {
        $('#userAddDialog').dialog({
            title: '添加用户',
            collapsible: false,
            minimizable: false,
            maximizable: false,
            closable: false,
            draggable: false,
            resizable: false,
            width: 300,
            height: 200,
            modal: true,
            closed: true,
            onOpen: function () {
                $('#userAddDialog form').form('clear');
            },
            buttons: [{
                text: '保存',
                handler: function () {
                    user.user.name = $('#userAddDialog input[name="name"]').val();
                    user.user.password = $('#userAddDialog input[name="password"]').val();
                    user.userAdd(function () {
                        $('#userAddDialog').dialog('close');
                        $('#userDatagrid').datagrid('reload');
                    });
                }
            }, {
                text: '取消',
                handler: function () {
                    $('#userAddDialog').dialog('close');
                }
            }]
        });
    },
    userEditDialog: function () {
        $('#userEditDialog').dialog({
            title: '修改密码',
            collapsible: false,
            minimizable: false,
            maximizable: false,
            closable: false,
            draggable: false,
            resizable: false,
            width: 300,
            height: 200,
            modal: true,
            closed: true,
            onOpen: function () {
                var su = $('#userDatagrid').datagrid('getSelected');
                $('#userEditDialog form').form('load', {
                    name: su.name,
                    password: ''
                });
            },
            buttons: [{
                text: '保存',
                handler: function () {
                    user.user.password = $('#userEditDialog input[name="password"]').val();
                    var su = $('#userDatagrid').datagrid('getSelected');
                    user.userEdit(su._id, function () {
                        $('#userEditDialog').dialog('close');
                        $('#userDatagrid').datagrid('reload');
                    });
                }
            }, {
                text: '取消',
                handler: function () {
                    $('#userEditDialog').dialog('close');
                }
            }]
        });
    },
    userAdd: function (fn) {
        $.ajax({
            type: 'POST',
            url: '/api/user',
            data: JSON.stringify(this.user),
            contentType: 'application/json',
            success: function (data) {
                if (data.length == 24) {
                    fn();
                }
                else {
                    $.messager.alert('添加用户失败！', data, 'error');
                }
            }
        });
    },
    userDelete: function (id, fn) {
        $.ajax({
            type: 'DELETE',
            url: '/api/user/' + id,
            contentType: 'application/json',
            success: function (data) {
                fn();
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
    userDatagrid: function () {
        $('#userDatagrid').datagrid({
            rownumbers: true,
            singleSelect: true,
            url: '/api/user',
            method: 'get',
            columns: [[
                { field: 'name', title: '帐号', width: 200 },
                {
                    field: 'createTime', title: '创建时间', width: 200,
                    formatter: function (value, row, index) {
                        if (value) {
                            return value.replace('T', '  ').split('.')[0];
                        }
                    }
                },

            ]],
            toolbar: [{
                iconCls: 'icon-add',
                text: '添加用户',
                handler: function () {
                    $('#userAddDialog').dialog('open');
                }
            }, '-', {
                iconCls: 'icon-remove',
                text: '删除用户',
                handler: function () {
                    var su = $('#userDatagrid').datagrid('getSelected');
                    if (su != null && su.name != 'admin') {
                        user.userDelete(su._id, function () {
                            $('#userDatagrid').datagrid('reload');
                        });
                    }
                }
            }, '-', {
                iconCls: 'icon-edit',
                text: '修改密码',
                handler: function () {
                    var su = $('#userDatagrid').datagrid('getSelected');
                    if (su != null) {
                        $('#userEditDialog').dialog('open');
                    }

                }
            }]
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
    init: function () {
        this.loginDialog(function () {
            user.userDatagrid();
        });
        this.userAddDialog();
        this.userEditDialog();
    }
}





$(function () {
    user.init();
})