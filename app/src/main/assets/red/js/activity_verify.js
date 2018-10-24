/**
 * Created by Aimee on 14-11-12.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs', 'activity_confirm'], function($, m, net, dia, activityConfirm) {
    //保存对应报名注册的活动
    var m_activity_info = null;

    //保存需要确认的报名信息
    var m_activity_needStr = null;

    // 来自于某个页面
    var m_from_page = null;

    var callback_type = null;

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
        var need_info = m_activity_needStr;
//        need_info = value.enroll_need;
        console.assert(need_info != null, '必须有报名文本框显示 %o', need_info);
        var needArr = need_info.split('==');

        //获取活动
        var startDate = new Date(value.startTime * 1000);
        var endDate = new Date(value.endTime * 1000);
        var deadline = new Date(value.deadline * 1000);
        var startTime = 'Start: ' + pad(startDate.getHours(), 2) + ':' + pad(startDate.getMinutes(),2) + ', ' + startDate.getDate() + " " + getMonthString(startDate.getMonth()) + " " + startDate.getFullYear();
        var endTime = 'End: ' + pad(endDate.getHours(),2) + ':' + pad(endDate.getMinutes(),2) + ', ' + endDate.getDate() + " " + getMonthString(endDate.getMonth()) + " " + endDate.getFullYear();
        var venue = 'Venue: ' + value.venue;
        var deadlineTime = 'Deadline: ' + pad(deadline.getHours(),2) + ':' + pad(deadline.getMinutes(),2) + ', ' + deadline.getDate() + " " + getMonthString(deadline.getMonth()) + " " + deadline.getFullYear();

        var li = creatActivity(value.subject, startTime, endTime, venue, deadlineTime,needArr);
        $('#activityVerify_list').html(li);
    }

    //创建活动
    function creatActivity(subject, startTime, endTime, venue,deadlineTime, needArr) {
        var html_text = '';
        if(needArr != null){
//            var i = 0;
            $.each(needArr, function(index, val) {
                var nameArr = val.split(":");
                if(nameArr[1] == 'yes') {
                    html_text += html_text = '\<!--'+ nameArr[0] +'\-->\
                        <div style="width:100%;padding: 10px 10px 0px 10px">\
                        <div style="font-family: Arial;font-size: 14px;font-weight: normal;color: #404040">'+ nameArr[0] +'\</div>\
                        <div id="activityVerify_id" style="width: 100%;height: auto;font-family: Arial;font-size: 16px;font-weight: bold;color: #404040;">'+ nameArr[2] +'\</div>\
                    </div>';
//                    i++;
                } else if(nameArr[1] == 'no'){
                    html_text += html_text = '\<!--'+ nameArr[0] +'\-->\
                        <div style="width:100%;padding: 10px 10px 0px 10px">\
                        <div style="font-family: Arial;font-size: 14px;font-weight: normal;color: #404040;">'+ nameArr[0] +'\</div>\
                       <div id="activityVerify_id" style="width: 100%;height: auto;font-family: Arial;font-size: 16px;font-weight: bold;color: #404040;">'+ nameArr[2] +'\&nbsp;</div></div>';
//                    i++;
                } else {
                    console.error(false, '文本框只有必填和非必填两种可能');
                }
            });
        } else {
            console.assert(needArr != null, '文本框为空 %o', needArr);
        }

        var html = '\<li style="padding: 0px;">\
            <!--标题图-->\
            <div style="width:100%;  padding: 0; border: none;background-color: rgb(101,153,193);">\
                <div style="width:100%;padding: 20px 10px 10px 10px">\
                    <div style="white-space:normal;font-weight: normal;font-size: 18px;color: #ffffff;margin-bottom: 8px">'+ subject +'\</div>\
                    <div style="font-size: 11px;color: #ffffff;line-height: 18px;font-weight: normal">\
                        <span style="display: block">'+ startTime +'\</span>\
                        <span style="display: block">'+ endTime +'\</span>\
                        <span style="display: block">'+ venue +'\</span>\
                        <span style="display: block">'+ deadlineTime +'\</span>\
                    </div>\
                </div>\
            </div>\
             '+ html_text +'\
            \</li>';
        return html;
    }


    //返回到活动注册页面
    $('#activityVerify_btn_cancel').off('click')
        .on('click', function() {
//            $('#activityRegister_list li:first').empty();
            callback_type('cancel');

            if(m_activity_info.questionInfos){
                $.mobile.newChangePage('#questionnaires_activity',{ transition: "slide",reverse: true, changeHash:false});
            }
            else{
                $.mobile.newChangePage('#activityRegister',{ transition: "slide",reverse: true, changeHash:false});
            }
        });

    //返回活动注册页面 进行编辑
    $('#activityVerify_btn_edit').off('click')
        .on('click', function() {
//            activityRegister.edit(m_activity_info);
            callback_type('edit');
            if(m_activity_info.questionInfos){
                $.mobile.newChangePage('#questionnaires_activity',{ transition: "slide",reverse: true, changeHash:false});
            }
            else{
                $.mobile.newChangePage('#activityRegister',{ transition: "slide",reverse: true, changeHash:false});
            }
        });

    //跳转到活动确认页面

    $('#btn_activityVerify').off('click')
        .on('click', function() {
            var postData = {
                'activityId': m_activity_info.id,
                'app.enroll_info': m_activity_needStr
            };
            if(m_activity_info.answerAjax){
                postData = {
                    'activityId': m_activity_info.id,
                    'app.enroll_info': m_activity_needStr
                };
                $.each(m_activity_info.answerAjax,function(index,answer){
                    postData['app.answerRecords['+index+'].questionnaire_id'] =  answer.questionnaire_id;
                    postData['app.answerRecords['+index+'].question_id'] =  answer.question_id;
                    postData['app.answerRecords['+index+'].answer_id']=  answer.answer_id;
                    postData['app.answerRecords['+index+'].answer_text'] =  answer.answer_text;
                    postData['app.answerRecords['+index+'].user_id'] =  answer.user_id;
                });
            }
            net.post('activity/joinActivity', postData, function(error){
                // 启用按钮
//                $('#btn_active').attr("disabled",false);
            }, function(response){
                // 启用按钮
//                $('#btn_active').attr("disabled",false);
                if (response.code != 0) {
                    dia.alert('Confirmation',response.msg,['OK'],function(title) {

                    });
                } else {
//                    dia.alert('', response.msg, ['OK'], function(title) {
//
//                    });
//                    $('#btn_active').attr("disabled","disabled");
                    $.mobile.newChangePage('#activityConfirm', { transition: "slide", reverse: false, changeHash:false});
                    activityConfirm.showConfirmActivity(m_activity_info);
                    activityConfirm.showConfirmNeedStr(m_activity_needStr);
//                    $('#activityRegister_list li:first').empty();
                }
            });
        });

    //获取注册活动 基本信息
    function getQuestionInfoView(infos) {
        $('#questionnairesinfoview_listView li').remove();
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
                if(type == 1){
                    li = li+'\<div class="input_matrix"><div class="input_div " style="word-break: break-all;\
                            font-family: Arial; font-size: 16px; font-weight: bold; color: #404040; margin: 0; padding: 0;">\
                    '+questionInfo.selectResult+'<\/div></div></li>';
                }
                else if(type == 2 || type == 3){
                    var answers = questionInfo.answers;
                    var answersArr = [];
                    var inputType = "radio";
                    if(type == 3){
                        inputType = "checkbox";
                    }
                    $.each(answers,function(index,answerinfo){
                        var answer = answerinfo.answer;
                        var answerId = answerinfo.id;
                        var isDefault = answerinfo.selectResult;
                        if(isDefault == "Y" ){
                            var options = '\<div class="matrix" type="'+type+'" style="width: 100%;">\
                            \<div id="img_'+answerId+'"  >\
                            <label for="option_'+answerId+'\
                            "class="option_label" style="cursor: pointer;display: inline-block;word-break: break-all;\
                            font-family: Arial; font-size: 16px;font-weight: bold; color: #404040; margin: 0; padding: 0;">'+answer.substr(2,answer.length-1)+'\</label></div></div>';
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
        $('#questionnairesinfoview_listView').append(questionliArr.join(""));
    }

    $('#activityVerify').on('pageshow', function(event) {
        console.error("activityVerify");
        window.setBodyOverflow($(document.body));
        $('#activityVerify_content').css('height',($(window).height()-44-20));
        get_verifyAcvtivity(m_activity_info);
        if(m_activity_info.questionInfos){
            getQuestionInfoView(m_activity_info.questionInfos);
        }
        window.historyView = [];
    });

    $("#activityVerify").on( "pagehide", function( event ) {
        $('#activityVerify_list').empty();
        $('#questionnairesinfoview_listView').empty();
    });

    return {
        showActivity: function(activity_info) {
            m_activity_info = activity_info;
        },
        showNeedStr: function(activity_needStr) {
            m_activity_needStr = activity_needStr;
        },
//        from : function(fromPageName) {
//            m_from_page = fromPageName;
//        },
        edit: function(callback) {
            callback_type = callback;
        }
    }


});

