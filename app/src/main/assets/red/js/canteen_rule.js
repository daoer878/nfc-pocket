/**
 * Created by yk on 16/11/15.
 */
define(['jquery', 'jquerymobile', 'net', 'md5','dialogs'], function($, m, net, md5, dia) {
    //设置内容高度是Header剩下的高度
    $("#canteen_rules").off('pageshow')
        .on( "pageshow", function( event ) {
            window.setBodyOverflow($(document.body));
            $('#canteen-rules-content').css('height',($(window).height()-44-20));
            $('#canteen-rules-content-info').css('min-height',($(window).height()-44-20));
            // 兼容其他浏览器
            compatibility();
            // window.historyView = [];
        });


    $('\#canteen-rules-btn-menu,#canteen-rules-btn-back').off('click')
        .on('click', function() {
            $.mobile.backChangePage("#canteen",{ transition: "slide",reverse: true,changeHash: false});
        });

    function compatibility() {
        /* Logon */
        $('#title_canteen_rule').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_canteen_rule').css('postion', 'absulute')
            .css('width', '120px')
            .css('height','20px')
            .css('margin', '8px auto auto auto')
            .css('text-align', 'center');
    }

    $(document).ready(function () {
        setTimeout(function() {
            // 兼容其他浏览器
            compatibility();
        },1000);
    });
});