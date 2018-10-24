
define(['jquery', 'jquerymobile', 'dialogs','net'], function($, m, dia,net){
    'use strict';

    $('#me_code').off('click').on('click',function(){
        $('.loadingMe').show();//弹出层显示
        $('.loadingCode').show();//qrCode显示
        $('.loadingHead').show();//头像显示
    });

    function qr_show(){
        var postData = {};
        postData['userId'] = "8C947AEFEDDDFA44810335D1AE9D6DD2";
        net.post('myCorner/getMyQRcode',postData,function(error){

        },function(response){
           if(response.code != 0){
               $('#myPhoto .me_photo').addClass('mePhoto');//添加默认图片
               dia.alert('Confirmation',response.msg,['OK'],function(title){

               });
           }else{
               var myCode = response.data.myQRcode;
               var photo = myCode.photo;//照片
               var eName = myCode.english_name;//英文名
               var cName = myCode.chinese_name;//中文名
               var qrCode = myCode.qrcode;//qrCode
               var branch = myCode.branch;
               if(branch == null || branch == ""){
                   $('#me_branch').hide();
               }else{
                   $('#me_branch').show();
               }
               if(cName == "" || cName == null){
                   $('.qr_name').text("中文名");
               }else{
                   $('.qr_name').text(cName);
               }
               if(photo == "" || photo == null){
                   $('#myPhoto .me_photo').addClass('mePhoto');
                   $('.loadingHead').html('<div class="photo_icon"></div>');
               }else{
                   $('#myPhoto .me_photo').html('<img src="'+photo+'" style="width:50px;height:50px;">');
                   $('.loadingHead').html('<img src="'+photo+'" style="width:80px;height:80px;border-radius: 50%;">');
               }
               $('#me_Name').text(eName);
               $('.qr_ename').text(eName);
               $('#me_branch').text(branch);
               $('.qr_code').html('<img src="'+qrCode+'" style="width:210px;height:210px;">');


               //关闭qrCode
               $('#qr_delete').off('click').on('click',function(){
                   $('.loadingMe').hide();//弹出层隐藏
                   $('.loadingCode').hide();//qrCode隐藏
                   $('.loadingHead').hide();//头像隐藏
               });
           }
        });
    }

    function showNum(){
        var postData = {};
        postData['userId'] = "8C947AEFEDDDFA44810335D1AE9D6DD2";
        net.post('myCorner/getCountById',postData,function (error) {

        },function (response) {
            if(response.code != 0){

            }else{
                var reg_num = response.data.activityCount;
                var upload_num = response.data.myUploadCount;
                $('#myLoads .upload_num').text(upload_num);
                $('#myRegistered .register_num').text(reg_num);
            }
        })
    }


    $('#myCornerHome').on('pagebeforeshow', function(e){
        showNum();
        qr_show();

        window.historyView = [];
        $('#news_footer li.me').siblings('li').removeClass('on').end().addClass('on');
    });

    $('#myCornerHome').on('pageshow', function(e){
        $('#news_footer').show();

    });

    $("#myCornerHome").on( "pagehide", function( event ) {
        $('#news_footer').hide();
    });

    //跳转profile页面
    //$('#myCornerHome .about-me').off('click').on('click',function () {
    //    $('#profile').attr('js-pagefrom', 'myCornerHome');
    //
    //    $.mobile.newChangePage("#profile",{ transition: "slide",reverse: false,changeHash: false});
    //});
    //
    ////跳转profile页面
    //$('.settings').off('click').on('click',function () {
    //    $.mobile.newChangePage("#setting",{ transition: "slide",reverse: false,changeHash: false});
    //});
    //
    ////跳转comments页面
    //$('#my_Comments').off('click').on('click',function(){
    //    $.mobile.newChangePage("#myComments",{ transition: "slide",reverse: false,changeHash: false});
    //});
    ////跳转orders页面
    //$('#myGroupon').off('click').on('click',function(){
    //    $.mobile.newChangePage("#myOrders",{ transition: "slide",reverse: false,changeHash: false});
    //});
    //
    ////跳转integral页面
    //$('#myIntegral').off('click').on('click',function(){
    //    $.mobile.newChangePage("#integral_page",{ transition: "slide",reverse: false,changeHash: false});
    //});
    //
    ////跳转jobs I like页面
    //$('#my-like-job').off('click').on('click',function(){
    //    $.mobile.newChangePage("#jobs-like-page",{ transition: "slide",reverse: false,changeHash: false});
    //});
    //
    ////跳转myFavorates页面
    //$('#myFavorates').off('click').on('click',function(){
    //    $("#title_cornerall").html("My favorates");
    //    $("#title_type").html("ALL ARTICLES I LIKED");
    //    $('.back_menu').show();
    //    $(".cornerallheadcolor").removeClass("regbgcolor surveybgcolor").addClass("likebgcolor");
    //    $.mobile.newChangePage("#mycornerallarticle",{ transition: "slide",reverse: false,changeHash: false});
    //});

    //跳转mycorner页面
    $('#myRegistered').off('click').on('click',function(){
        $('#mycorner_upload').hide();
        $.mobile.newChangePage("#mycorner",{ transition: "slide",reverse: false,changeHash: false});
    });

    //跳转myLoads页面
    //$('#myLoads').off('click').on('click',function(){
    //    var url = $(this).attr("url");
    //    $("#mycorner_upload_content").removeClass("showuploadcatlog") ;
    //    $("#mycorner_upload_content").slideUp(500);
    //    $('#mycorner_upload').show();
    //    $('.check_code_upload').hide();
    //    $.mobile.newChangePage(url,{ transition: "slide",reverse: false,changeHash: false});
    //});

    var $page = $('#myCornerHome'),
        lastTapTimestamp = new Date().getTime();

    $page.find('.about-me-qr-code').on('tap', function(e){console.log(e);
        var nowTimestamp = new Date().getTime();
        if(nowTimestamp - lastTapTimestamp <= 400){
            lastTapTimestamp = nowTimestamp;
            return false;
        }

        $page.find('.ui-header, .ui-content').removeClass('bg-frosted-glass');
        $(this).stop().fadeOut(200);
    });

    return {
        showQrCode:function(){
            qr_show();
        },
        showNum:function(){
          showNum();
        }
    }
});
