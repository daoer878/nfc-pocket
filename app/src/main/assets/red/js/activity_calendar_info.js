/**
 * Created by testbetta1 on 16/4/29.
 */

require(['jquery', 'jquerymobile', 'net', 'dialogs'], function($, m, net, dia) {

    $('#activity_calendar_btn_back').off('click').on('click', function() {
        $.mobile.backChangePage("#newsroom",{ transition: "slide",reverse: false,changeHash: false});

    });
    $("#activity_calendar_info").on( "pagebeforeshow", function( event ) {
        net.post('activity/getActivityPlan', {
            userId:q['user'].userId
        }, function(error){
            var padTop = $(window).height()/2-60;
            $("#activity_calendar_listview").html('\<div style="height:'+($(window).height()-44-20)+'\px;padding-top:\
            '+padTop+'\px;text-align: center;background:#ededed;color:#808080;font-size:14px; margin: 10px 0;padding-left: 20px; padding-right: 20px;">\
            Activities are coming soon.</div>');
        }, function(response){
            if (response.code != 0) {
                var padTop = $(window).height()/2-60;
                $("#activity_calendar_listview").html('\<div style="height:'+($(window).height()-44-20)+'\px;padding-top:\
            '+padTop+'\px;text-align: center;background:#ededed;color:#808080;font-size:14px; margin: 10px 0;padding-left: 20px; padding-right: 20px;">\
            Activities are coming soon.</div>');
            }
            else{
                getCalendInfo(response.data.planList);
            }
        },{async:false});
    });

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

    function getCalendInfo(calendarInfos){
        var calendarInfHtmlArr = [];
        $.each(calendarInfos,function(index,calendarInfo){
            var plans = calendarInfo.plans;
            var planHtml = "";
            var titleDate = calendarInfo.titleDate;
            var titleTime = new Date(titleDate * 1000);
            var month = getMonthString(titleTime.getMonth());
            var title = month + " " + titleTime.getDate()  + ((new Date().getFullYear() == titleTime.getFullYear()) ? "" :  (","+ titleTime.getFullYear()));
            var titlehtml = "\<div style='padding:0 10px;font-size:14px;color:#808080;background:#ededed;height:30px;line-height:30px;'>"+title+"\</div>";
            $.each(plans,function(index,plan){
                var subject = plan.subject;
                var startTime = plan.startTime;
                var endTime = plan.endTime;
                planHtml += "\<div style='padding:0 10px;height:44px;line-height:44px;color:#404040;background: #fff;overflow: hidden; position: relative;'><div style='overflow: hidden;font-size:14px;height: 44px;margin-right:75px;text-overflow: ellipsis;white-space: nowrap;'>"+subject+"\</div><div style='position: absolute; right: 10px;top: 0; width: 65px;font-size:12px;'>"+startTime+"-"+endTime+"\</div></div>";
            });
            calendarInfHtmlArr.push(titlehtml+planHtml);
        });
        $("#activity_calendar_listview").html(calendarInfHtmlArr.join(""));
    }
    //changePassword页面 设置内容高度是Header剩下的高度
    $("#activity_calendar_info").on( "pageshow", function( event ) {
        window.setBodyOverflow($(document.body));
        $('#activities_calendar_content').css('height',($(window).height()-44-20));
        window.historyView = [];
    });

    // Nick added for pull to refresh end

    function compatibility() {
        /* Logon */
        $('#activityCalendar_header_title').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#activityCalendar_header_title').css('postion', 'absulute')
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
