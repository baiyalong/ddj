/**
 * Created by bai on 2015/8/14.
 */
var menu = {};
var project = {
    name: '',
    designs: []
};
var design = {}
var property = {}
var display = {}
property.enableCellEditing = function (fn) {
    (function ($) {
        function nav(target) {
            var dg = $(target);
            var opts = dg.datagrid('options');
            dg.datagrid('getPanel').attr('tabindex', 1).css('outline-style', 'none').unbind('.cellediting').bind('keydown.cellediting', function (e) {
                switch (e.keyCode) {
                    case 37:  // left
                        gotoCell(target, 'left');
                        break;
                    case 39:  // right
                        gotoCell(target, 'right');
                        break;
                    case 38:  // up
                        gotoCell(target, 'up');
                        break;
                    case 40:  // down
                        gotoCell(target, 'down');
                        break;
                    case 13:  // enter
                        var cell = $(this).find('td.datagrid-row-selected');
                        if (cell.length) {
                            var field = cell.attr('field');
                            var index = cell.closest('tr.datagrid-row').attr('datagrid-row-index');
                            dg.datagrid('editCell', {
                                index: index,
                                field: field
                            });
                        }
                        break;
                }
                return false;
            });
        }

        function gotoCell(target, p) {
            var dg = $(target);
            var opts = dg.datagrid('options');
            var cell = dg.datagrid('getPanel').find('td.datagrid-row-selected');
            if (typeof p == 'object') {
                cell.removeClass('datagrid-row-selected');
                cell = opts.finder.getTr(target, p.index).find('td[field="' + p.field + '"]');
                cell.addClass('datagrid-row-selected');
                return;
            }
            if (!cell) {
                return;
            }
            var field = cell.attr('field');
            var tr = cell.closest('tr.datagrid-row');
            var index = parseInt(tr.attr('datagrid-row-index'));
            var td = cell;
            if (p == 'up' && index > 0) {
                td = opts.finder.getTr(dg[0], index - 1).find('td[field="' + field + '"]');
            } else if (p == 'down' && index < dg.datagrid('getRows').length - 1) {
                td = opts.finder.getTr(dg[0], index + 1).find('td[field="' + field + '"]');
            } else if (p == 'left') {
                td = td.prev();
            } else if (p == 'right') {
                td = td.next();
            }
            if (td.length) {
                dg.datagrid('scrollTo', td.closest('tr.datagrid-row').attr('datagrid-row-index'));
                cell.removeClass('datagrid-row-selected');
                td.addClass('datagrid-row-selected');
            }
        }

        function editCell(target, param) {
            var dg = $(target);
            var opts = dg.datagrid('options');
            var fields = dg.datagrid('getColumnFields', true).concat(dg.datagrid('getColumnFields'));
            $.map(fields, function (field) {
                var col = dg.datagrid('getColumnOption', field);
                col.editor1 = col.editor;
                if (field != param.field) {
                    col.editor = null;
                }
            });
            dg.datagrid('endEdit', param.index);
            dg.datagrid('beginEdit', param.index);
            opts.editIndex = param.index;
            var ed = dg.datagrid('getEditor', param);
            if (ed) {
                var t = $(ed.target);
                if (t.hasClass('textbox-f')) {
                    t = t.textbox('textbox');
                }
                t.focus();
                t.bind('keydown', function (e) {
                    if (e.keyCode == 13) {
                        dg.datagrid('endEdit', param.index);
                        gotoCell(target, param);
                        dg.datagrid('getPanel').focus();
                    } else if (e.keyCode == 27) {
                        dg.datagrid('cancelEdit', param.index);
                        gotoCell(target, param);
                        dg.datagrid('getPanel').focus();
                    }
                    e.stopPropagation();
                });
            }
            $.map(fields, function (field) {
                var col = dg.datagrid('getColumnOption', field);
                col.editor = col.editor1;
            });
        }

        function enableCellEditing(target) {
            var dg = $(target);
            var opts = dg.datagrid('options');
            opts.oldOnClickCell = opts.onClickCell;
            opts.onClickCell = function (index, field) {
                if (opts.editIndex != undefined) {
                    if (dg.datagrid('validateRow', opts.editIndex)) {
                        dg.datagrid('endEdit', opts.editIndex);
                        opts.editIndex = undefined;
                    } else {
                        return;
                    }
                }
                dg.datagrid('selectRow', index).datagrid('editCell', {
                    index: index,
                    field: field
                }).datagrid('gotoCell', {
                    index: index,
                    field: field
                });
                opts.oldOnClickCell.call(this, index, field);
            };
            opts.onBeforeSelect = function () {
                return false;
            };
        }


        $.extend($.fn.datagrid.methods, {
            editCell: function (jq, param) {
                return jq.each(function () {
                    if (!fn(param)) return;
                    editCell(this, param);
                });
            },
            gotoCell: function (jq, param) {
                return jq.each(function () {
                    gotoCell(this, param);
                });
            },
            enableCellEditing: function (jq) {
                return jq.each(function () {
                    nav(this);
                    enableCellEditing(this);
                });
            }
        });

    })(jQuery);

    $(function () {
        $('#property').datagrid().datagrid('enableCellEditing');
    })

    property.enableCellEditing = function () {
    };
}
property.enableCellEditingFilter = function (param) {
    var res = false;
    var node = $('[id^=design]').tree('getSelected');
    switch (node.text) {
        case '基本参数':
        {
            if (param.index == 1 && param.field == 'value') res = true;
            break;
        }
            ;
        case '定子铁心':
        {
            if (param.field == 'value') res = true;
            var a = [3, 4, 5, 6, 13, 15, 16, 17, 18];
            if (param.field == 'unit' && a.indexOf(param.index) == -1) res = true;
            break;
        }
            ;
        case '定子绕组':
        {
            if (param.field == 'value') res = true;
            var a = [0, 1, 2, 3, 4, 5, 6, 13, 15, 16, 17, 18, 19];
            if (param.field == 'unit' && a.indexOf(param.index) == -1) res = true;
            break;
        }
            ;
        case '转子铁心':
        {
            if (param.field == 'value') res = true;
            var a = [3, 4, 5, 6, 15, 17, 19, 20, 21, 22];
            if (param.field == 'unit' && a.indexOf(param.index) == -1) res = true;
            break;
        }
            ;
        case '转子鼠笼':
        {
            if (param.field == 'value') res = true;
            var a = [4, 5];
            if (param.field == 'unit' && a.indexOf(param.index) == -1) res = true;
            break;
        }
            ;
        case '解析电磁稳态分析':
        {
            if (param.field == 'value') res = true;
            break;
        }
            ;
        case '解析电磁暂态分析':
        {
            if (param.field == 'value') res = true;
            break;
        }
            ;
        case '数值电磁分析':
        {
            if (param.field == 'value') res = true;
            break;
        }
            ;
        case '定子机械分析':
        {
            if (param.field == 'value') res = true;
            break;
        }
            ;
        case '定子端部分析':
        {
            if (param.field == 'value') res = true;
            break;
        }
            ;
        default:

    }
    return res;
}
property.init = function (node) {
    if (node.attributes == undefined || node.attributes.property == undefined || node.attributes.property.length == 0) {
        $('#property').datagrid({
            showHeader: false,
            data: null
        });
        return;
    }
    node.attributes.property.forEach(function (e, i, a) {
        e.sn = i + 1
    });
    var unitOptions = [
        {value: '毫米', text: '毫米'},
        {value: '厘米', text: '厘米'},
        {value: '分米', text: '分米'},
        {value: '米', text: '米'},
        {value: '英尺', text: '英尺'},
        {value: '英寸', text: '英寸'}
    ];
    $('#property').datagrid({
        showHeader: true,
        data: node.attributes.property,
        onBeforeEdit: function (index, row) {
            var col = $(this).datagrid('getColumnOption', 'value');
            var editor = {
                type: 'combobox', options: {
                    valueField: 'value',
                    textField: 'text',
                    panelHeight: 'auto',
                    required: true,
                    editable: false
                }
            };
            switch (row.name) {
                case '极数':
                {
                    editor = {
                        type: 'numberbox',
                        options: {
                            precision: 0,
                            min: 0
                        }
                    }
                    break;
                }
                case '铁心牌号':
                {
                    editor.options.data = [
                        {value: '50W470', text: '50W470'},
                        {value: '50W540', text: '50W540'},
                        {value: '50D23', text: '50D23'},
                    ];
                    break;
                }
                case '定子槽型':
                {
                    editor.options.data = [
                        {value: '全开口矩形槽', text: '全开口矩形槽'},
                        {value: '半开口矩形槽', text: '半开口矩形槽'},
                        {value: '半开口圆底槽', text: '半开口圆底槽'},
                    ];
                    break;
                }
                case '定子绕组层数':
                case '转子绕组层数':
                {
                    editor.options.data = [
                        {value: '单层', text: '单层'},
                        {value: '双层', text: '双层'},
                    ];
                    break;
                }
                case '定子绕组接法':
                case '转子绕组接法':
                {
                    editor.options.data = [
                        {value: '星型', text: '星型'},
                        {value: '角型', text: '角型'},
                    ];
                    break;
                }
                case '导线类型':
                {
                    editor.options.data = [
                        {value: '扁线', text: '扁线'},
                        {value: '圆线', text: '圆线'},
                    ];
                    break;
                }
                case '定子绕组连接类型':
                case '转子绕组连接类型':
                {
                    editor.options.data = [
                        {value: '显极', text: '显极'},
                        {value: '庶极', text: '庶极'},
                    ];
                    break;
                }
                case '转子绕组相序':
                {
                    editor.options.data = [
                        {value: '同侧', text: '同侧'},
                        {value: '异侧', text: '异侧'},
                    ];
                    break;
                }
                case '定子绕组相序':
                case '定子槽号排序':
                case '转子槽号排序':
                {
                    editor.options.data = [
                        {value: '顺时针', text: '顺时针'},
                        {value: '逆时针', text: '逆时针'},
                    ];
                    break;
                }
                case '定子线圈形状':
                {
                    editor.options.data = [
                        {value: '入槽在左边', text: '入槽在左边'},
                        {value: '入槽在右边', text: '入槽在右边'},
                    ];
                    break;
                }
                case '转子槽类型':
                {
                    editor.options.data = [
                        {value: 'A形槽', text: 'A形槽'},
                        {value: 'B形槽', text: 'B形槽'},
                        {value: 'C形槽', text: 'C形槽'},
                        {value: 'D形槽', text: 'D形槽'},
                        {value: 'E形槽', text: 'E形槽'},
                        {value: 'F形槽', text: 'F形槽'},
                        {value: 'G形槽', text: 'G形槽'},
                        {value: 'H形槽', text: 'H形槽'},
                    ];
                    break;
                }
                case '乙类波绕组':
                {
                    editor.options.data = [
                        {value: '是', text: '是'},
                        {value: '否', text: '否'},
                    ];
                    break;
                }
                case '求解方法':
                {
                    editor.options.data = [
                        {value: '解法1', text: '解法1'},
                        {value: '解法2', text: '解法2'},
                    ];
                    break;
                }
                case '定子机端电压类型':
                {
                    editor.options.data = [
                        {value: '正弦类型', text: '正弦类型'},
                        {value: '表格输入', text: '表格输入'},
                    ];
                    break;
                }
                case '转子旋转类型':
                {
                    editor.options.data = [
                        {value: '转速恒定', text: '转速恒定'},
                        {value: '转速可变', text: '转速可变'},
                    ];
                    break;
                }
                case '转子负载类型':
                {
                    editor.options.data = [
                        {value: '输出转矩', text: '输出转矩'},
                        {value: '输出功率', text: '输出功率'},
                    ];
                    break;
                }
                case '转子负载变量':
                {
                    editor.options.data = [
                        {value: '时间', text: '时间'},
                        {value: '转速', text: '转速'},
                    ];
                    break;
                }
                case '解方程龙格库塔法':
                {
                    editor.options.data = [
                        {value: '显式四阶', text: '显式四阶'},
                        {value: '半隐式', text: '半隐式'},
                    ];
                    break;
                }
                case '谐波分析方法':
                {
                    editor.options.data = [
                        {value: '方法一', text: '方法一'},
                        {value: '方法二', text: '方法二'},
                    ];
                    break;
                }
                case '分析结构类型':
                {
                    editor.options.data = [
                        {value: '定子铁心', text: '定子铁心'},
                        {value: '定子绕组', text: '定子绕组'},
                        {value: '定子基座', text: '定子基座'},
                        {value: '定子铁心绕组', text: '定子铁心绕组'},
                        {value: '定子整机', text: '定子整机'},
                    ];
                    break;
                }
                case '分析计算类型':
                {
                    editor.options.data = [
                        {value: '机械力学参数', text: '机械力学参数'},
                        {value: '机械模态特征', text: '机械模态特征'},
                        {value: '谐波响应振动', text: '谐波响应振动'},
                        {value: '瞬态响应振动', text: '瞬态响应振动'},
                        {value: '谐波电噪指数', text: '谐波电噪指数'},
                        {value: '瞬态电噪指数', text: '瞬态电噪指数'},
                        {value: '谐波电磁噪声', text: '谐波电磁噪声'},
                        {value: '瞬态电磁噪声', text: '瞬态电磁噪声'},
                    ];
                    break;
                }
                case '定子裸扁导线排列方式':
                {
                    editor.options.data = [
                        {value: '单根单排', text: '单根单排'},
                        {value: '单根双排', text: '单根双排'},
                        {value: '双根单排', text: '双根单排'},
                        {value: '双根双排', text: '双根双排'},
                        {value: '三根三排', text: '三根三排'},
                        {value: '四根双排', text: '四根双排'},
                        {value: '九根三排', text: '九根三排'},
                        {value: '其他排列', text: '其他排列'},
                    ];
                    break;
                }
                case '基座材料选择':
                {
                    editor.options.data = [
                        {value: '钢材', text: '钢材'},
                        {value: '铸铁', text: '铸铁'},
                        {value: '铝合金', text: '铝合金'},
                        {value: '其他材料', text: '其他材料'},
                    ];
                    break;
                }
                case '定子铁心与基座连接方式':
                {
                    editor.options.data = [
                        {value: '过盈装配', text: '过盈装配'},
                        {value: '骨架链接', text: '骨架链接'},
                    ];
                    break;
                }
                case '基座剖分类型':
                {
                    editor.options.data = [
                        {value: '智能网格剖分', text: '智能网格剖分'},
                        {value: '单元边长固定', text: '单元边长固定'},
                    ];
                    break;
                }
                case '设定基座固定约束':
                case '分析步数为2的幂次':
                case '分析步长自动确定':
                case '分析气隙磁力谐波':
                case '谐波分析':
                case '自动稳态判断':
                case '转子静态偏心':
                case '转子动态偏心':
                case '定子内圆为椭圆':
                {
                    editor = {
                        type: 'checkbox',
                        options: {
                            on: '是',
                            off: '否'
                        }
                    };
                    break;
                }
                case '定子线电压采样表格':
                {
                    $('#定子线电压采样表格').dialog('open');
                    return;
                }
                default:
                    editor = {
                        type: 'numberbox',
                        options: {
                            precision: 4,
                            min: 0
                        }
                    }
                    col.formatter = function (value, row, index) {
                        var number = Number(value);
                        if (isNaN(number)) {
                            return 0;
                        } else {
                            return number.toFixed(editor.options.precision) * 10000 / 10000;
                        }
                    }
            }
            col.editor = editor;
        },
        columns: [[
            {
                field: 'name', title: '名称', width: '35%'
            },
            {
                field: 'value', title: '值', width: '30%'
            },
            {
                field: 'unit', title: '单位', width: '30%',
                editor: {
                    type: 'combobox', options: {
                        valueField: 'value',
                        textField: 'text',
                        panelHeight: 'auto',
                        required: true,
                        editable: false,
                        data: unitOptions
                    }
                },
                formatter: function (value, row, index) {
                    var res = value;
                    if (value == '毫米') {
                        unitOptions.forEach(function (e) {
                            if (e.value == value) {
                                res = e.text;
                            }
                        });
                    }
                    return res;
                }
            }
        ]]
    });


    property.enableCellEditing(property.enableCellEditingFilter);
}

