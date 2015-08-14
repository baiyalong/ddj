/**
 * Created by bai on 2015/8/14.
 */
$(function () {
    window.onbeforeunload = function () { return '将丢失未保存的数据!'; }
})