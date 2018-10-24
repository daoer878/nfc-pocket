
require(['jquery', 'jquerymobile', 'net', 'dialogs','panle'], function($, m, net, dia,panle) {

    //点击进入修改密码页面
    $('#btn_setting_changePW').off('click')
        .on('click', function() {
            $.mobile.newChangePage("#forgetPassword",{ transition: "slide",reverse: false,changeHash: false});
        });
    //点击进入修改密码根据staffID页面
    $('#btn_setting_changePWById').off('tap')
        .on('tap', function() {
            $.mobile.newChangePage("#ResetPasswordById",{ transition: "slide",reverse: false,changeHash: false});
        });
    //点击返回myconnerHome 页面
    $('#setting-back').off('click')
        .on('click', function() {
            $.mobile.newChangePage("#myCornerHome",{ transition: "slide",reverse: true,changeHash: false});
        });
    //返回页面
    $('#title_settings').off('click')
        .on('click', function() {
            $.mobile.newChangePage("#myCornerHome",{ transition: "slide",reverse: true,changeHash: false});
        });
    // 点击进入关于App
    $('#btn_setting_about').off('click')
        .on('click', function(evt) {
            window.q['infomation_back'] = '#setting';
            $.mobile.newChangePage("#infomation",{ transition: "slide",reverse: false,changeHash: false});
        });

    // 点击进入团队信息
    $('#btn_setting_question').off('click')
        .on('click', function(evt) {
            window.q['question_back'] = '#setting';
            $.mobile.newChangePage("#page_question",{ transition: "slide",reverse: false,changeHash: false});
        });
    // 点击进入政策
    $('#btn_setting_policy').off('click')
        .on('click', function(evt) {
            window.q['policy_back'] = '#setting';
            $.mobile.newChangePage("#page_policy",{ transition: "slide",reverse: false,changeHash: false});
        });

    $("#setting").on( "pagecreate", function() {
        $( "body > [data-role='panel']" ).panel();
        $( "body > [data-role='panel'] [data-role='listview']" ).listview();
    });


    //changePassword页面 设置内容高度是Header剩下的高度
    $("#setting").on( "pageshow", function( event ) {
        window.setBodyOverflow($(document.body));
        $('#setting_content').css('height',($(window).height()-44-20));
        $('#setting_ul').css('min-height', ($(window).height()-61-4));
		// window.historyView = [];
        // Nick added for pull to refresh start
        window.shouldPageRefresh.newsroom = true;
        // Nick added for pull to refresh end
        if(q['user'] && q['user'].isAdmin == 'Y'){
            $('#btn_setting_changePWById').show();
        }else if(q['user'] && q['user'].isAdmin == 'N'){
            $('#btn_setting_changePWById').hide();
        }
    });

    // Nick added for pull to refresh start
    function cleanUpListItems() {
        $("#newsroom_listview_news").empty();
        $("#activities_listview_news").empty();
        $("#video_listview_comments").empty();
        $("#hsbc_listview_videos").empty();
        $("#talentShow_listview_news").empty();
    }
    // Nick added for pull to refresh end

    function compatibility() {
        /* Logon */
        $('#title_settings').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_settings').css('postion', 'absulute')
            .css('width', '65px')
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
