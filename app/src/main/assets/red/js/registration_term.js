/**
 * Created by yk on 16/7/7.
 */
define(['jquery', 'jquerymobile', 'net', 'md5','dialogs'], function($, m, net, md5, dia) {
    //设置内容高度是Header剩下的高度
    $("#registration_conditions").off('pageshow')
        .on( "pageshow", function( event ) {
            window.setBodyOverflow($(document.body));
            $('#registration_term_content').css('height',($(window).height()-44-20));
            $('#registration_term_content_info').css('min-height',($(window).height()-44-20));
            // 兼容其他浏览器
            compatibility();
            // window.historyView = [];
        });


    $('#terms_detail_btn_menu').off('click')
    .on('click', function() {
        $.mobile.backChangePage("#registration_show",{ transition: "slide",reverse: true,changeHash: false});
    });
    $('#registration_term_content').on('swiperight',function() {
        $.mobile.backChangePage("#registration_show",{ transition: "slide",reverse: true,changeHash: false});
    });

    function compatibility() {
        /* Logon */
        $('#title_registration_term').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_registration_term').css('postion', 'absulute')
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