property.dialogs = {
    init: function () {
        $('#定子线电压采样表格').dialog({
            title: '定子机端线电压输入表格',
            width: 500,
            height: 500,
            closed: true,
            cache: true,
            modal: true,
            buttons: [{
                text: '读取文件',
                handler: function () {

                }
            }, {
                text: '确定',
                handler: function () {
                    $('#定子线电压采样表格').dialog('close')
                }
            }]
        });
        $('#定子线电压采样表格 table').datagrid({
            columns: [[
                {field: 'sn', title: '序号', width: 100},
                {field: 'time', title: '时间(s)', width: 100},
                {field: 'uab', title: 'Uab(V)', width: 100},
                {field: 'ubc', title: 'Ubc(V)', width: 100}
            ]]
        });
    }
};

design.contextMenu = function (e, node) {
    switch (node.text) {
        case '鼠笼型三相异步电动机':
        case '绕线型三相异步电动机':
        {
            $('#designRootContextMenu').menu('show', {
                left: e.pageX,
                top: e.pageY,
                onClick: function (item) {
                    switch (item.text) {
                        case '重命名':
                        {

                            break;
                        }
                            ;
                        case '删除':
                        {

                            break;
                        }
                            ;
                        default:
                    }
                }
            });
            break;
        }
        case '本体结构参数':
        {
            $('#designTemplateContextMenu').menu('show', {
                left: e.pageX,
                top: e.pageY,
                onClick: function (item) {
                    switch (item.text) {
                        case '读取成型设计单':
                        {

                            break;
                        }
                            ;
                        case '读取散嵌设计单':
                        {

                            break;
                        }
                            ;
                        default:
                    }
                }
            });
            break;
        }
        case '解析电磁稳态分析':
        case '解析电磁暂态分析':
        case '数值电磁分析':
        case '定子机械分析':
        case '定子端部分析':
        {
            $('#calculateNodeContextMenu').menu('show', {
                left: e.pageX,
                top: e.pageY,
                onClick: function (item) {

                }
            });
            break;
        }
        default:

    }

}

