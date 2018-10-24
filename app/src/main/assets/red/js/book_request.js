/**
 * Created by testbetta1 on 15/9/10.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs','book_confirm'], function($, m, net, dia,bookconfirm) {
    var request_book = {};
    //创建请求借书界面

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

    function getWeekString(day) {
        if (day == 1)
            return 'Mon';
        else if (day == 2)
            return 'Tue';
        else if (day == 3)
            return 'Web';
        else if (day == 4)
            return 'Thu';
        else if (day == 5)
            return 'Fri';
        else if (day == 6)
            return 'Sat';
        else if (day == 0)
            return 'Sun';
        else {
            console.assert(false, '星期 %o 不存在 ', day );
        }
    }
    function createBookRequestHtml(borrowData) {
        var bookimg = borrowData.book_cover;
        var bookname = borrowData.book_Name;
        var author = borrowData.book_Author;
        var borrownum = borrowData.available_quantity;
        var pickOption =[];
        var pickDays = borrowData.pickDay;
        var libraryName = borrowData.libraryName;
        $.each(pickDays,function(index,pickday){
            var date = new Date(pickday * 1000);
            var currentTime = new Date();
            var day = "Today";
            if(currentTime.getFullYear() == date.getFullYear() && currentTime.getMonth() == date.getMonth() && currentTime.getDate() == date.getDate()){
                day = "Today";
            }
            else{
                day = getWeekString(date.getDay());
            }
            var month = getMonthString(date.getMonth());
            var time = "("+day+") " + month +" "+ date.getDate() + ", " + date.getFullYear() +" "+borrowData.workTimeStart +" - "+ borrowData.workTimeEnd;
            pickOption.push('<option value="'+pickday+'"\>'+time+'\</option>');
        });
        var $requestBtn = '\<div style="text-align: center; margin: 20px 0; height: 36px; overflow: hidden;font-size:14px;"><div style="float:left;width:42.5%;height: 36px;line-height: 36px;border: \
        1px solid #e6b012;color: #e6b012;margin: 0 2.5% 0 5%" id="btn_book_borrow_cancel">Cancel</div><div style="float: right;\
        width:42.5%;height: 36px;line-height: 36px;background: #e6b012;border:1px solid #e6b012;color: #fff;margin: 0 5% 0 2.5%" id="btn_book_borrow_request">Confirm</div></div>';

        var html = '\<div style="margin: 30px 16px; text-align:center;"> <img style="max-width: 92px;max-height: 120px;" src="'+bookimg+'"\ ><div style="text-align:center;font-size: 10px; color:\
            #808080; margin-top: 10px;" id="borrownum">'+borrownum+'\ available</div><div style="font-size: 14px; color: #404040;\
            text-align: center; margin: 20px 0 10px 0;word-break: break-all;">'+bookname+'\</div><div style="font-size: 10px; color: #808080;text-align: center;"> '+ (author ? 'By '+author : "") +'\</div>\
            <div style="color: #404040;font-size: 14px;text-align:left; margin: 20px 0 10px 0;">Extension or mobile phone number</div>\
            <input data-role="none" type="number" id="request_phone" style="height: 36px;border:1px solid #ccc;width:100%;border-radius:0;background-color: rgba(255, 255, 255, 0.1);" maxlength="20"/>\
            <div style="color: #404040;font-size: 14px;text-align:left; margin: 20px 0 10px 0;">Pick up position</div>\
            <div style="font-size: 14px;text-align: left;">'+libraryName+'</div>\
            <div style=" margin: 20px 0 -5px 0;color: #404040;font-size: 14px;text-align:left;">Pick up date</div>\
            <div><span id="sleBG" class="chevron_down"><span id="sleHid"><select id="pickUpDate" class="select">'+pickOption.join("")+'\</select></span></span></div></div>'+$requestBtn;
        return html;
    }

    /**
     * 展示书的详情信息
     * @param content
     */
    function getBookRequest(bookRequestData) {
        var bookRequestHtml = createBookRequestHtml(bookRequestData);
        $("#book_request_content").html(bookRequestHtml);
    };
    function checkMobile(telephone){
        if(!(/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(telephone))){
            return true;
        }
        return false;
    }

    $(document).ready(function() {
        $('#book_request').off('input propertychange','#request_phone').on('input propertychange','#request_phone', function () {
             $(this).val($(this).val().replace(/[^\d]/g, ''));
            if ($(this).val().length > 20) {
                $(this).val($(this).val().substr(0, 20));
            }
            if ($(this).val() == "") {
                $("#btn_book_borrow_request").addClass("btn_book_borrow_request").css("opacity", "0.3");
            }
            else {
                $("#btn_book_borrow_request").removeClass("btn_book_borrow_request").css("opacity", "1");
            }
        });
    });

    $('#book_request').off('click','#btn_book_borrow_request').on('click','#btn_book_borrow_request',function(){
        if($(this).hasClass("btn_book_borrow_request")){
            return false;
        }
//        var telephone = $("#request_phone").val();
//        if(telephone == ""){
//            dia.alert("Confirmation","please input telephone.", ['OK'], function () {
//                $("#request_phone").focus();
//            });
//            return false;
//        }
//        else if(checkMobile(telephone)){
//            dia.alert('Confirmation', "please input mobile phone number.", ['OK'], function(title) {
//                $("#request_phone").focus();
//            });
//            return false;
//        }
        if($(this).hasClass("book_borrow_request_already")){
            dia.alert("Oops","You have reserved a book already.", ['OK'], function () {
                window.shouldPageRefresh.book = false;
                $.mobile.newChangePage('#book',{ transition: "slide",reverse: true, changeHash:false});

            });
            return false;
        }
        var postData = {};
        postData['userName'] = q['user'].userName;
        postData['pickupday'] = $("#pickUpDate").val();
        postData['phone'] = $("#request_phone").val();
        postData['book_sn'] = request_book.book_sn;
        postData['borrowType'] = '2';
        net.post('bookapp/addBorrowBook', postData,
        function(error){
        },
        function(response){
            if (response.code != 0) {
                dia.alert("Confirmation",response.msg, ['OK'], function () {
                    if(response.msg == "No books that can be borrowed."){
                        var  borrow_state_btn = '\<div id="btn_book_borrow_no" style="height:36px;background-color: #e6b012;font-size:18px;\
                        color:#ffffff;margin:20px 0 0 0;line-height: 36px;text-align: center;">Remind Me When Available</div>\
                        <div  id="btn_alert_set" style="border: 1px solid #d2d2d2;font-size:14px;color:#404040; overflow: auto;margin: 20px 0px 0px 0px;text-align: left;display:none;">\
                        <div class="confirmation_icon" style="height: auto; padding: 10px 10px 10px 50px; width: 100%;">Reminder has been set. You will receive a push message once this book becomes as available.</div></div>';
                        $("#borrow_state_btn").html(borrow_state_btn);
                        $("#borrownum").html("0 available");
                        $.mobile.newChangePage('#book_detail',{ transition: "slide",reverse: true, changeHash:false});
                    }
                });
            }
            else {
                $('#book_confirm').page();
                $("#book_confirm_content").empty();
                var infos= response.data.Info;
                bookconfirm.showConfirmWithBook(infos);
                 $("#btn_book_borrow_request").addClass("book_borrow_request_already");
                $.mobile.newChangePage("#book_confirm",{ transition: "slide",reverse: false,changeHash: false});
            }
        },{async:false});

    });

    $('#book_request').off('click','#btn_book_borrow_cancel').on('click', '#btn_book_borrow_cancel', function() {
        $.mobile.newChangePage('#book_detail',{ transition: "slide",reverse: true, changeHash:false});
    });

    $('#book_request_btn_menu').off('click').on('click',function() {
        window.shouldPageRefresh.book = false;
        $.mobile.newChangePage("#book",{ transition: "slide",reverse: true,changeHash: false});
    });

    // 展示的时候请求新闻
    $("#book_request").on( "pagebeforeshow", function( event ) {
        var request_phone = $("#request_phone").val();
        if(request_phone == ""){
            $("#btn_book_borrow_request").addClass("btn_book_borrow_request").css("opacity","0.3");
        }
        else{
            $("#btn_book_borrow_request").removeClass("btn_book_borrow_request").css("opacity","1");
        }
    });

    // 展示的时候请求新闻
    $("#book_request").on( "pageshow", function( event ) {
        console.error("book_request");
        disableClickEvent(true);
        window.setBodyOverflow($(document.body));
        $('#book_request_content').css('height',($(window).height()-44-20));
        // window.historyView = [];
    });

    // 'My current Books' and 'Library Rules' start
    $("#book_rule_content_info").on("swiperight",function(){
     $.mobile.newChangePage('#book',{ transition: "slide",reverse: true, changeHash:false});
  });

  $("#bookrecord_detail_listView").on("swiperight",function(){
     $.mobile.newChangePage('#book',{ transition: "slide",reverse: true, changeHash:false});
  });
    // 'My current Books' and 'Library Rules' end







    function stopEventPropagation(event) {
        event.stopPropagation();
    }

    function disableClickEvent(addListener) {
        var $disabledBody = $("body.disabled");
        if ($disabledBody.length > 0) {
            if (addListener) {
                $disabledBody[0].addEventListener("click", stopEventPropagation, true);
            } else {
                $disabledBody[0].removeEventListener("click", stopEventPropagation, true);
                $disabledBody.removeClass("disabled");
            }
        }
    }

    return {
        showRequestWithBook : function (dataBook) {
            request_book = dataBook;
            getBookRequest(request_book);
        }
    }
});
