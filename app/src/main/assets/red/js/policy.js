/**
 * Created by steve on 14-10-7.
 */

define(['jquery', 'jquerymobile', 'net', 'md5','dialogs'], function($, m, net, md5, dia) {
    //slide_back
    $('#policy_content_static').on('swiperight',function() {

        $.mobile.backChangePage("#setting",{ transition: "slide",reverse: false,changeHash: false});
    });


    //设置内容高度是Header剩下的高度
    $("#page_policy").off('pageshow')
        .on( "pageshow", function( event ) {
			window.scrollForAndroid('policy_content_static');
            window.setBodyOverflow($(document.body));
            $('#policy_content_static').css('height',($(window).height()-44-20));
            $('#policy_ul').css('min-height', ($(window).height()-61-4));
            // window.historyView = [];
    });

    $('#btn_policy_turn_back').off('click')
        .on('click', function() {
            console.assert(!$.isEmptyObject(window.q['policy_back']), 'window.q["policy_back"]不存在');
            $.mobile.backChangePage(window.q['policy_back'],{ transition: "slide",reverse: true,changeHash: false});
    });

    function compatibility() {
        /* Logon */
        $('#title_policy').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_policy').css('postion', 'absulute')
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