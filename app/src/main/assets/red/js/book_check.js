/**
 * Created by testbetta1 on 15/9/29.
 */

define(['jquery', 'jquerymobile', 'net', 'dialogs','panle'], function($, m, net, dia, panle) {
    var bookcheckInfo = [];
    //创建书的详情
    function converState(state){
        if(state == 1){
            return "Reserved" ;
        }
        else if(state == 2){
            return "Checked out" ;
        }
        else if(state == 3){
            return "Renewed" ;
        }
        else if(state == 4){
            return "Overdue" ;
        }
        else if(state == 5){
            return "Checked in" ;
        }
        else if(state == 6){
            return "Reservation cancelled" ;
        }
    }

    function getMonthString(month) {
        month = month + 1;
        if (month == 1)
            return 'Jan';
        else if (month == 2)
            return 'Feb';
        else if (month == 3)
            return 'Mar';
        else if (month == 4)
            return 'Apr';
        else if (month == 5)
            return 'May';
        else if (month == 6)
            return 'June';
        else if (month == 7)
            return 'July';
        else if (month == 8)
            return 'Aug';
        else if (month == 9)
            return 'Sept';
        else if (month == 10)
            return 'Oct';
        else if (month == 11)
            return 'Nov';
        else if (month == 12)
            return 'Dec';
        else {
            console.assert(false, '月份 %o 不存在 ', month );
        }
    }
    function createBookCheckDetailHtml(borrowData) {
        var bookInfo = borrowData.bookInfo;
        var bookimg = bookInfo.book_cover;//images/image/bg_masterbg_1x.jpg
        var bookname = bookInfo.book_Name;
        var author = bookInfo.book_Author;
        var state = borrowData.status;
        var borrower = borrowData.borrower;
        var staffId = borrowData.staffId;
        var boprrowDate = new Date(borrowData.boprrowDate * 1000);
        var pickupdate =new Date(borrowData.pickupdate * 1000);
        var dueDate = new Date(borrowData.dueDate * 1000);

        var boprrowMonth = getMonthString(boprrowDate.getMonth());
        var boprrowtime = boprrowMonth +" "+ boprrowDate.getDate() + ", " + boprrowDate.getFullYear() ;

        var pickupMonth = getMonthString(pickupdate.getMonth());
        var pickuptime = pickupMonth +" "+ pickupdate.getDate() + ", " + pickupdate.getFullYear() ;

        var dueMonth = getMonthString(dueDate.getMonth());
        var duetime = dueMonth +" "+ dueDate.getDate() + ", " + dueDate.getFullYear() ;

        var serialNo = bookInfo.book_mgrNo;
        var statename= converState(state);
        var checkbtn="";
        var stateBtn =""
         if(state == 1 || (state == 4 && !(borrowData.boprrowDate))){
            stateBtn = '\<div style="margin-top: 20px; color: #404040; font-size: 14px;">Borrower</div>\
                <div style="margin-top: 5px; font-weight: bold; font-size: 14px; color: #404040;">'+borrower+'\</div><div style="margin-top: 20px; color: #404040; font-size: 14px;">Staff ID</div>\
                <div style="margin-top: 5px; font-weight: bold; font-size: 14px; color: #404040;">'+staffId+'\</div><div style="margin-top: 20px; color: #404040; font-size: 14px;">Pick up date</div>\
                <div style="margin-top: 5px; font-weight: bold; font-size: 14px; color: #404040;">'+pickuptime+'\</div>';
             checkbtn = '\<div style="text-align: center; margin: 20px 0; height: 36px; overflow: hidden;font-size:14px;" id="checkeara"><div style="float:left;width:42.5%;height: 36px;line-height: 36px;border: \
        1px solid #e6b012;color: #e6b012;margin:0 2.5% 0 5%;" id="btn_book_check_cancel">Cancel</div><div style="float: right;\
        width:42.5%;height: 36px;line-height: 36px;background: #e6b012;border:1px solid #e6b012;color: #fff;margin:0 5% 0 2.5%;" id="btn_book_checkout_request">Check Out</div></div>';

         }
        else if(state == 2 || state == 3 || (state == 4 && borrowData.boprrowDate)){
             stateBtn = '\<div style="margin-top: 20px; color: #404040; font-size: 14px;">Borrower</div>\
                <div style="margin-top: 5px; font-weight: bold; font-size: 14px; color: #404040;">'+borrower+'\</div><div style="margin-top: 20px; color: #404040; font-size: 14px;">Staff ID</div>\
                <div style="margin-top: 5px; font-weight: bold; font-size: 14px; color: #404040;">'+staffId+'\</div><div style="margin-top: 20px; color: #404040; font-size: 14px;">Check out date</div>\
                <div style="margin-top: 5px; font-weight: bold; font-size: 14px; color: #404040;">'+boprrowtime+'\</div><div style="margin-top: 20px; color: #404040; font-size: 14px;">Due date</div>\
                <div style="margin-top: 5px; font-weight: bold; font-size: 14px; color: #404040;">'+duetime+'\</div>';
             checkbtn = '\<div style="text-align: center; margin: 20px 0; height: 36px; overflow: hidden;font-size:14px;" id="checkeara"><div style="float:left;width:42.5%;height: 36px;line-height: 36px;border: \
        1px solid #e6b012;color: #e6b012;margin:0 2.5% 0 5%;" id="btn_book_check_cancel">Cancel</div><div style="float: right;\
        width:42.5%;height: 36px;line-height: 36px;background: #e6b012;border:1px solid #e6b012;color: #fff;margin:0 5% 0 2.5%;" id="btn_book_checkin_request">Check In</div></div>';
        }

        var html = '\<div style="margin: 20px 16px; padding:0px; overflow: hidden;"><div style="overflow:hidden;">\
            <div style="float: left;height: 120px; width: 92px; display: -webkit-flex;display:flex; -webkit-align-items:\
            center; -webkit-justify-content: center;"><img src="'+bookimg+'"\ style="max-width: 92px; max-height: 120px;"/>\
            </div><div style="margin: 0 0 0 108px; height:120px;display:-webkit-flex; display:flex;-webkit-align-items: center;"><div>\
            <div style="font-size: 12px; color: #404040;word-break: break-all;">'+bookname+'\</div>\
            <div style="color:#808080;font-size:10px;margin:7px 0 10px 0;"><div style="width: 50px;float: left;">Serial No:</div>\
            <div style="margin-left: 50px;">'+serialNo+'\</div></div>\
            <p style="margin: 0px; font-size: 12px; color: #fff; height:22px; line-height:22px; text-align: center; border-radius: 6px; padding: 0 7px;\
            " class="state '+statename.toLowerCase().split(" ").join("")+'">'+statename+'\</p></div></div>'+stateBtn+'\</div></div>'+checkbtn;
        return html;
    }

    /**
     * 展示书的详情信息
     * @param content
     */
    function getBookCheckDetail(bookData) {
        $("#book_check_listView").empty();
        var bookDetailHtml = createBookCheckDetailHtml(bookData);
        $("#book_check_listView").html(bookDetailHtml);
    };
    $('#book_check').off('click', '#btn_book_checkout_request').on('click', '#btn_book_checkout_request', function() {
        var postData = {};
        postData['userId'] = q['user'].userId;
        postData['userName'] = q['user'].userName;
        postData['bookId'] = bookcheckInfo.bookInfo.book_sn;
        postData['book_mgrNo'] = bookcheckInfo.bookInfo.book_mgrNo;
        postData['borrowId'] = bookcheckInfo.borrowId;
        postData['borrower'] = bookcheckInfo.borrower;
        net.post("bookapp/saveCheckOutBook", postData, function(error){},function(response){
            if (response.code != 0){
                dia.alert('Confirmation', response.msg, ['OK'], function(title) {
                    if(bookcheckInfo.fromUrl == "book"){
                        window.shouldPageRefresh.book = false;
                    }
                    $.mobile.newChangePage("#"+bookcheckInfo.fromUrl,{ transition: "slide",reverse: false,changeHash: false});
                });
            }
            else {
                var info = response.data.Info;
                $("#book_check_listView p.state").removeClass().addClass("state "+converState(info.status).toLowerCase().split(" ").join("")).html(converState(info.status));
                $("#book_check_listView #checkeara").remove();
                $("#book_check_listView").append('\ <div style="border: 1px solid #d2d2d2;font-size:14px;color:#404040; overflow: auto;margin: 20px 16px;text-align: left;">\
                <div class="confirmation_icon" style="height: auto; padding: 10px 10px 10px 50px; width: 100%;">Book has been checked out successfully.</div>\
                </div><div id="btn_book_scan" style="height: 36px; background-color: #a3bdad; font-size: 14px; color: #ffffff; line-height: 36px;\
                text-align: center;margin: 20px 16px;">Continue Scanning</div>');
            }
        },{async:false});
    });

    $('#book_check').off('click', '#btn_book_checkin_request').on('click', '#btn_book_checkin_request', function() {
        var postData = {};
        postData['userId'] = q['user'].userId;
        postData['userName'] = q['user'].userName;
        postData['bookId'] = bookcheckInfo.bookInfo.book_sn;
        postData['book_mgrNo'] = bookcheckInfo.bookInfo.book_mgrNo;
        postData['borrowId'] = bookcheckInfo.borrowId;
        postData['borrower'] = bookcheckInfo.borrower;
        net.post("bookapp/saveCheckInBook", postData, function(error){},function(response){
            if (response.code != 0) {
                dia.alert('Confirmation', response.msg, ['OK'], function(title) {
                    if(bookcheckInfo.fromUrl == "book"){
                        window.shouldPageRefresh.book = false;
                    }
                    $.mobile.newChangePage("#"+bookcheckInfo.fromUrl,{ transition: "slide",reverse: false,changeHash: false});
                });
            }
            else {
                var info = response.data.Info;
                $("#book_check_listView p.state").removeClass().addClass("state "+converState(info.status).toLowerCase().split(" ").join("")).html(converState(info.status));
                $("#book_check_listView #checkeara").remove();
                $("#book_check_listView").append('\<div style="border: 1px solid #d2d2d2;font-size:14px;color:#404040; overflow: auto;margin: 20px 16px;text-align: left;">\
                 <div class="confirmation_icon" style="height: auto; padding: 10px 10px 10px 50px; width: 100%;">Book has been checked in successfully.</div></div>\
                <div id="btn_book_scan" style="height: 36px; background-color: #a3bdad; font-size: 14px; color: #ffffff; line-height: 36px;\
                text-align: center;margin: 20px 16px;">Continue Scanning</div>');
            }
        },{async:false});
    });


    $('#book_check').off('click', '#btn_book_scan').on('click', '#btn_book_scan',function() {
         $("#book_check_catlog_content").removeClass("showcatlog") ;
        $("#book_check_catlog_content").slideUp(500);
        $('#title_book_check').fadeIn(400);
        $("#book_check_btn_menu").fadeIn(400);
        cloudSky.zBar.scan(null, function(s) {
            net.post('bookapp/readBorrowBook', {
                content:s,
                userName:q['user'].userName
            }, function(error){

            }, function(response){
                if (response.code == net.code.error) {
                    dia.alert('Confirmation', response.msg, ['OK'], function(title) {
                    });
                } else {
                    bookcheckInfo = response.data.Info;
                    getBookCheckDetail(response.data.Info);
                }
            },{async:false});
        }, function(error) {
            console.error('扫描错误结果:%o', error);
        });
    });


    $('#book_check').off('click', '#btn_book_check_cancel').on('click', '#btn_book_check_cancel',function() {
        if(bookcheckInfo.fromUrl == "book"){
            window.shouldPageRefresh.book = false;
        }
        $.mobile.newChangePage("#"+bookcheckInfo.fromUrl,{ transition: "slide",reverse: false,changeHash: false});
//        $("#book_check_catlog_content").removeClass("showcatlog") ;
//        $("#book_check_catlog_content").hide();
//        $('#title_book_check').show();
//        $("#book_check_btn_menu").show();
//        cloudSky.zBar.scan(null, function(s) {
//            net.post('bookapp/readBorrowBook', {
//                content:s,
//                userName:q['user'].userName
//            }, function(error){
//
//            }, function(response){
//                if (response.code == net.code.error) {
//                    dia.alert('Confirmation', response.msg, ['OK'], function(title) {
//                    });
//                } else {
//                    getBookCheckDetail(response.data.Info);
//                }
//            },{async:false});
//        }, function(error) {
//            console.error('扫描错误结果:%o', error);
//        });
    });

    $('#book_check').off('click', '#book_check_btn_menu').on('click', '#book_check_btn_menu',function() {
        if(bookcheckInfo.fromUrl == "book"){
            window.shouldPageRefresh.book = false;
        }
        $.mobile.newChangePage("#"+bookcheckInfo.fromUrl,{ transition: "slide",reverse: false,changeHash: false});
    });



    $('#book_check_catalog').off('click').on('click',function(evt){
        if($("#book_check_catlog_content").hasClass("showcatlog")){
            $("#book_check_catlog_content").removeClass("showcatlog") ;
            $("#book_check_catlog_content").slideUp(500);
            $('#title_book_check').fadeIn(400);
            $("#book_check_btn_menu").fadeIn(400);
        }
        else{
            $("#book_check_catlog_content").addClass("showcatlog") ;
            $("#book_check_catlog_content").slideDown(500);
            $('#title_book_check').fadeOut(400);
            $("#book_check_btn_menu").fadeOut(400);
        }
    });
    $('#book_check_catlog_opacity').off('click').on('click',function(evt){
        $("#book_check_catlog_content").removeClass("showcatlog") ;
        $("#book_check_catlog_content").slideUp(500);
        $('#title_book_check').fadeIn(400);
        $("#book_check_btn_menu").fadeIn(400);
    });

    $('#book_check_catlog_info div').off('click').on('click',function(evt){
        if($(this).hasClass("current")){

            if($("#book_check_catlog_content").hasClass("showcatlog")){
                $("#book_check_catlog_content").removeClass("showcatlog") ;
                $("#book_check_catlog_content").slideUp(500);
                $('#title_book_check').fadeIn(400);
                $("#book_check_btn_menu").fadeIn(400);
            }
            else{
                $("#book_check_catlog_content").addClass("showcatlog") ;
                $("#book_check_catlog_content").slideDown(500);
                $('#title_book_check').fadeOut(400);
                $("#book_check_btn_menu").fadeOut(400);
            }
        }
        else{
            var url = $(this).attr("url");
            if(url == "#book"){
                window.shouldPageRefresh.book =  true;
            }
            $.mobile.newChangePage(url,{ transition: "slide",reverse: false,changeHash: false});
        }
    });


    $("#book_check").on( "pagecreate", function() {
        $( "body > [data-role='panel']" ).panel();
        $( "body > [data-role='panel'] [data-role='listview']" ).listview();
    });

    // 展示的时候请求新闻
    $("#book_check").on( "pageshow", function( event ) {
        console.error("book_check");
        disableClickEvent(true);
        window.setBodyOverflow($(document.body));
        $('#book_check_content').css('height',($(window).height()-44-20));
        $('#book_check_listView').css('height',($(window).height()-44));
        $('#book_check_catlog_content').css('height',($(window).height()-44));
        if (q['user'].isAdmin  &&  q['user'].isAdmin == "Y") {
            $('#book_check_catlog_opacity').css('height',($(window).height()-340+52-4));
        }
        else{
            $('#book_check_catlog_opacity').css('height',($(window).height()-340+52+58-4));
        }
        // window.historyView = [];
    });


    $("#book_check").on( "pagehide", function( event ) {
//        $('#book_check_catlog_content').hide();
        $("#book_check_catlog_content").removeClass("showcatlog") ;

        $('#title_book_check').show();
        $("#book_check_btn_menu").show();
        $("#book_check_catlog_content").hide();
    });

    function stopEventPropagation(event) {
        event.stopPropagation();
    }

    function disableClickEvent(addListener) {
        var $disabledBody = $("body.disabled");
        if ($disabledBody.length > 0) {
            if (addListener) {
                $disabledBody[0].addEventListener("click", stopEventPropagation, true);
            }
            else {
                $disabledBody[0].removeEventListener("click", stopEventPropagation, true);
                $disabledBody.removeClass("disabled");
            }
        }
    }

    return {
        showDetailWithCheckBook : function (bookData) {
            bookcheckInfo = bookData;
            getBookCheckDetail(bookData);
        }
    }
});

