/**
 * Created by steve on 14-10-7.
 */

define(['jquery', 'jquerymobile', 'net', 'md5','dialogs'], function($, m, net, md5, dia) {
    //设置内容高度是Header剩下的高度
    $("#infomation").off('pageshow')
        .on( "pageshow", function( event ) {
			window.scrollForAndroid('infomation_content_static');
            window.setBodyOverflow($(document.body));
            $('#infomation_content_static').css('height',($(window).height()-44-20));
            $('#information_ul').css('min-height', ($(window).height()-61-4));
            // 兼容其他浏览器
            compatibility();
            // window.historyView = [];
    });

    $('#btn_infomation_turn_back').off('click')
        .on('click', function() {
            console.assert(!$.isEmptyObject(window.q['infomation_back']), 'window.q["infomation_back"]不存在');
            $.mobile.backChangePage(window.q['infomation_back'],{ transition: "slide",reverse: false,changeHash: false});
    });
    //back_slide
    $('#infomation_content_static').on('swiperight',function() {
        if(!q['user']){
            $.mobile.backChangePage("#logon",{ transition: "slide",reverse: true,changeHash: false});
        }else{
            $.mobile.backChangePage("#setting",{ transition: "slide",reverse: true,changeHash: false});
        }
    });
    function compatibility() {
        /* Logon */
        $('#title_infomation').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_infomation').css('postion', 'absulute')
            .css('width', '240px')
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