display.init = function (id, type) {
    $('#display').tabs('add', {
        id: id += '_display',
        title: (function (type) {
            if (type == 'shulong')return '鼠笼型三相异步电动机';
            else if (type == 'raoxian')return '绕线型三相异步电动机';
            else return '';
        })(type),
        content: null,
        closable: false,
    });
    $('#' + id).tabs({
        tabPosition: 'bottom',
        border: false
    }).tabs('add', {
        title: '图形窗口'
    }).tabs('add', {
        title: '定子绕组编辑器'
    }).tabs('add', {
        title: '文本窗口'
    }).tabs('add', {
        title: '曲线窗口'
    });
    if (type == 'raoxian')
        $('#' + id).tabs('add', {
            title: '转子绕组编辑器',
            index: 2
        });
    $('#' + id).tabs('select', 0);
}

design.init = function (id, type, data) {
    $('#projectName').parent().append('<ul class="design" id="' + id + '"></ul>');
    $('#' + id).tree({
        animate: true,
        onClick: function (node) {
            property.init(node);
        },
        onContextMenu: function (e, node) {
            e.preventDefault();
            // select the node
            $('#' + id).tree('select', node.target);
            // display context menu
            design.contextMenu(e, node);
        }
    });
    if (data != undefined) {
        $('#' + id).tree('loadData', [data]);
    } else {
        $('#' + id).tree({
            url: '/json/' + type + '.json',
            method: 'get',
        });
    }
    display.init(id, type);
}

