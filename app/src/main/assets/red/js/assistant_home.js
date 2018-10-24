define(['jquery', 'jquerymobile', 'club','net', 'md5','dialogs','line','shop'], function($, m,club,net, md5, dia,line,shop) {

    // Redaholic
    $('#blank_menu').off('click').on('click',function(){
        window.shouldPageRefresh.clubActivity = true;
        $.mobile.newChangePage("#blank",{ transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
    });

    $('#card_menu').off('click').on('click',function(){
        window.shouldPageRefresh.clubActivity = true;
        $.mobile.newChangePage("#card",{ transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
    });

    // 进入club页面
    $("#club_menu").off('click').on('click',function(){
        alert("你点击了club-menu")
        //window.shouldPageRefresh.clubActivity = true;
        //$.mobile.newChangePage("#club",{ transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
    });
    // 进入community页面
    $("#community-menu").off('click').on('click',function(){
        alert("你点击了community-menu")
        //window.shouldPageRefresh.clubActivity = true;
        //var pageData = {
        //    "code":1,
        //    "title":"Community"
        //}
        //$('#news_footer').hide();
        //if(club.iScrollRefresh.myScroll === null){
        //    club.iScrollRefresh.loaded('club_content_wrapper');
        //}
        //club.getAllActiveTypesCallback(pageData);
    });

    //进入job post页面
    $("#job-menu").off("click").on("click",function() {
        alert("你点击了job-menu")
        //$(".job-navbar ul li").first().tap();
        //$.mobile.newChangePage("#jobPost",{ transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
    })

    // 进入ca页面
    $("#ca_menu").off('click').on('click',function(){
        alert("你点击了ca-menu")
        //$.mobile.newChangePage("#ca",{ transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
    });

    // 进入book页面
    $("#book_menu").off('click').on('click',function(){
        alert("你点击了book")

        //var title_html = $("#title_book").html();
        //if(title_html == "My favorites"){
        //    $("#title_book").html("Book²");
        //    window.shouldPageRefresh.book = true;
        //}
        //$.mobile.newChangePage("#book",{ transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
    });

    // 进入canteen页面
    $("#canteen_menu").off('click').on('click',function(){
        alert("你点击了canteen")
        //$.mobile.newChangePage("#canteen",{ transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
    });

    // 进入hotlines页面
    $("#hotline_menu").off('click').on('click',function(){
        alert("你点击了hotline-menu")
        //$.mobile.newChangePage("#hotlines",{ transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
    });

    // 进入global-lines页面
    $("#global_menu").off('click').on('click',function(){
        alert("你点击了global-menu")
        //line.showLines();
        //$('#lines').addClass('frompage');
        //setTimeout(function(){
        //    $.mobile.newChangePage("#lines",{ transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
        //},300);
    });
    $("#game-menu").off("click").on("click",function(){
        alert("你点击了game-menu")
        //var menuId = $('.ui-page-active').attr('id');
        //if(menuId == "voting"){
        //    resetVoting();
        //}
        ////Green Laisee entrance
        //var cuser = null;
        //if (localStorage.getItem('login_user')!=null) {
        //    cuser = JSON.parse(localStorage.getItem('login_user'));
        //} else {
        //    console.assert(false, '还没登录，没有用户信息可填写');
        //}
        //cordova.exec(function(){console.error("success")}, function(){console.error("error")}, "OpenGreenLaisee", "openGreenLaisee", [JSON.stringify({"account": ""+cuser.staffId+"", "fullName": ""+cuser.english_name+"", "secureToken": "", "location": ""+cuser.branch+"", "company": "HSBC"})]);
    })
 /*   // 进入helpDesk页面
    $("#help_menu").off('click').on('click',function(){
        $.mobile.newChangePage("#artificial_page",{ transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
    });*/

    // 进入页面
    $("#shop_menu").off('touchend').on('touchend',function(event){
        alert("你点击了shop-menu")
        //$.mobile.newChangePage("#ShopHome",{ transition: "slide",reverse: false,changeHash: false});
        //event.preventDefault();
    });


    ////e-invoice根据是否是第一次登陆弹出不同页面
    //function eInvoiceFlag(callbackSuccess){
    //    chrome.storage.internal.get({"firstLogonFlag":''}, function(item){
    //        var firstLogonFlag = '';
    //        if(item.firstLogonFlag == null ||
    //                item.firstLogonFlag == undefined ||
    //                    item.firstLogonFlag == ''){
    //            firstLogonFlag = 'Y';
    //        } else if(item.firstLogonFlag == 'Y'){
    //            firstLogonFlag = 'N';
    //        }
    //
    //        if(firstLogonFlag == 'Y' || firstLogonFlag == 'N'){
    //            chrome.storage.internal.set({'firstLogonFlag': firstLogonFlag}, function(data){
    //                if(data==0){
    //                    console.log("Set firstLogonFlag success!");
    //                    callbackSuccess();
    //                    }
    //                });
    //        } else {
    //            callbackSuccess();
    //        }
    //    });
    //}
    //
    $("#eInvoice_menu").off('click').on('click', function(){
        alert("你点击了eInvoice")
        //var callbackSuccess = function(){
        //    chrome.storage.internal.get({"firstLogonFlag":''}, function(data){
        //        if(data.firstLogonFlag == 'Y'){
        //            $.mobile.newChangePage("#eInvoice_instruction",{transition: "slide", reverse: false, changeHash: false});
        //        } else {
        //            $.mobile.newChangePage("#eInvoice",{transition: "slide", reverse: false, changeHash: false});
        //        }
        //    });
        //};
        //eInvoiceFlag(callbackSuccess);

    });

    $("#assistantHome").off('pagebeforeshow').on( "pagebeforeshow", function( event ) {
        $(".loadingShow").hide();
        $('#news_footer li').removeClass('on').eq(1).addClass('on');
        //加载"语音红包"游戏时间
        $("body").append("<script src='http://reddownload.oss-cn-shenzhen.aliyuncs.com/UAT/red/v4.2/voice-switch.js'></script>");
        //加载"摇一摇"游戏时间
        $("body").append("<script src='http://reddownload.oss-cn-shenzhen.aliyuncs.com/UAT/red/v4.2/laisee-switch.js'></script>");
    });

    //设置内容高度是Header剩下的高度
    $("#assistantHome").off('pageshow')
        .on( "pageshow", function( event ) {
            window.setBodyOverflow($(document.body));
            $('#assistant_content').css('height',($(window).height()-44-20));
            // $('#registration_term_content_info').css('min-height',($(window).height()-44-20));
            $('#news_footer').show();
            // 兼容其他浏览器
            compatibility();
            window.historyView = [];
        });

    // $("#assistantHome").on( "pagehide", function( event ) {
    //     $('#news_footer').hide();
    // });

    function compatibility() {
        /* Logon */
        $('#title_assistant_home').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_assistant_home').css('postion', 'absulute')
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
