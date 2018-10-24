/**
 * Created by testbetta1 on 15/9/16.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs','book_check','panle'], function($, m, net, dia,bookcheck,panle) {
    $('#bookrecord_detail_content').on('swiperight',function() {
        if($("#borrowbook_ul").is(':visible')){
            book_switchFavorite();
        }else{
            $.mobile.backChangePage("#book",{ transition: "slide",reverse: true,changeHash: false});
        }
    });

    //关于book与favorite book同一个页面的处理
    function book_switchFavorite(){
        $("#borrowbook_ul").hide();
        $("#bookshow_ul,#book_search,#book_category,#search_area").show();
        $('#title_book').html("Book²");
    }
    var bookrecordInfo = [];
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
    function createBookRecordDetailHtml(borrowData) {
        var bookInfo = borrowData.bookInfo;
        var bookimg = bookInfo.book_cover;//images/image/bg_masterbg_1x.jpg
        var bookname = bookInfo.book_Name;
        var state = borrowData.status;
        var author = bookInfo.book_Author;
        var statename= converState(state);
        var stateBtn =""
        var showMessage = borrowData.showMessage;
        var libraryPlace=borrowData.place;
        var days=borrowData.workDay;
        var starttime=borrowData.workTimeStart;
        var endtime=borrowData.workTimeEnd;

        var boprrowDate = new Date(borrowData.boprrowDate * 1000);
        var pickupdate =new Date(borrowData.pickupdate * 1000);
        var currrentDate =new Date();
        var dueDate = new Date(borrowData.dueDate * 1000);

        var boprrowMonth = getMonthString(boprrowDate.getMonth());
        var boprrowtime = boprrowMonth +" "+ boprrowDate.getDate() + ", " + boprrowDate.getFullYear() ;

        var pickupMonth = getMonthString(pickupdate.getMonth());
        var pickuptime = pickupMonth +" "+ pickupdate.getDate() + ", " + pickupdate.getFullYear() +" "+borrowData.workTimeStart +" - "+ borrowData.workTimeEnd; ;

        var dueMonth = getMonthString(dueDate.getMonth());
        var duetime = dueMonth +" "+ dueDate.getDate() + ", " + dueDate.getFullYear() ;

        var alert = "";
        if(state == 1){
            if(showMessage == true){
               //'+borrowData.place+'\ working day\ ('+borrowData.workTimeStart +'-'+ borrowData.workTimeEnd+'\ at every '+borrowData.workDay+'\).\

                alert = '\<div style="border: 1px solid #d2d2d2;font-size:14px;color:#404040; overflow: auto;margin: 20px 0px;text-align: left;">\
                <div class="warning_icon" style="height: auto; padding: 10px 10px 10px 50px; width: 100%;">Your pick up date is overdue, please pick up the book in the next three librarian working day('+days+')' +starttime+'\-'+endtime+'\.Otherwise your reservation will be cancelled automatically.</div></div>';
            }
            stateBtn = '\<div style="margin-top: 20px; color: #404040; font-size: 14px;">Pick up date</div>\
                <div style="margin-top: 5px; font-weight: bold; font-size: 14px; color: #404040;">'+pickuptime+'\</div>'+alert+'\<div id="btn_borrow_record_checkout" \
                style="height: 36px; background-color: #e6b012; font-size: 14px; color: #ffffff; margin: 20px 0 0 0; line-height: 36px; text-align: center">Check Out This Book</div>\
                <div id="btn_borrow_record_cancel" style="height: 36px; background-color: #a3bdad; font-size: 14px; color: #ffffff; margin: 15px 0 0 0; line-height: 36px;\
                text-align: center">Cancel Reservation</div>';
        }
        else if(state == 2){
            if(showMessage == true){
                alert = '\<div style="border: 1px solid #d2d2d2;font-size:14px;color:#404040; overflow: auto;margin: 20px 0px;text-align: left;">\
                    <div class="information_icon" style="height: auto; padding: 10px 10px 10px 50px; width: 100%;">Your book is due soon. If you need more time to finish reading, please renew it.</div></div>';
            }
            stateBtn = '\<div style="margin-top: 20px; color: #404040; font-size: 14px;">Borrowed on</div>\
                <div style="margin-top: 5px; font-weight: bold; font-size: 14px; color: #404040;">'+boprrowtime+'\</div><div style="margin-top: 20px; color: #404040; font-size: 14px;">Due date</div>\
                <div style="margin-top: 5px; font-weight: bold; font-size: 14px; color: #404040;">'+duetime+'\</div>'+alert+'\<div id="btn_borrow_record_checkin" \
                style="height: 36px; background-color: #e6b012; font-size: 14px; color: #ffffff; margin: 20px 0 0 0; line-height: 36px; text-align: center">Check In This Book</div>\
                <div id="btn_borrow_record_renew" style="height: 36px; background-color: #a3bdad; font-size: 14px; color: #ffffff; margin: 15px 0 0 0; line-height: 36px;\
                text-align: center">Renew</div>';
        }
        else if(state == 3){
            if(showMessage == true){
                alert = '\<div style="border: 1px solid #d2d2d2;font-size:14px;color:#404040; overflow: auto;margin: 20px 0px;text-align: left;">\
                    <div class="information_icon" style="height: auto; padding: 10px 10px 10px 50px; width: 100%;">Your book is due soon, please return it in time.</div></div>';
            }
            stateBtn = '\<div style="margin-top: 20px; color: #404040; font-size: 14px;">Borrowed on</div>\
                <div style="margin-top: 10px; font-weight: bold; font-size: 14px; color: #404040;">'+boprrowtime+'\</div><div style="margin-top: 20px; color: #404040; font-size: 14px;">Due date</div>\
                <div style="margin-top: 10px; font-weight: bold; font-size: 14px; color: #404040;">'+duetime+'\</div>'+alert+'\<div id="btn_borrow_record_checkin" \
                style="height: 36px; background-color: #e6b012; font-size: 14px; color: #ffffff; margin: 20px 0 0 0; line-height: 36px; text-align: center;">Check In This Book</div>';
        }
        else if(state == 4){
            if(showMessage == true){

                alert = '\<div style="border: 1px solid #d2d2d2;font-size:14px;color:#404040; overflow: auto;margin: 20px 0px;text-align: left;">\
                <div class="warning_icon" style="height: auto; padding: 10px 10px 10px 50px; width: 100%;">Your book is overdue. Please return it to the library as soon as possible.</div></div>';


                alert = '\<div style="border: 1px solid #d2d2d2;font-size:14px;color:#404040; overflow: auto;margin: 20px 0px;text-align: left;">\
                    <div class="warning_icon" style="height: auto; padding: 10px 10px 10px 50px; width: 100%;">The due date of you loan \
                    is already expire,please check in the book in time.</div></div>';
            }
            if(borrowData.boprrowDate){
                if(showMessage == true){
                    alert = '\<div style="border: 1px solid #d2d2d2;font-size:14px;color:#404040; overflow: auto;margin: 20px 0px;text-align: left;">\
                        <div class="warning_icon" style="height: auto; padding: 10px 10px 10px 50px; width: 100%;">The due date of you loan \
                        is already expire,please check in the book in time.</div></div>';
                }
                stateBtn = '\<div style="margin-top: 20px; color: #404040; font-size: 14px;">Borrowed on</div>\
                    <div style="margin-top: 10px; font-weight: bold; font-size: 14px; color: #404040;">'+boprrowtime+'\</div><div style="margin-top: 20px; color: #404040; font-size: 14px;">Due date</div>\
                    <div style="margin-top: 10px; font-weight: bold; font-size: 14px; color: #404040;">'+duetime+'\</div>'+alert+'\<div id="btn_borrow_record_checkin"\
                    style="height: 36px; background-color: #e6b012; font-size: 14px; color: #ffffff; margin: 20px 0 0 0; line-height: 36px; text-align: center;">Check In This Book</div>';
            }
//            else{
//                if(showMessage == true){
//                    alert = '\<div style="border: 1px solid #d2d2d2;font-size:14px;color:#404040; overflow: auto;margin: 20px 0px;text-align: left;">\
//                        <div class="warning_icon" style="height: auto; padding: 10px 10px 10px 50px; width: 100%;">Your book is overdue. Please return it to the library as soon as possible.</div></div>';
//                }
//                stateBtn = '\<div style="margin-top: 20px; color: #404040; font-size: 14px;">Pick up date</div>\
//                    <div style="margin-top: 5px; font-weight: bold; font-size: 14px; color: #404040;">'+pickuptime+'\</div>'+alert+'\<div id="btn_borrow_record_checkout" \
//                    style="height: 36px; background-color: #e6b012; font-size: 14px; color: #ffffff; margin: 20px 0 0 0; line-height: 36px; text-align: center">Check Out This Book</div>\
//                    <div id="btn_borrow_record_cancel" style="height: 36px; background-color: #a3bdad; font-size: 14px; color: #ffffff; margin: 15px 0 0 0; line-height: 36px;\
//                    text-align: center">Cancel Reservation</div>';
//            }
        }

        var html = '\<div style="margin: 20px 0px; padding:0px; overflow: hidden;"><div style="overflow:hidden;">\
             <div style="float: left; height: 120px; width: 92px; display: -webkit-flex;display:flex; -webkit-align-items:\
            center; -webkit-justify-content: center;"><img src="'+bookimg+'"\ style="max-width: 92px;max-height: 120px;"/>\
            </div><div style="margin: 0 0 0 108px; height:120px;"><div><span style="font-size: 12px; color: #404040;word-break: break-all;">'+bookname+'\</span><p style="color:#808080;font-size:10px;\
             margin:7px 0 10px 0;">'+(author ? 'By '+author : "")+'\</p><p style="margin: 0px; font-size: 14px; color: #fff; height: 22px; line-height: 22px; text-align: center; \
             border-radius: 6px; padding: 0 7px;\
            " class="state '+statename.toLowerCase().split(" ").join("")+'">'+statename+'\</p><p style="font-size: 12px; color: #404040;">'+libraryPlace+'\</p></div></div>'+stateBtn+'\</div></div>';
        return html;
    }

    function getCurrentBook(msg){
        if(msg){
            dia.alert('Confirmation',msg, ['OK'], function(title) {
                var currentData = {};
                currentData['userName'] = q['user'].userName;
                net.post("bookapp/getMycurrentBook", currentData, function(error){
                },function(response){
                    if (response.code != 0) {
                        getBookRecordDetail();
                    }
                    else {
                        bookrecordInfo = response.data.Info;
                        getBookRecordDetail(bookrecordInfo);
                    }
                },{async:false});
            });
        }
    }
    /**
     * 展示书的详情信息
     * @param content
     */
    function getBookRecordDetail(bookData) {
        $("#bookrecord_detail_listView").empty();
        if(bookData){
            var bookDetailHtml = createBookRecordDetailHtml(bookData);
            $("#bookrecord_detail_listView").html(bookDetailHtml);
        }
        else{
            $("#bookrecord_detail_listView").html('\<div id="noreservebook" style="text-align:center;color:#808080;font-size:14px;margin-top:'+(($(window).height()-44)/2-20)+'\px;">You haven\'t reserved any book, explore in <span style="color:#f26647;">Book²</span> to find your favorite one.</div>');
        }
    };
    $('#bookrecord_detail').off('click', '#btn_borrow_record_cancel').on('click', '#btn_borrow_record_cancel', function() {
        dia.alert('Confirmation', 'Are you sure you want to cancel this reservation?', ['No','Yes'],function(title) {
            if(title == "Yes"){
                var postData = {};
                postData['userName'] = q['user'].userName;
                postData['bookId'] = bookrecordInfo.bookInfo.book_sn;
                postData['book_mgrNo'] = bookrecordInfo.bookInfo.book_mgrNo;
                postData['borrowId'] = bookrecordInfo.borrowId;
                net.post("bookapp/saveCancelBorrowBook", postData, function(error){
                },function(response){
                    if (response.code != 0) {
                        getCurrentBook(response.msg);
                    }
                    else {
                        //height:'+($(window).height()-40)+'\px;
                        $("#bookrecord_detail_listView").html('\<div id="noreservebook" style="text-align:center;color:#808080;font-size:14px;margin-top:'+(($(window).height()-44)/2-20)+'\px;">You haven\'t reserved any book, explore in <span style="color:#f26647;">Book²</span> to find your favorite one.</div>');
                    }
                },{async:false});
            }
        });
    });

    $('#bookrecord_detail').off('click','#btn_borrow_record_checkin').on('click', '#btn_borrow_record_checkin', function() {
        var postData = {};
        postData['userName'] = q['user'].userName;
        postData['type'] = "in";
        postData['bookId'] = bookrecordInfo.bookInfo.book_sn;
        postData['book_mgrNo'] = bookrecordInfo.bookInfo.book_mgrNo;
        postData['borrowId'] = bookrecordInfo.borrowId;
        net.post("bookapp/checkStatus", postData, function(error){
        },function(response){
            if (response.code != 0) {
                dia.alert('Confirmation',response.msg,['OK'],function(title) {
                    getCurrentBook(response.msg);
                });
            }
            else {
                var info = response.data.Info;
                if (info == true) {
                    dia.alert('Check In This Book', '\<div style="line-height: 15px;">Please check in your book by showing this QR Code to the librarian. ' + bookrecordInfo.place + '\ is available at ('+bookrecordInfo.workDay+')' +bookrecordInfo.workTimeStart+'\-'+bookrecordInfo.workTimeEnd+'\ . </div><img style="margin-bottom: -16px; margin-top: 4px;" src="' + bookrecordInfo.QRcodeImage + '\"/>', ['Close'], function (title) {
                    }, {btnInverse: true});
                }
                else{
                    getCurrentBook("Sorry,the book has been checked in.");
                }
            }
        },{async:false});
    });

    $('#bookrecord_detail').off('click',"#btn_borrow_record_renew").on('click', '#btn_borrow_record_renew', function() {
        dia.alert('Need more time?', 'Would you like more time to finish the book and renew it for one more month?', ['Cancel','OK'],function(title) {
            if(title == "OK"){
                var postData = {};
                postData['userName'] = q['user'].userName;
                postData['bookId'] = bookrecordInfo.bookInfo.book_sn;
                postData['book_mgrNo'] = bookrecordInfo.bookInfo.book_mgrNo;
                postData['borrowId'] = bookrecordInfo.borrowId  ;
                net.post("bookapp/saveRenewBook", postData, function(error){

                },function(response){
                    if (response.code != 0) {
                        getCurrentBook(response.msg);
                    }
                    else {
                        bookrecordInfo = response.data.Info;
                        getBookRecordDetail(bookrecordInfo);
                    }
                },{async:false});
            }
        });
    });
    $("#book_borrow_record_btn_menu").off("click").on("click",function(){
        book_switchFavorite();
        window.shouldPageRefresh.book =  true;
        //20170929 更改
        $("#my-book-nav").removeClass('not_Visible');
        $.mobile.backChangePage("#book",{ transition: "slide",reverse: false,changeHash: false});
    });
    $('#bookrecord_detail').off('click', '#noreservebook').on('click', '#noreservebook',function() {
        book_switchFavorite();
        window.shouldPageRefresh.book =  true;
        $.mobile.backChangePage("#book",{ transition: "slide",reverse: false,changeHash: false});
    });

    $('#bookrecord_detail').off('click', '#btn_borrow_record_checkout').on('click', '#btn_borrow_record_checkout',function() {
        var postData = {};
        postData['userName'] = q['user'].userName;
        postData['type'] = "out";
        postData['bookId'] = bookrecordInfo.bookInfo.book_sn;
        postData['book_mgrNo'] = bookrecordInfo.bookInfo.book_mgrNo;
        postData['borrowId'] = bookrecordInfo.borrowId;
        net.post("bookapp/checkStatus", postData, function(error){
        },function(response){
            if (response.code != 0) {
                getCurrentBook(response.msg);
            }
            else {
                var info = response.data.Info;
                if (info == true) {
                    dia.alert('Check Out This Book', '\<div style="line-height: 15px;">Please pick up your book at '+bookrecordInfo.place+'\ at the time you selected, and show this QR Code to the librarian.</div><img style="margin-bottom: -16px; margin-top: 4px;" src="'+bookrecordInfo.QRcodeImage+'\"/>', ['Close'], function(title) {

                    },{btnInverse:true});
                }
                else{
                    getCurrentBook("Sorry,the book has been checked out.");
                }
            }
        },{async:false});
    });

    $('#book_borrow_record_catalog').off('click').on('click',function(evt){
        if($("#record_catlog_content").hasClass("showcatlog")){
            $("#record_catlog_content").removeClass("showcatlog") ;
            $("#record_catlog_content").slideUp(500);
            $('#book_borrow_record_btn_menu').fadeIn(400);
            $("#title_book_borrow_record").fadeIn(400);
        }
        else{
            $("#record_catlog_content").addClass("showcatlog") ;
            $("#record_catlog_content").slideDown(500);
            $('#book_borrow_record_btn_menu').fadeOut(400);
            $("#title_book_borrow_record").fadeOut(400);
        }
    });


    $('#record_catlog_opacity').off('click').on('click',function(evt){
        $("#record_catlog_content").removeClass("showcatlog") ;
        $("#record_catlog_content").slideUp(500);
        $('#book_borrow_record_btn_menu').fadeIn(400);
        $("#title_book_borrow_record").fadeIn(400);
    });

    $('#record_catlog_info div').off('click').on('click',function(evt){
        if($(this).hasClass("current")){
            if($("#record_catlog_content").hasClass("showcatlog")){
                $("#record_catlog_content").removeClass("showcatlog") ;
                $("#record_catlog_content").slideUp(500);
                $('#book_borrow_record_btn_menu').fadeIn(400);
                $("#title_book_borrow_record").fadeIn(400);
            }
            else{
                $("#record_catlog_content").addClass("showcatlog") ;
                $("#record_catlog_content").slideDown(500);
                $('#book_borrow_record_btn_menu').fadeOut(400);
                $("#title_book_borrow_record").fadeOut(400);
            }
        }
        else{
            var url = $(this).attr("url");
            if(url == "#book_check"){
                $("#record_catlog_content").removeClass("showcatlog") ;
                $("#record_catlog_content").slideUp(500);
                $('#book_borrow_record_btn_menu').fadeIn(400);
                $("#title_book_borrow_record").fadeIn(400);
                cloudSky.zBar.scan(null, function(s) {
                    net.post('bookapp/readBorrowBook', {
                        content:s,
                        userName:q['user'].userName
                    }, function(error){

                    }, function(response){
                        if (response.code == net.code.error) {
                            getCurrentBook(response.msg);
                        } else {
                            $(url).page();
                            var dataInfo = response.data.Info;
                            dataInfo.fromUrl = "bookrecord_detail";
                            bookcheck.showDetailWithCheckBook(dataInfo);
                            $.mobile.newChangePage(url,{ transition: "slide",reverse: false,changeHash: false});
                        }
                    },{async:false});
                }, function(error) {
                    console.error('扫描错误结果:%o', error);
                });
            }
            else{
                if(url == "#book"){
                    window.shouldPageRefresh.book =  true;
                }
                $.mobile.newChangePage(url,{ transition: "slide",reverse: false,changeHash: false});
            }
        }
    });


    $("#bookrecord_detail").on( "pagecreate", function() {
        $( "body > [data-role='panel']" ).panel();
        $( "body > [data-role='panel'] [data-role='listview']" ).listview();
    });

    // 展示的时候请求新闻
    $("#bookrecord_detail").on( "pageshow", function( event ) {
        console.error("bookrecord_detail");
        disableClickEvent(true);
        window.setBodyOverflow($(document.body));
        $('#bookrecord_detail_content').css('height',($(window).height()-44-20));
        $('#bookrecord_detail_listView').css('height',($(window).height()-44));
        $('#record_catlog_content').css('height',($(window).height()-44));
        if (q['user'].isAdmin  &&  q['user'].isAdmin == "Y") {
            $('#record_catlog_opacity').css('height',($(window).height()-340+52-4));
        }
        else{
            $('#record_catlog_opacity').css('height',($(window).height()-340+52+58-4));
        }
        if($("#bookrecord_detail_listView").hasClass("push")){
            $("#bookrecord_detail_listView").removeClass("push");
        }
        // window.historyView = [];
    });


    $("#bookrecord_detail").on( "pagehide", function( event ) {
        $("#record_catlog_content").removeClass("showcatlog") ;
        $("#record_catlog_content").hide();
        $('#title_book_borrow_record').show();
        $("#book_borrow_record_btn_menu").show();
    });

    $("#bookrecord_detail").on( "pagebeforeshow", function( event ) {
        var postData = {};
        postData['userName'] = q['user'].userName;
        net.post("bookapp/getMycurrentBook", postData, function(error){},function(response){
            if (response.code != 0) {
                getBookRecordDetail();
            }
            else {
                bookrecordInfo = response.data.Info;
                getBookRecordDetail(bookrecordInfo);
            }
        },{async:false});
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
});
