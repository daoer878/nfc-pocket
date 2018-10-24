/**
 * Created by steve on 14-10-7.
 */

define(['jquery', 'jquerymobile', 'net', 'md5','dialogs'], function($, m, net, md5, dia) {
    //slide_back
    $('#question_content_static').on('swiperight',function() {

        $.mobile.backChangePage("#setting",{ transition: "slide",reverse: false,changeHash: false});
    });

    //设置内容高度是Header剩下的高度
    $("#page_question").off('pageshow')
        .on( "pageshow", function( event ) {
            console.error("#page_question");
			window.scrollForAndroid('question_content_static');
            window.setBodyOverflow($(document.body));
            $('#question_content_static').css('height',($(window).height()-44-20));
            $('#question_ul').css('min-height', ($(window).height()-61-4));
            // window.historyView = [];
    });

    $('#btn_question_turn_back').off('click')
        .on('click', function() {
            console.assert(!$.isEmptyObject(window.q['question_back']), 'window.q["question_back"]不存在');
            $.mobile.backChangePage(window.q['question_back'],{ transition: "slide",reverse: true,changeHash: false});
    });

    function compatibility() {
        /* Logon */
        $('#title_question').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_question').css('postion', 'absulute')
            .css('width', '240px')
            .css('height','20px')
            .css('margin', '8px auto auto auto');
    }

    $(document).ready(function () {
        setTimeout(function() {
            // 兼容其他浏览器
            compatibility();
        },1000);
    });
});