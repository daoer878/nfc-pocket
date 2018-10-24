/**
 * Created by yk on 15/7/1.
 */
require(['jquery', 'jquerymobile', 'net', 'dialogs','newsroom','videoDetailed'], function($, m, net, dia,newsroom, videodetail) {
  /**
*初始设置 jquerymobile转场为none
*/
    $.mobile.defaultPageTransition = 'none';
    function cleanUpListItems() {
        $("#newsroom_listview_news").empty();
    }
    function initPageLoad(wrapper) {
        var $wrapper = $("#" + wrapper),
            $pullDownEl = $wrapper.find("#pullDown"),
            $pullDownLabel = $pullDownEl.find(".pullDownLabel");
        if ($wrapper.find("ul").html()) {
            $wrapper.find(".scroller").css(window.getVendorStyle("transform"), "translate(0, 0)");
            $pullDownEl.attr("class", "loading");
            $pullDownLabel.text("Loading...");
        }
    }
    function  resetVoting(){
        $('#voting_content .sel').removeClass('sel');
        $('#voting_content .selRadio').removeClass('selRadio');
        $('#voting_content .warningText').hide();
        $('#voting_intro').css('display', 'block');
        $('#voting_individuals').css('display', 'none');
        $('#voting_team').css('display', 'none');
        $('#voting_end').css('display', 'none');
    }

    var panel_QrcodeScan = function(menuId){
        cordova.exec(function(){cordova.logger.debug("success");}, function(){cordova.logger.debug("error");}, "ShowVideoPlaybackView", "showVideoPlaybackView", []);
        cordova.exec(function(content){
            net.post('activity/getActivity', {
                'content': content,
                userId:"8C947AEFEDDDFA44810335D1AE9D6DD2"
            }, function(error){
                // $(".loadingDiv").addClass("dismiss").removeClass("qrcodepage");
                $(".loadingDiv").removeClass("qrcodepage");
                dia.alert('Oops', response.msg, ['OK'], function(title) {
                    var  menuId_c = $('.ui-page-active').attr('id');
                    return panel_QrcodeScan(menuId_c);
                });
            }, function(response){
                if (response.code != 0) {
                    // $(".loadingDiv").addClass("dismiss").removeClass("qrcodepage");
                    $(".loadingDiv").removeClass("qrcodepage");
                    dia.alert('Oops', response.msg, ['OK'], function(title) {
                        var  menuId_c = $('.ui-page-active').attr('id');
                        return panel_QrcodeScan(menuId_c);
                    });
                }
                else{
                    var activityStatus = response.data.activity.status;
                    if(activityStatus === 1 || activityStatus === 0 || activityStatus === -1){
                        dia.alert('Oops', 'There was an error in the activity you scanned', ['OK'], function(title) {
                            if(title === 'OK'){
                                $('.loadingDiv.qrcodepage').hide();
                                $.mobile.backChangePage("#newsroom", { transition: "slide", reverse: true, changeHash:false});
                            }
                        });
                    }else{
                        var activityInfo = response.data.activity;
                        activityInfo.menuId = menuId;
                        $('#video_detailed_listview').empty();
                        $('#video_listview_comments').empty();
                        videodetail.from('#QrcodeScan');
                        activityInfo.pageId = "activities";
                        videodetail.showDetailWithNew(activityInfo);
                        videodetail.showCommentsContent();
                        $.mobile.newChangePage("#video_detailed",{ transition: "none",reverse: false,changeHash: false});
                    }
                }
            },{async:false});
        }, function(){
            // $(".loadingDiv").addClass("dismiss").removeClass("qrcodepage");
            $(".loadingDiv").removeClass("qrcodepage");
        }, "ShowVideoPlaybackView", "showVideoPlaybackViewAndReceiveScan", []);
        $(".loadingDiv").addClass("qrcodepage");
    };
    // 点击菜单按钮出现菜单
    $('.panle_btn_menu').on('click', function(evt) {
        $("#inputval").blur();
        $("#inputval_ol").blur();
        setTimeout(function(){
            $('#panel_menu_extend').show();
            $('.ui-panel-inner').css({'padding':'0px'});
            $('.panel_nees_opacity').css('min-height',$(window).height());
            $('#news_content').css('max-height',$(window).height()-44);
            $('#panel_menu_extend').css('min-height',$(window).height());
            $('#panel_ul').css('max-height',$(window).height()-52-82);
            if($(window).height()-52-82 > ($("#panel_ul").attr("panle_menu_size"))*52){
                $('#panel_auto_height').css('min-height',$(window).height()-52-82-($("#panel_ul").attr("panle_menu_size"))*52);
                $('#panel_auto_height').show();
            }
            else{
                $('#panel_auto_height').hide();
            }
            var username = localStorage['username'] + '!';
            $("#panel_username").html(username);
            $(".loadingDiv").addClass("dismiss");
            $( "#panel_menu_extend" ).panel( "open" );
            $( "#panel_menu_extend" ).removeClass();
            $(".ui-panel-dismiss").remove();

            $(".loadingDiv.dismiss").on( "tap", function( event, ui ) {
                panelclose();

            });
        },300)

    });
    // 点击新闻项，菜单隐藏
    $('#panel_ul').off('click', '#panel_newsroom').on('click' , '#panel_newsroom' , function(evt) {
        var menuId = $('.ui-page-active').attr('id');
         if(menuId == "newsroom" && $("#newsroom").hasClass("newsroom")){
            panelclose();
        }
        else {
            if(menuId == "voting"){
                resetVoting();
            }
            $("#newsroom").removeClass("activities newsroom talentShow video").addClass("newsroom");
            getNewsroomData(menuId,'newsroom');
        }
    });
    //推出activities 页面
    $('#panel_ul').off('click', '#panel_activities').on('click' , '#panel_activities' , function(evt) {
        var menuId = $('.ui-page-active').attr('id');
        if(menuId == "newsroom" && $("#newsroom").hasClass("activities")){
            panelclose();
        }
        else{
            if(menuId == "voting"){
                resetVoting();
            }
            $("#newsroom").removeClass("activities newsroom talentShow video").addClass("activities");
            getNewsroomData(menuId,'activities');
        }
    });
    //点击HSBC NOW，菜单隐藏
    $('#panel_ul').off('click', '#panel_hsbcnow').on('click' , '#panel_hsbcnow' , function(evt) {
        var menuId = $('.ui-page-active').attr('id');
        if(menuId == "newsroom" && $("#newsroom").hasClass("video")){
            panelclose();
        }
        else{
            if(menuId == "voting"){
                resetVoting();
            }
            $("#newsroom").removeClass("activities newsroom talentShow video").addClass("video");
            getNewsroomData(menuId,'video');
        }
    });

    //推出hotline页面
    $('#panel_ul').off('click', '#panel_hotlines').on('click', '#panel_hotlines', function(evt){
        var menuId = $('.ui-page-active').attr('id');
        if(menuId == "hotlines"){
            panelclose();
        }
        else{
            cleanUpListItems();
            $.mobile.newChangePage("#hotlines",{transition: "slide", reverse: false, changeHash: false});
        }

    });
    // 点击Talent Show，菜单隐藏
    $('#panel_ul').off('click', '#panel_talentShow').on('click' , '#panel_talentShow' , function(evt) {
        var menuId = $('.ui-page-active').attr('id');
        if(menuId == "newsroom" && $("#newsroom").hasClass("talentShow")){
            panelclose();
        }
        else {
            if(menuId == "voting"){
                resetVoting();
            }
            $("#newsroom").removeClass("activities newsroom talentShow video").addClass("talentShow");
            getNewsroomData(menuId,'talentShow');
        }
    });
    //点击Discovery菜单项
    $('#newsroom_discovery').off('click').on('click',function(evt) {
        $('.entrance-content').hide();
        var menuId = $('.ui-page-active').attr('id');
        if(menuId == "voting"){
            resetVoting();
        }
        panel_QrcodeScan(menuId);
    });
    $('#panel_ul').off('click', '#panel_GSR').on('click' , '#panel_GSR' , function(evt) {
        var menuId = $('.ui-page-active').attr('id');
        if(menuId == "voting"){
            resetVoting();
        }
        cordova.exec(function(){cordova.logger.debug("success");}, function(){cordova.logger.debug("error");}, "BYODPlugIn", "showGSR", []);
    });

    //推出人脸识别页面
    $('#panel_ul').off('click', '#panel_faceRecog').on('click' , '#panel_faceRecog', function(evt) {
        var menuId = $('.ui-page-active').attr('id');
        if(menuId == "faceRecog"){
            panelclose();
        }
        else{
            cleanUpListItems();
            //window.shouldPageRefresh.book = true;
            $.mobile.newChangePage("#faceRecog",{ transition: "slide",reverse: false,changeHash: false});
        }
    });



    //推出人脸识别页面
    $('#panel_ul').off('click', '#panel_faceRecog1').on('click' , '#panel_faceRecog1', function(evt) {
        CameraPlugin.takePicture(["verify"], function(s){
            var returnObj = JSON.parse(s);
            dia.alert('Confirmation',returnObj.data.detectResult.returnMsg,['OK'],function(title) {

            });
        }, function(error){
        });

//        var menuId = $('.ui-page-active').attr('id');
//        if(menuId == "faceRecog"){
//            panelclose();
//        }
//        else{
//            cleanUpListItems();
//            //window.shouldPageRefresh.book = true;
//            $.mobile.newChangePage("#faceRecog",{ transition: "slide",reverse: false,changeHash: false});
//        }
    });


    //推出人脸识别页面
    $('#panel_ul').off('click', '#panel_faceRecog2').on('click' , '#panel_faceRecog2', function(evt) {
        var menuId = $('.ui-page-active').attr('id');
        if(menuId == "faceRecog1"){
            panelclose();
        }
        else{
            cleanUpListItems();
            //window.shouldPageRefresh.book = true;
            $.mobile.newChangePage("#faceRecog1",{ transition: "slide",reverse: false,changeHash: false});
        }
    });

    $('#panel_ul').off('click', '#panel_Laisee').on('click' , '#panel_Laisee' , function(evt) {
        var menuId = $('.ui-page-active').attr('id');
        if(menuId == "voting"){
            resetVoting();
        }
        //Green Laisee entrance
        var cuser = null;
        if (localStorage.getItem('login_user')!=null) {
            cuser = JSON.parse(localStorage.getItem('login_user'));
        } else {
            console.assert(false, '还没登录，没有用户信息可填写');
        }
        cordova.exec(function(){console.error("success")}, function(){console.error("error")}, "OpenGreenLaisee", "openGreenLaisee", [JSON.stringify({"account": ""+cuser.staffId+"", "fullName": ""+cuser.english_name+"", "secureToken": "", "location": ""+cuser.branch+"", "company": "HSBC"})]);
    });

    // // 点击注销，返回登录
    // $('#panel_menu_extend').off('click', '#panel_logOff').on('click' , '#panel_logOff' , function(evt) {
    //     var menuId = $('.ui-page-active').attr('id');
    //     if(menuId == "voting"){
    //         resetVoting();
    //     }
    //     $.mobile.newChangePage('#logon',{transition: "slide",reverse: true,changeHash: false});
    //     chrome.storage.internal.remove('password', function(){});
    //     //注销用户后复选框清空
    //     if(menuId == "filter"){
    //         $('#all_check').removeClass('nor').addClass('sel');
    //         $('div[name="sbox"]', $('#filter')).each(function(index, val) {
    //             $(val).removeClass('nor').addClass('sel');
    //         });
    //     }
    //     else if(menuId == "voting"){
    //         $('#all_check').removeClass('sel').addClass('nor');
    //         $('div[name="sbox"]').each(function(index, val) {
    //             $(val).removeClass('sel').addClass('nor');
    //         });
    //     }
    //     else{
    //         $('.checklabel').removeClass('sel').addClass('nor');
    //         $('div[name="sbox"]').each(function(index, val) {
    //             $(val).removeClass('sel').addClass('nor');
    //         });
    //     }
    //     // Nick added for pull to refresh start
    //     cleanUpListItems();
    //     $(".wrapper").find("#pullUp").hide();
    //
    //     window.shouldPageRefresh.newsroom = true;
    //
    //     if($("ul#panel_ul li.panle_pushmenu").size()){
    //         $("ul#panel_ul li.panle_pushmenu").remove();
    //     }
    //     q['user'] = null;
    //     // Nick added for pull to refresh end
    // });

    // 点击注销，返回登录
    $(".setting_logOut").off('click').on('click',function(){
        var menuId = $('.ui-page-active').attr('id');
        if(menuId == "voting"){
            resetVoting();
        }
        $.mobile.newChangePage('#logon',{transition: "slide",reverse: true,changeHash: false});
        chrome.storage.internal.remove('password', function(){});
        // 清空newsroom的search data
        $('#newsroom_header_searchbar').val('');

        //注销用户后复选框清空
        if(menuId == "filter"){
            $('#all_check').removeClass('nor').addClass('sel');
            $('div[name="sbox"]', $('#filter')).each(function(index, val) {
                $(val).removeClass('nor').addClass('sel');
            });
        }
        else if(menuId == "voting"){
            $('#all_check').removeClass('sel').addClass('nor');
            $('div[name="sbox"]').each(function(index, val) {
                $(val).removeClass('sel').addClass('nor');
            });
        }
        else{
            $('.checklabel').removeClass('sel').addClass('nor');
            $('div[name="sbox"]').each(function(index, val) {
                $(val).removeClass('sel').addClass('nor');
            });
        }
        // Nick added for pull to refresh start
        cleanUpListItems();
        $(".wrapper").find("#pullUp").hide();

        window.shouldPageRefresh.newsroom = true;

        if($("ul#panel_ul li.panle_pushmenu").size()){
            $("ul#panel_ul li.panle_pushmenu").remove();
        }
        q['user'] = null;
        // Nick added for pull to refresh end

        //移除登录用户的头像
        $('#myPhoto .me_photo').html("");
        $('#myPhoto .me_photo').removeClass('mePhoto');
        $('#me_Name').html("");
        $('#me_branch').html("");
        $('.qr_name').html("");//清理中文名
        $('.pro_name').html("");//清理My profile页面中文名
        $('.qr_ename').html("");//清理中文名
        $('.pro_Yname').html("");//清理My profile页面英文名

        //移除My profile页面的照片
        $('#profile_photo .me_photo').html("");
        $('#profile_photo .me_photo').removeClass('mePhoto');
    });

    //推出setting页面
    // $('#panel_ul').off('click', '#panel_settings').on('click' , '#panel_settings' , function(evt) {
    //     var menuId = $('.ui-page-active').attr('id');
    //     if(menuId == "setting"){
    //         panelclose();
    //     }
    //     else{
    //         if(menuId == "voting"){
    //             resetVoting();
    //         }
    //         cleanUpListItems();
    //         $.mobile.newChangePage("#setting",{ transition: "slide",reverse: false,changeHash: false});
    //     }
    // });
    $('.settings').on('click' , function(evt) {
        var menuId = $('.ui-page-active').attr('id');
        if(menuId == "setting"){
            panelclose();
        }
        else{
            if(menuId == "voting"){
                resetVoting();
            }
            cleanUpListItems();
            $.mobile.newChangePage("#setting",{ transition: "slide",reverse: false,changeHash: false});
        }
    });
    //推出Myorner页面
    $('#panel_ul').off('click', '#panel_mycorner').on('click' , '#panel_mycorner', function(evt) {
        var menuId = $('.ui-page-active').attr('id');
        if(menuId == "mycorner"){
            panelclose();
        }
        else{
            cleanUpListItems();
            $.mobile.newChangePage("#mycorner",{ transition: "slide",reverse: false,changeHash: false});
        }
    });
    //推出book页面
    $('#panel_ul').off('click', '#panel_book').on('click' , '#panel_book', function(evt) {
        var menuId = $('.ui-page-active').attr('id');
        var title_html = $("#title_book").html();
        if(menuId == "book"){
            if(title_html == "My favorites"){
                $("#title_book").html("Book²");
                //20170929 add for otTab show
                $("#my-book-nav").removeClass('not_Visible').addClass('is_Visible');
                cleanUpListItems();
                window.shouldPageRefresh.book = true;
                $.mobile.newChangePage("#book",{ transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
            }
            panelclose();
        }
        else{
            if(title_html == "My favorites"){
                $("#title_book").html("Book²");
            }
            //panelclose();
            cleanUpListItems();
            window.shouldPageRefresh.book = true;
            $.mobile.newChangePage("#book",{ transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
        }
    });
    $('#panel_ul').off('click', '#panel_voting').on('click' , '#panel_voting', function(evt) {
        var menuId = $('.ui-page-active').attr('id');
        if(menuId == "voting"){
            panelclose();
        } else{
            if(menuId == "voting"){
                resetVoting();
            }
            cleanUpListItems();
            $.mobile.newChangePage("#voting",{ transition: "slide",reverse: false,changeHash: false});
        }
    });
    //点击CA菜单，进入CA主页面
    $('#panel_ul').off('click', '#panel_ca').on('click' , '#panel_ca', function(evt) {
        var menuId = $('.ui-page-active').attr('id');
        if(menuId == "ca"){
            panelclose();
        }
        else{
            cleanUpListItems();
            $.mobile.newChangePage("#ca",{ transition: "slide",reverse: false,changeHash: false});
            var postData = {};
            postData['userId'] = q['user'].userId;
            net.post('ca/hasCaRegData',postData,function(error){

            },function(response){
                if (response.code != 0) {
                }
                else{
                    var dataInfo = response.data.Info;
                    if(dataInfo == true){
                        $("#team_records").css("display","block");
                    }else{
                        $("#team_records").css("display","none");
                    }

                }
            });
        }
    });
    //推出Canteen页面
    $('#panel_ul').off('click', '#panel_canteen').on('click' , '#panel_canteen', function(evt) {
        var menuId = $('.ui-page-active').attr('id');
        if(menuId == "canteen"){
            panelclose();
        }
        else{
            cleanUpListItems();
            $.mobile.newChangePage("#canteen",{ transition: "slide",reverse: false,changeHash: false});
        }
    });

    //推出line页面
    $('#panel_ul').off('click', '#panel_line').on('click', '#panel_line', function(evt){
        var menuId = $('.ui-page-active').attr('id');
        if(menuId == "lines"){
            panelclose();
        }
        else{
            cleanUpListItems();
            $.mobile.newChangePage("#lines",{transition: "slide", reverse: false, changeHash: false});
        }
    });

    //推出line页面
    $('#panel_ul').off('click', '#panel_clubs').on('click', '#panel_clubs', function(evt){
        var menuId = $('.ui-page-active').attr('id');
        if(menuId == "clubs"){
            panelclose();
        }
        else{
            cleanUpListItems();
            $.mobile.newChangePage("#clubs",{transition: "slide", reverse: false, changeHash: false});
        }
    });

    function getNewsroomData(menuId,pageId){
        $("#newsroom").attr("pageId",pageId);
        cleanUpListItems();
        initPageLoad("news_wrapper");
        window.shouldPageRefresh.newsroom = true;
        if(menuId != "newsroom"){
            $.mobile.newChangePage("#newsroom", { transition: "slide", reverse: false, changeHash: false});
        }
        else{
            //newsroom.templateNews();
            panelclose();
        }
        newsroom.templateNews();
    }

    function panelclose(){
         $( "#panel_menu_extend" ).addClass("ui-panel ui-panel-position-left ui-panel-display-overlay ui-body-inherit ui-panel-animate ui-panel-open");
         setTimeout(function(){
             $( "#panel_menu_extend" ).panel( "close" );
         },500);
    }

    // $("#corner_content,#lines-content,#news_content,#setting_content,#voting_content,#filter_content,#activities_content,#activity_filter_content,#video_content,#talentShow_content,#book_content,#book_check_content,#ca_content,#registration_confirm_content").on("swiperight",function(){
    //     $('#panel_menu_extend').show();
    //     $('.ui-panel-inner').css({'padding':'0px'});
    //     $('.panel_nees_opacity').css('min-height',$(window).height());
    //     $('#news_content').css('max-height',$(window).height()-44);
    //     $('#panel_menu_extend').css('min-height',$(window).height());
    //     $('#panel_ul').css('max-height',$(window).height()-52-82);
    //     if($(window).height()-52-82 > ($("#panel_ul").attr("panle_menu_size"))*52){
    //         $('#panel_auto_height').css('min-height',$(window).height()-52-82-($("#panel_ul").attr("panle_menu_size"))*52);
    //         $('#panel_auto_height').show();
    //     }
    //     else{
    //         $('#panel_auto_height').hide();
    //     }
    //     var username = localStorage['username'] + '!';
    //     $("#panel_username").html(username);
    //     $(".loadingDiv").addClass("dismiss");
    //     $( "#panel_menu_extend" ).panel( "open" );
    //     $( "#panel_menu_extend" ).removeClass();
    //     $(".ui-panel-dismiss").remove();
    //
    //     $(".loadingDiv.dismiss").on( "tap", function( event, ui ) {
    //
    //         panelclose();
    //
    //     });
    // });
    // $("#panel_menu_extend").on("swipeleft",function(){
    //         panelclose();
    //
    // });

    $("#panel_menu_extend").on( "panelclose", function( event, ui ) {
        $(".loadingDiv").removeClass("dismiss");
        $( "#panel_menu_extend" ).hide();
        $( "#panel_menu_extend" ).addClass("ui-panel ui-panel-position-left ui-panel-display-overlay ui-panel-closed ui-body-inherit ui-panel-animate");

    });

    // $('#news_footer > div').unbind('click').on('click', function(e){
    //     var index = $(this).index();
    //     console.log(index);
    //     if(index === 0){
    //         $('.new_footer i').removeClass('news_sel').addClass('news_kel');
    //         $('.assistant_footer i').removeClass('assistant_kel').addClass('assistant_sel');
    //         $('.me_footer i').removeClass('me_kel').addClass('me_sel');
    //         $('.new_footer').css("color","#f26647");//1chengse
    //         $('.assistant_footer').css("color","black");//2 huise
    //         $('.me_footer').css("color","black");//3
    //            $.mobile.newChangePage("#newsroom",{ transition: "slide",reverse: false,changeHash: false});
    //     } else if(index === 1){
    //         $('.assistant_footer i').removeClass('assistant_sel').addClass('assistant_kel');
    //         $('.new_footer i').removeClass('news_kel').addClass('news_sel');
    //         $('.me_footer i').removeClass('me_kel').addClass('me_sel');
    //         $('.new_footer').css("color","black");
    //         $('.assistant_footer').css("color","#f26647");
    //         $('.me_footer').css("color","black");
    //         $.mobile.newChangePage("#assistantHome",{ transition: "slide",reverse: false,changeHash: false});
    //     } else if(index === 2){
    //         $('.me_footer i').removeClass('me_sel').addClass('me_kel');
        //         $('.new_footer i').removeClass('news_kel').addClass('news_sel');
    //         $('.assistant_footer i').removeClass('assistant_kel').addClass('assistant_sel');
    //         $('.new_footer').css("color","black");
    //         $('.assistant_footer').css("color","black");
    //         $('.me_footer').css("color","#f26647");
    //         $.mobile.newChangePage("#myCornerHome",{ transition: "slide",reverse: false,changeHash: false});
    //     } else {
    //         console.error('菜单不存在');
    //     }
    // });

      /*$("#news_footer >  div").unbind("click").on("click",function(){
      $(this).find("i").removeClass("act").addClass("disact")
       .parent().parent().siblings().find("i")
       .removeClass("disact")
       .addClass("act");

          $(this).find("p").addClass("orange");
          $(this).siblings().find("p").removeClass("orange");


     });


     $(".bar1").on("click",function(){
        //  $("#newsroom").css("display","block"); //2017/05/19
        //  $("#newsroom").css("background-image","url('images/image/red_bg_summer15_@3X.jpg')");
        $.mobile.newChangePage("#newsroom",{ transition: "none",reverse: false,changeHash: false});
     });

     $(".bar2").on("click",function(){
        //   $("#newsroom").css("display","none");
        //  $("#newsroom").css("background-image","none");
        //  $("#assistantHome").css("background-image","none");
      $.mobile.newChangePage("#assistantHome",{ transition: "none",reverse: false,changeHash: false});
     });
     $(".bar3").on("click",function(){
        $.mobile.newChangePage("#myCornerHome",{ transition: "none",reverse: false,changeHash: false});
     });*/

    $('#news_footer').off('tap').on('tap', 'li', function(event){
        event.stopPropagation();
        var navIndex = $(this).index();
        $(this).siblings('li').removeClass('on').end().addClass('on');
        switch (navIndex){
            case 0:
                $.mobile.newChangePage("#newsroom",{ transition: "none",reverse: false,changeHash: false});
                break;
            case 1:
                $.mobile.newChangePage("#assistantHome",{ transition: "none",reverse: false,changeHash: false});
                break;
            case 2:
                $.mobile.newChangePage("#myCornerHome",{ transition: "none",reverse: false,changeHash: false});
                break;
            default:
                break;
        }
    });

    /*2017/05/16===================================================> begin */

    /*2017/05/16===================================================> end */

    $('#book_btn_menu,#book-back,#canteen_btn_menu,#canteen-back,#ca_btn_menu,#ca-back,#hotline_btn_menu,#hotline-back,#lines_btn_menu,#lines-back,#clubs-menu,#clubs-back,#eInvoice_btn_menu').off('click').on('click',function(){
        // $('#lines-moom').removeClass('global_ol').addClass('menu');
        var targetId = $(this).attr('id');
        if(targetId == 'lines-back' || targetId == 'lines_btn_menu'){
            $('#lines').removeClass('lines_list');
            if($('#lines-moom').hasClass('global_ol')){
                $('#lines-moom').click();
                return false;
            }
            if($('#lines_header_searchbar_form').is(':visible')){
                $('#lines_cancel').click();
                return false;
            }
        }
        if(targetId == 'book-back' || targetId == 'book_btn_menu'){
            if($('#category_content').is(':visible')){
                $('#book_ingory').click();
                return false;
            }
            if($("#borrowbook_ul").is(':visible')){
                $("#bookshow_ul,#book_search,#book_category,#search_area").show();
                $('#title_book').html("Book²");
                $("#borrowbook_ul").hide();
                //20170929 更改
                $("#my-book-nav").removeClass('not_Visible');
                //$('#book_content').css('top',155);
                $('#book_content').css('top',105);
                $('#book_category').show();
                return false;
            }
            if($('#search_ol').is(':visible')){
                $('#search_content .cancel_ol').click();
                return false;
            }
            if($('#sort_content_opacity').is(':visible')){
                $('#sort_list .sort_cancel').click();
                return false;
            }
        }
        $('#main').hide();
        window.shouldPageRefresh.book = true;
        $.mobile.newChangePage("#assistantHome",{ transition: "slide",reverse: true,changeHash: false,allowSamePageTransition:true});
    });
    $('#setting_btn_menu,#setting-back,#comments-menu,#comments-back').off('click').on('click',function(){

        $.mobile.newChangePage("#myCornerHome",{ transition: "slide",reverse: true,changeHash: false,allowSamePageTransition:true});
    })
});