menu.project = function () {
    $('#newProject').on('click', function () {
        $('#newProjectDialog').dialog('open');
    });
    $('#openProject').on('click', function () {
        $('#projectListDataGrid').datagrid('reload', {});
        $('#openProjectDialog').dialog('open');
    });
    $('#saveProject').on('click', function () {
        if (project.userName != $("#userName").text()) {
            $.messager.alert('', "不能修改其他人的项目！", 'error');
            return;
        }
        project.userName = $("#userName").text();
        project.designs.forEach(function (e) {
            var root = $('#' + e.id).tree('getRoot');
            var data = $('#' + e.id).tree('getData', root.target);
            e.data = JSON.stringify(data);
        })
        var type = 'POST', url = '/api/project';
        if (project._id != undefined) {
            type = 'PUT';
            url += '/' + project._id;
        }
        $.ajax({
            type: type,
            url: url,
            data: JSON.stringify(project),
            contentType: 'application/json',
            success: function (data) {
                if (data) {
                    project._id = data;
                    $.messager.alert('保存项目', '保存项目成功!', 'info');
                }
                else {
                    $.messager.alert('保存项目', '保存项目失败!', 'error');
                }
            }
        });
    });
    var projectNameContextMenu = function () {
        $('#projectName').bind('contextmenu', function (e) {
            e.preventDefault();
            $('#projectNameContextMenu').menu('show', {
                left: e.pageX,
                top: e.pageY,
                onClick: function (item) {
                    switch (item.text) {
                        case '重命名':
                        {
                            $('#newProjectDialog').dialog({
                                title: '重命名项目'
                            }).dialog('open');
                            break;
                        }
                            ;
                        case '删除':
                        {
                            if (confirm('确认删除项目 ' + $('#projectName').text() + ' 吗？')) {
                                $('#projectName').text('');
                                //delete project and the designs
                            }
                            break;
                        }
                            ;
                        default:
                    }
                }
            });
        });
        projectNameContextMenu = function () {
        }
    }
    $('#newProjectDialog').dialog({
        title: '新建项目',
        width: 300,
        height: 200,
        closed: true,
        cache: false,
        modal: true,
        buttons: [{
            text: '保存',
            handler: function () {
                project._id = undefined;
                var projectName = $('input[name="projectName"]').val();
                project.name = projectName;
                $('#projectName').text(projectName);
                $('#newProjectDialog').dialog('close');
                projectNameContextMenu();
                property.dialogs.init();
            }
        }, {
            text: '取消',
            handler: function () {
                $('#newProjectDialog').dialog('close');
            }
        }]
    });
    $('#projectListDataGrid').datagrid({
        url: '/api/project',
        method: 'get',
        columns: [[
            {
                field: 'name', title: '项目名称', width: 100
            },
            {
                field: 'userName', title: '创建者', width: 100
            },
            {
                field: 'createTime', title: '创建时间', width: 200,
                formatter: function (value, row, index) {
                    var vv = value.replace('T', ' ');
                    return vv.substring(0, vv.indexOf('.'));
                }
            }
        ]],
        singleSelect: true
    });
    $('#openProjectDialog').dialog({
        title: '打开项目',
        width: 400,
        height: 300,
        closed: true,
        cache: false,
        modal: true,
        buttons: [{
            text: '打开',
            handler: function () {
                var row = $('#projectListDataGrid').datagrid('getSelected');
                if (row == null) {
                    $.messager.alert('', "请选择要打开的项目！", 'error');
                    return;
                }
                if (row.userName != $("#userName").text()) {
                    $.messager.alert('打开项目', '不能编辑其他人的项目!', 'info');
                }
                $.ajax({
                    type: 'GET',
                    url: '/api/project/' + row._id,
                    contentType: 'application/json',
                    success: function (data) {
                        if (data) {
                            $('#openProjectDialog').dialog('close');
                            project = data;
                            project.designs.forEach(function (e, i, a) {
                                var id = 'design' + i;
                                if (project.userName != $("#userName").text()) {
                                    id += '_cannotedit'
                                }
                                design.init(id, e.type, JSON.parse(e.data));
                            })
                        }
                        else {
                            $.messager.alert('打开项目', '打开项目失败!', 'error');
                        }
                    }
                });
            }
        }, {
            text: '删除',
            handler: function () {
                var row = $('#projectListDataGrid').datagrid('getSelected');
                if (row == null) {
                    $.messager.alert('', "请选择要删除的项目！", 'error');
                    return;
                }
                if (row.userName != $("#userName").text()) {
                    $.messager.alert('打开项目', '不能删除其他人的项目!', 'error');
                    return;
                }
                $.ajax({
                    type: 'DELETE',
                    url: '/api/project/' + row._id,
                    contentType: 'application/json',
                    success: function (data) {
                        if (data) {
                            $.messager.alert('打开项目', '删除成功!', 'info');
                            $('#projectListDataGrid').datagrid('reload', {});
                        }
                        else {
                            $.messager.alert('打开项目', '删除失败!', 'error');
                        }
                    }
                });
            }
        }, {
            text: '取消',
            handler: function () {
                $('#openProjectDialog').dialog('close');
            }
        }]
    });

}

menu.design = function () {
    $('#newDesign').on('click', function () {
        if (project.name == '') {
            $.messager.alert('', "请先创建或打开项目！", 'error');
            return;
        }
        $('#newDesignDialog').dialog('open');
    });
    $('#newDesignDialog').dialog({
        title: '新建设计',
        width: 300,
        height: 200,
        closed: true,
        cache: false,
        modal: true,
        buttons: [{
            text: '保存',
            handler: function () {
                var designType = $("input[name='designType']:checked").val();
                var id = 'design' + $('#projectName').nextAll('.design').length;
                project.designs.push({
                    id: id, type: designType
                });
                design.init(id, designType);
                $('#newDesignDialog').dialog('close');
            }
        }, {
            text: '取消',
            handler: function () {
                $('#newDesignDialog').dialog('close');
            }
        }]
    });
}

menu.init = function () {
    menu.project();
    menu.design();
}


$(function () {
    menu.init();
});