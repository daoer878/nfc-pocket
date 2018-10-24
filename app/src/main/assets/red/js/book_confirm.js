/**
 * Created by testbetta1 on 15/9/10.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs','bookrecord_detail'], function($, m, net, dia,bookrecorddetail) {

    var allInfo = [];

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
    function createBookConfirmHtml(borrowData) {
        var bookInfo = borrowData.bookInfo;
        var bookimg = bookInfo.book_cover;//images/image/bg_masterbg_1x.jpg
        var bookname = bookInfo.book_Name;
        var author = bookInfo.book_Author;
        var borrownum = bookInfo.available_quantity;
        var place = borrowData.place;
        var pickday = borrowData.pickupdate;

        var date = new Date(pickday * 1000);
        var month = getMonthString(date.getMonth());
        var time = month +" "+ date.getDate() + ", " + date.getFullYear() +" "+borrowData.workTimeStart +" - "+ borrowData.workTimeEnd;
        var html = '\<div style="margin:30px 16px;text-align:center;"><img style="max-width: 92px; max-height: 120px;" src="'+bookimg+'"\ ><div style="\
        font-size:10px;color:#808080;margin-top: 10px;">'+borrownum+'\ available</div><div style="font-size:14px;\
        color:#404040;margin: 20px 0 10px 0;word-break: break-all;">'+bookname+'\</div><div style="color:#808080;font-size:10px;\
        ">'+(author ? 'By '+author : "")+'\</div> <div style="border: 1px solid #d2d2d2;font-size:14px;color:#404040; overflow: auto;margin: 20px 0px;text-align: left;"><div \
        class="confirmation_icon" style="height: auto; padding: 10px 10px 10px 50px; width: 100%;">You have reserved this book successfully. Please\
        pick it up at '+place+'\ at '+time+'\.</div></div>\
        <div id="btn_book_borrow_view" style="height: 36px; background-color: #e6b012; font-size: 14px; color: #ffffff; line-height: 36px;\
        text-align: center;margin: 20px 0 0 0;">View My Current Book</div>\
        <div id="btn_book_borrow_remind" style="height: 36px; background-color: #a3bdad; font-size: 14px; color: #ffffff; line-height: 36px;\
        text-align: center;margin: 15px 0 0 0;">Set Reminder for Picking Up This Book</div></div></div>';
        return html;
    }

    /**
     * 展示书的详情信息
     * @param content
     */
    function getBookConfirm(bookConfirmData) {
        var bookConfirmHtml = createBookConfirmHtml(bookConfirmData);
        $("#book_confirm_content").html(bookConfirmHtml);
    };
    //返回到活动注册页面
    $('#book_confirm_btn_menu').off('click')
        .on('click', function() {
            window.shouldPageRefresh.book = false;
            $.mobile.newChangePage('#book',{ transition: "slide",reverse: true, changeHash:false});
        });



    $('#book_confirm').off("click", '#btn_book_borrow_remind').on('click', '#btn_book_borrow_remind',function() {
        var pickday = allInfo.pickupdate;
        var pickStart = new Date(pickday * 1000);
        var pickEnd= new Date(pickday * 1000);
        var startTime = (allInfo.workTimeStart).split(":");
        var endTime = (allInfo.workTimeEnd).split(":");
        pickStart.setHours(startTime[0]);
        pickStart.setMinutes(startTime[1]);
        pickEnd.setHours(endTime[0]);
        pickEnd.setMinutes(endTime[1]);
//        var interTimes= 15*60*1000;
//        var time = new Date(Date.parse(pick)-interTimes);
        alarmClock.addAlarmClock([(Math.round(pickStart.getTime()/1000)).toString(),"Time to pick up your book!",allInfo.bookInfo.book_Name,"100",(Math.round(pickStart.getTime()/1000)).toString(),
                (Math.round(pickEnd.getTime()/1000)).toString(),allInfo.place,"ahead","900",allInfo.id+q['user'].userId],
            function(success){
                dia.alert('Confirmation', "Your reservation has been added to you phone calander successfully.", ['OK'], function(title) {
                });
            },
            function(error){
                dia.alert('Confirmation', "Your reservation has been added to you phone calander successfully.", ['OK'], function(title) {
                });
            });
    });
    $('#book_confirm').off('click','#btn_book_borrow_view').on('click','#btn_book_borrow_view', function() {
        $.mobile.newChangePage('#bookrecord_detail',{ transition: "slide",reverse: false, changeHash:false});
    });

    $('#book_confirm').on('pageshow', function(event) {
        console.error("book_confirm");
        window.setBodyOverflow($(document.body));
        $('#book_confirm_content').css('height',($(window).height()-44-20));
        // window.historyView = [];
    });

    return {
        showConfirmWithBook: function(bookData){
            allInfo = bookData;
            getBookConfirm(bookData);
        }
    }

});