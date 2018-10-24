/**
 * Created by Aimee on 14-11-12.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs'], function($, m, net, dia) {

    var confirm_activity = null;
    var confirm_needStr = null;

    // 补充0
    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
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

    function get_verifyAcvtivity(activity) {
        var value = activity;

        //解析报名信息
        var need_info = confirm_needStr;
//        need_info = value.enroll_need;
        console.assert(need_info != null, '必须有报名文本框显示 %o', need_info);
        var needArr = need_info.split('==');

        console.error('各文本框的属性：%o', needArr);
        // window.localStorage.setItem(q['user'].userId + '-' + value.id + '-isRegister', 'yes');
        //获取活动
        var startDate = new Date(value.startTime * 1000);
        var endDate = new Date(value.endTime * 1000);
        var deadline = new Date(value.deadline * 1000);
        var startTime = pad(startDate.getHours(), 2) + ':' + pad(startDate.getMinutes(),2) + ', ' + startDate.getDate() + " " + getMonthString(startDate.getMonth()) + " " + startDate.getFullYear();
        var endTime =  pad(endDate.getHours(),2) + ':' + pad(endDate.getMinutes(),2) + ', ' + endDate.getDate() + " " + getMonthString(endDate.getMonth()) + " " + endDate.getFullYear();
        var venue = value.venue;
        var deadlineTime = 'Deadline: ' + pad(deadline.getHours(),2) + ':' + pad(deadline.getMinutes(),2) + ', ' + deadline.getDate() + " " + getMonthString(deadline.getMonth()) + " " + deadline.getFullYear();
        value.startDate = startTime;
        value.endDate = endTime;
        value.venueDate = venue;
        value.deadlineDate = deadlineTime;
        value.needArrInfo = needArr;
        var li = creatActivity(value);
        $('#activityConfirm_list').html(li);
    }

    //创建活动
    function creatActivity(value) {
        var banner = value.banner;
        var subject = value.subject;
        var startTime = value.startDate;
        var endTime = value.endDate;
        var venue = value.venueDate;
        var needArr = value.needArrInfo;
//        var html_text = '';
//        if(needArr != null){
////            var i = 0;
//            $.each(needArr, function(index, val) {
//                var nameArr = val.split(":");
//                console.error('nameAttr: %o', nameArr);
//                    html_text += html_text = '\<!--'+ nameArr[0] +'\-->\
//                        <div style="width:100%;padding: 10px 10px 0px 10px">\
//                        <div style="font-family: Arial;font-size: 14px;font-weight: normal;color: #404040">'+ nameArr[0] +'\</div>\
//                        <div id="activityVerify_id" style="width: 100%;height: auto;font-family: Arial;font-size: 16px;font-weight: bold;color: #404040;">'+ nameArr[2] +'\</div>\
//                    </div>';
//            });
//        } else {
//            console.assert(needArr != null, '文本框为空 %o', needArr);
//        }
//        <div style="width:100%;padding: 20px 10px 10px 10px">\
//            <div style="white-space:normal;font-weight: normal;font-size: 18px;color: #ffffff;margin-bottom: 8px">'+ subject +'\</div>\
//            <div style="font-size: 11px;color: #ffffff;line-height: 18px;font-weight: normal">\
//                <span style="display: block">'+ startTime +'\</span>\
//                <span style="display: block">'+ endTime +'\</span>\
//                <span style="display: block">'+ venue +'\</span>\
//                <span style="display: block">'+ deadlineTime +'\</span>\
//            </div>\
//        </div>\
        var html_text = '\<div style="width:100%;padding: 10px 10px 0px 10px">\
            <div style="font-family: Arial;font-size: 14px;font-weight: normal;color: #404040">Activity</div>\
            <div style="width: 100%;height: auto;font-family: Arial;font-size: 16px;font-weight: bold;color: #404040;">'+ subject +'\</div>\
            </div><div style="width:100%;padding: 10px 10px 0px 10px">\
            <div style="font-family: Arial;font-size: 14px;font-weight: normal;color: #404040">Start</div>\
            <div style="width: 100%;height: auto;font-family: Arial;font-size: 16px;font-weight: bold;color: #404040;">'+ startTime +'\</div>\
            </div><div style="width:100%;padding: 10px 10px 0px 10px">\
            <div style="font-family: Arial;font-size: 14px;font-weight: normal;color: #404040">End</div>\
            <div style="width: 100%;height: auto;font-family: Arial;font-size: 16px;font-weight: bold;color: #404040;">'+ endTime +'\</div>\
            </div><div style="width:100%;padding: 10px 10px 0px 10px">\
            <div style="font-family: Arial;font-size: 14px;font-weight: normal;color: #404040">Venue</div>\
            <div style="width: 100%;height: auto;font-family: Arial;font-size: 16px;font-weight: bold;color: #404040;">'+ venue +'\</div>\
            </div>';
        var html = '\<li style="padding: 0px;">\
            <!--标题图-->\
            <div style="width:100%;  padding: 0; border: none;background-color: #fff;">\
            <div style="width: 100%" ><img src="'+ banner +'"\ style="width: 100%;"/></div>\</div>\
            <div style="border: solid 1px rgb(223,223,223);padding: 10px 10px 10px 3px;overflow: auto;margin: 10px">\
            <div class="confirm_ok" style="float: left;display: inline;height: 38px;width: 38px"></div>\
                <div style="display: inline;white-space: normal">\
                Thank you very much for your registration!\
                </div>\
            </div>\
            <div style="padding-bottom: 10px;">\
             '+ html_text +'\
            \</div>\
            </li>';
        return html;
    }
    $('#activityConfirm').on('click', '#btn_add_calendar.btn_add_calendar',function() {
        var remindActivityTime = new Date(confirm_activity.startTime * 1000);
        if (confirm_activity.frompage === '#clubActiveDetails') {
            remindActivityTime = remindActivityTime / 1000;
            confirm_activity.startTime = confirm_activity.startTime / 1000;
            confirm_activity.endTime = confirm_activity.endTime / 1000;
        }
        remindActivityTime.setDate(remindActivityTime.getDate()-1);
        remindActivityTime.setHours(20);
        remindActivityTime.setMinutes(0);
        alarmClock.addAlarmClock([(Math.round(remindActivityTime.getTime()/1000)).toString(),confirm_activity.subject,confirm_activity.briefContent,"100",confirm_activity.startTime.toString(),
                confirm_activity.endTime.toString(),null,null,null,confirm_activity.id+q['user'].userId],
        function(success){
            var postData = {};
            postData['contentId'] = confirm_activity.id;
            postData['type'] = "activity";
            postData['userId'] = q['user'].userId;
            net.post("activity/saveCalendarReminder", postData,
                function (error) {
                    alarmClock.deleteManyAlarmClock([confirm_activity.id+q['user'].userId],
                        function(success){
                            console.log(success);
                        },
                        function(error){
                            console.log(error);

                        });
                },
                function(response){
                    if (response.code != 0) {
                        alarmClock.deleteManyAlarmClock([confirm_activity.id+q['user'].userId],
                            function(success){
                                console.log(success);
                            },
                            function(error){
                                console.log(error);
                            }
                        );
                        dia.alert('Oops',"Fail to connect system calendar. Please restart and try again.",['OK'],function(title) {
                        });
                    }
                    else{
                        $("li#"+confirm_activity.id+" .li_nowRegister").addClass("calendarAdded");
                        $('#btn_add_calendar').removeClass("btn_add_calendar").html("Added");
                    }
                },
                {loading:false}
            );
        },
        function(error){
            dia.alert('Confirmation', "Fail to connect system calendar. Please restart and try again.", ['OK'], function(title) {
            });
        });
     });
    //返回到活动注册页面
    $('#activityConfirm_btn_ok').off('click')
        .on('click', function() {
            var regLi = "#activities";
            if(window.pageFrom){
                regLi = window.pageFrom;
            }
            if($("li#"+confirm_activity.id+" .li_nowRegister").size()){
                $("li#"+confirm_activity.id+" .li_nowRegister").addClass("registered");
            }
			if(window.pageFrom){
                if(confirm_activity.frompage  || window.pageFrom == "#video_detailed"){
                    $("#video_detailed .registerbtn").hide();
                    if(confirm_activity.joinType == 0){
                        if($("li#"+confirm_activity.id+" .li_nowRegister").hasClass("calendarAdded")){
                            $("#video_detailed #btn_activity_details_calendar").removeClass("btn_activity_details_calendar").html("Added").show();
                        } else {
                            $("#video_detailed #btn_activity_details_calendar").addClass("btn_activity_details_calendar").html("Add to calendar").show();
                        }
                        $("#video_detailed .activity_details_calendar").show();
                        // club 活动注册页面的相关按钮隐藏
                        if ($('.clubRegisterAcbtn#'+ confirm_activity.id +' .js-addCalendar').hasClass("calendarAdded")) {
                            $('.clubRegisterAcbtn .js-addCalendar').removeClass('btn_activity_details_calendar').addClass('tips').html('Added');
                        } else {
                            $('.clubRegisterAcbtn .js-addCalendar').addClass('btn_activity_details_calendar').removeClass('tips').html('Add to calendar');
                        }
                        $(".clubRegisterAcbtn .js-addCalendar").siblings('button').hide().end().show();
                    } else {
                        $("#video_detailed .activity_details_calendar").hide();
                        // club 活动注册页面的相关按钮隐藏
                        $(".clubRegisterAcbtn .js-pending").siblings('button').hide().end().show();
                    }
                    $('#videoDetail_content').css('height',($(window).height()-44));
                }
				$.mobile.newChangePage(window.pageFrom,{ transition: "slide",reverse: true, changeHash:false});
			}else{
				$.mobile.newChangePage('#newsroom',{ transition: "slide",reverse: true, changeHash:false});
			}
        });


    //获取注册活动 基本信息
    function getQuestionInfoConfirm(infos) {
        $('#questionnairesinfoconfirm_listView li').remove();
        var questioniInfos = infos;
        var questionliArr = [];
        $.each(questioniInfos,function(index,questionInfo){
            var type = questionInfo.question_type;
            var question = questionInfo.question;
            var questionId = questionInfo.id;
//            var requried = (questionInfo.is_required == "Y") ? "\<span style='color:#f26647;'>&nbsp;*</span>" : "" ;
            if((type == 1 && questionInfo.selectResult !="") || ((type == 2 || type == 3) && questionInfo.answers.length > 0)) {
                var li = '\<li  class="questionli" style="margin: 10px 0;padding:0px; border: none;" required="'+questionInfo.is_required+'"\
            id="'+questionId+'" questiontype="'+type+'"\><div  style="word-break: break-all;font-family: Arial; font-size: 14px;\
            font-weight: normal; color: #404040;" class="title">'+question+'\</div>';
                if (type == 1) {
                    li = li + '\<div class="input_matrix"><div class="input_div" style="word-break: break-all;\
                        font-family: Arial; font-size: 16px; font-weight: bold; color: #404040; margin: 0; padding: 0;">\
                ' + questionInfo.selectResult + '<\/div></div></li>';
                }
                else if (type == 2 || type == 3) {
                    var answers = questionInfo.answers;
                    var answersArr = [];
                    var inputType = "radio";
                    if (type == 3) {
                        inputType = "checkbox";
                    }
                    $.each(answers, function (index, answerinfo) {
                        var answer = answerinfo.answer;
                        var answerId = answerinfo.id;
                        var isDefault = answerinfo.selectResult;
                        if (isDefault == "Y") {
                            var options = '\<div class="matrix" type="' + type + '" style="width: 100%;">\
                            \<div id="img_' + answerId + '">\
                            <label for="option_' + answerId + '\
                            "class="option_label" style="cursor: pointer;display: inline-block;word-break: break-all;\
                            font-family: Arial; font-size: 16px; font-weight: bold; color: #404040; margin: 0; padding: 0;">' + answer.substr(2,answer.length-1) + '\</label></div></div>';
                            answersArr.push(options);
                        }
                    });
                    if(answersArr.length > 0){
                        li = li+answersArr.join("")+"\</li>";
                    }
                    else{
                        li = "";
                    }
                }
                if(li != ""){
                    questionliArr.push(li);
                }
            }
        });
        $('#questionnairesinfoconfirm_listView').append(questionliArr.join(""));
    }


    $('#activityConfirm').on('pageshow', function(event) {
        console.warn("activityConfirm");
        window.setBodyOverflow($(document.body));
        $('#activityConfirm_content').css('height',($(window).height()-44-20));
        $('#activityConfirm_content_info').css('min-height',($(window).height()-44-20));
        get_verifyAcvtivity(confirm_activity);
        if(confirm_activity.questionInfos){
            getQuestionInfoConfirm(confirm_activity.questionInfos);
            if (confirm_activity.joinType == 0) {
                $('#questionnairesinfoconfirm_listView').append('\<div id="btn_add_calendar" class="btn_add_calendar" style="height: 36px; background-color: #a3bdad;font-size: 14px; color: #ffffff;margin: 20px 0px; line-height: 36px;text-align: center;">Add to calendar</div>');
            }
        } else {
            if (confirm_activity.joinType == 0) {
                $('#activityConfirm_list').append('\<div id="btn_add_calendar" class="btn_add_calendar" style="height: 36px; background-color: #a3bdad;font-size: 14px; color: #ffffff;margin: 20px 10px; line-height: 36px;text-align: center;">Add to calendar</div>');
            }
        }
        window.historyView = [];
    });

    $("#activityConfirm").on( "pagehide", function( event ) {
        $('#activityConfirm_list').empty();
        $('#questionnairesinfoconfirm_listView').empty();
    });

    return {
        showConfirmActivity: function(activity){
            confirm_activity = activity;
        },
        showConfirmNeedStr: function(needStr) {
            confirm_needStr = needStr;
        }
    }

});
