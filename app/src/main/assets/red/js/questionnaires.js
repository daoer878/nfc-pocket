/**
 * Created by testbetta1 on 15/9/18.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs', 'activity_confirm'], function($, m, net, dia, activityConfirm) {
    var q_activity = null;
    var questionInfos = null;
    //保存需要确认的报名信息
    var q_activity_needStr = null;

    var p_pageFrom = null;

    var p_backFrom = null;

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

    //获取注册活动 基本信息
    function getQuestionInfo(questioniInfos) {
        $('#questionnairesinfo_listView li').remove();
        var questionliArr = [];
        $.each(questioniInfos,function(index,questionInfo){
            var type = questionInfo.question_type;
            var question = questionInfo.question;
            var questionId = questionInfo.id;
            var requried = (questionInfo.is_required == "Y") ? "\<span style='color:#f26647;'>&nbsp;*</span>" : "" ;
            var li = '\<li  class="questionli" style="margin: 10px 0;padding:0px; border: none;" questionrequired="'+questionInfo.is_required+'"\
            id="'+questionId+'" questiontype="'+type+'"\><div  style="padding-bottom:10px;word-break: break-all;font-family: Arial; font-size: 14px;\
            font-weight: normal; color: #404040;" class="title">'+question+requried+'\</div>';
            if(type == 1){
                li = li+'\<div class="input_matrix"><div class="input_div " style="padding-bottom:10px;">\
                <input type="input" autocomplete="off" autocapitalize="off" autocorrect="off"  style="width:100%;height: 44px;font-family: Arial;font-size: 12px;font-weight:\
                bold;color: #404040;padding: 14px;border: solid 1px #D2D2D2;border-radius: 0px" name="question_'+questionId+'"/><\/div></div></li>';
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
                    var isDefault = answerinfo.is_default;
                    var checked = (isDefault == "Y") ? "checked=checked" : "";
                    var sel = (isDefault == "Y") ? "checked" : "";
                    var options = '\<div class="matrix" type="'+type+'" style="width: 100%;padding:5px 0;">\
                        \<div id="img_'+answerId+'" class="answerimg '+inputType+'\_div '+sel+'" >\
                        <input data-role="none" type="'+inputType+'\" '+checked+' name="question_'+questionId+'"\
                        value="'+answerId+'"id="option_'+answerId+'"\ style="display: none;"><label \
                        class="option_label" style="cursor: pointer;display: inline-block;word-break: break-all;\
                        font-family: Arial; font-size: 14px;color: #404040;margin: 0; padding: 0;">'+answer.substr(2,answer.length-1)+'\</label></div></div>';
                    answersArr.push(options);
                });
                li = li+answersArr.join("")+"\</li>";
            }
            questionliArr.push(li);
        });
        $('#questionnairesinfo_listView').append(questionliArr.join(""));
    }

    $('#btn_questionnaires_activityRegister').off('click').on('click',function() {

        p_backFrom = null;
        var questionlis =$("#questionnairesinfo_listView li");
        var emptyArr = [];
        $.each(questionlis,function(index,questionli){
            var questionId = $(this).attr("id");
            var questiontype = $(this).attr("questiontype");
            var required = $(this).attr("questionrequired");
            var answerVal = "";
            if(questiontype == 1){
                answerVal = $("input[name=question_"+questionId+"]").val();
            }
            else if($(this).find("div.answerimg.checked").size() > 0){
                answerVal = "Y";
            }
            if(required == "Y" && answerVal == ""){
                emptyArr.push(index+5);
            }
        });
        if(emptyArr.length > 0){
            dia.alert('Confirmation', "Please fill up all the mandatory fields.", ['OK'], function(title) {
             });
            return false;
        }
        else{
            var answerArr = [];
            $.each(questionlis,function(index,questionli){
                var answer = {};
                var questionId = $(this).attr('id');
                answer.questionnaire_id = q_activity.id;
                answer.user_id = q['user'].userId;
                answer.question_id =  questionId;
                if(questionInfos[index].question_type == 1){
                    answer.answer_text =  $("input[name=question_"+questionId+"]").val();
                    answer.answer_id =  "";
                    questionInfos[index].selectResult = $("input[name=question_"+questionId+"]").val();
                }
                else{
                    var answerimgs = $(this).find("div.matrix div.answerimg");
                    var answerIdArr = [];
                    var answerTextArr = [];
                    $.each(answerimgs,function(indexAnswer,answerimg){
                        if($(answerimg).hasClass("checked")){
                            questionInfos[index].answers[indexAnswer].selectResult  = "Y";
                            answerIdArr.push( $(answerimg).find("input").val());
                            answerTextArr.push($(answerimg).find("label").html());
                        }
                        else{
                            questionInfos[index].answers[indexAnswer].selectResult = "N";
                        }
                    });
                    if(answerTextArr.length > 0){
                        answer.answer_text = answerTextArr.join(",");
                    }
                    if(answerIdArr.length > 0){
                        answer.answer_id = answerIdArr.join(",");
                    }
                }
                answerArr.push(answer);
            });
            q_activity.answerAjax = answerArr;
            q_activity.questionInfos = questionInfos;
            var needStr="";
            var activity_enroll_need = q_activity.enroll_need;
            var needInfo = activity_enroll_need.split('==');
            var i = 0,
                tipsArr = [];
            $.each(needInfo, function(index, val) {
                var text_val=$('#questionnaires_activity_txt_id_'+ i +'_').val(),
                    text_key = $('#questionnaires_activity_txt_id_'+ i +'_').prev('div').text();
                text_key = text_key.trim();
                if(text_val==null || text_val=="" || text_val==undefined){
                    text_val=" ";
                    tipsArr.push(text_key.substring(0, (text_key.length - 1)));
                }
                var name_isNotNulls  =  needInfo[index].split(":");
                if(name_isNotNulls!=null && name_isNotNulls!="" && name_isNotNulls!=undefined){
                    needStr+=needInfo[index]+":"+text_val+"==";
                }
                i++;
            });
            if (tipsArr.length !== 0) {
                dia.alert('Oops',tipsArr.join(',') + 'is reqiured, please refine your information!', ['OK'], function () {
                    $('#profile').attr('js-pagefrom', 'clubActiveDetails');
                    
                    $('#profile-edit').click();
                    $.mobile.changePage('#profile', { transition: "slide", reverse: false, changeHash:false});
                });
                return false;
            }

            needStr=needStr.substring(0,needStr.length-2);
            q_activity_needStr = needStr;
            var postData = {
                'activityId': q_activity.id,
                'app.enroll_info': needStr
            };
            if(q_activity.answerAjax){
                postData = {
                    'activityId': q_activity.id,
                    'app.enroll_info': needStr
                };
                $.each(q_activity.answerAjax,function(index,answer){
                    postData['app.answerRecords['+index+'].questionnaire_id'] =  answer.questionnaire_id;
                    postData['app.answerRecords['+index+'].question_id'] =  answer.question_id;
                    postData['app.answerRecords['+index+'].answer_id']=  answer.answer_id;
                    postData['app.answerRecords['+index+'].answer_text'] =  answer.answer_text;
                    postData['app.answerRecords['+index+'].user_id'] =  answer.user_id;
                });
            }
            net.post('activity/joinActivity', postData, function(error){
            }, function(response){
                if (response.code != 0) {
                    dia.alert('Confirmation',response.msg,['OK'],function(title) {

                    });
                } else {
                    activityConfirm.showConfirmActivity(q_activity);
                    activityConfirm.showConfirmNeedStr(q_activity_needStr);
                    $.mobile.newChangePage('#activityConfirm', { transition: "slide", reverse: false, changeHash:false});
                }
            });
        }

    });


    $('#questionnaires_activity').off('tap','div.matrix').on('tap','div.matrix',function() {
        var type = $(this).attr("type");
        if($(this).find(".answerimg").hasClass("checked")){
            if(type == 3){
                $(this).find(".answerimg").removeClass("checked");
                $(this).find(".answerimg input").removeAttr("checked");
            }
        }
        else{
            if(type == 2){
                $(this).parent().find("div.matrix .answerimg").removeClass("checked");
                $(this).parent().find("div.matrix .answerimg input").removeAttr("checked");
            }
            $(this).find(".answerimg").addClass("checked");
            $(this).find(".answerimg input").attr("checked","checked");
        }
    });

    //获取注册活动 基本信息
    function getAcvtivitiesInfo(activity) {
        var value = activity;

        //解析报名信息
        var need_info = null;
        need_info = value.enroll_need;
        var needArr = need_info.split('==');


        if ($('#activityinfo_listView li').length != 0) {
            $('#activityinfo_listView li').remove();
        }
        //获取活动
        var startDate = new Date(value.startTime * 1000);
        var endDate = new Date(value.endTime * 1000);
        var deadline = new Date(value.deadline * 1000);
        var startTime = 'Start: ' + pad(startDate.getHours(), 2) + ':' + pad(startDate.getMinutes(),2) + ', ' + startDate.getDate() + " " + getMonthString(startDate.getMonth()) + " " + startDate.getFullYear();
        var endTime = 'End: ' + pad(endDate.getHours(),2) + ':' + pad(endDate.getMinutes(),2) + ', ' + endDate.getDate() + " " + getMonthString(endDate.getMonth()) + " " + endDate.getFullYear();
        var venue = 'Venue: ' + value.venue;
        var deadlineTime = 'Deadline: ' + pad(deadline.getHours(),2) + ':' + pad(deadline.getMinutes(),2) + ', ' + deadline.getDate() + " " + getMonthString(deadline.getMonth()) + " " + deadline.getFullYear();

        var li = creatActivityInfo(value.subject, startTime, endTime, venue,deadlineTime, needArr);
        $('#activityinfo_listView').html(li);
    }

    function valueForIndex(item) {
        var cuser = null;
        if (localStorage.getItem('login_user')!=null) {
            cuser = JSON.parse(localStorage.getItem('login_user'));
        } else {
            console.assert(false, '还没登录，没有用户信息可填写');
        }

        if (item == 'Staff ID') {
            return cuser.staffId;
        } else if (item == 'English name') {
            return cuser.english_name;
        } else if (item == 'Chinese name') {
            return cuser.chinese_name;
        } else if (item == 'LN') {
            return cuser.email;
        } else if (item == 'Gender') {
            return cuser.gender;
        } else if (item == 'ID card No') {
            return cuser.i_d_card;
        } else if (item == 'Telephone') {
            return cuser.telephone;
        }

        return null;
    }
//    function checkMobile(){
//        var sMobile = $("#questionnaires_activity_txt_id_3_").val();
//        if(!(/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(sMobile))){
//            return true;
//        }
//        return false;
//    }
    //创建活动
    function creatActivityInfo(subject, startTime, endTime, venue,deadlineTime, needArr) {
        var html_text = '';
        if(needArr != null){
            var i = 0;
            $.each(needArr, function(index, val) {
                var nameArr = val.split(":");
                var nameValue = nameArr[0];
                if(nameValue == "Lotus Notes"){
                    nameValue = "LN";
                }
                if(nameArr[1] == 'yes') {
                    var fValue = valueForIndex(nameValue) != null ? valueForIndex(nameValue) : "";
                    if (index < 4) {
                        html_text += html_text = '<!--'+ nameValue +'\-->\
                                    <div style="border: none; height: 12px; line-height: 12px; margin:10px 10px 0px 10px;">\
                                        <div style="font-family: Arial; font-size: 14px; font-weight: normal; color: #404040; float: left">'+ nameValue +': \</div>\
                                        \<input  id="questionnaires_activity_txt_id_'+ i +'\_" type="hidden"  value="'+fValue+'"/>\
                                        \<div style="font-family: Arial; font-size: 14px; color: #404040; border-radius: 0px; float: left;">'+fValue+'</div>\
                                    </div>';
                    } else {
                        html_text += html_text = '<!--'+ nameValue +'\-->\
                                    <div style="border: none; height: 12px; line-height: 12px; margin:10px 10px 0px 10px;">\
                                        <div style="font-family: Arial; font-size: 14px; font-weight: normal; color: #404040; float: left">'+ nameValue +': \</div>\
                                        \<input  id="questionnaires_activity_txt_id_'+ i +'\_" type="hidden"  value="'+fValue+'"/>\
                                        \<div style="font-family: Arial; font-size: 14px; color: #404040; border-radius: 0px; float: left;">'+fValue+'</div>\
                                    </div>';
                    }

                    i++;
                } else if(nameArr[1] == 'no'){
                    html_text += html_text = '<!--'+ index +'\-->\
                                    <div style="border: none; height: 12px; line-height: 12px; margin:10px 10px 0px 10px;">\
                                        <div style="font-family: Arial; font-size: 14px; font-weight: normal; color: #404040; float: left">'+ nameValue +': \</div>\
                                         \<input  id="questionnaires_activity_txt_id_'+ i +'\_" type="hidden"  value="'+fValue+'"/>\
                                      </div>';
                    i++;
                } else {
                    console.error(false, '文本框只有必填和非必填两种可能');
                }
            });
        } else {
            console.assert(needArr != null, '文本框为空 %o', needArr);
        }

        var html = '\<li style="padding: 0px;">\
            <!--标题图-->\
            <div style="width:100%;  padding: 0; border: none;background-color: rgb(101,153,193); margin-bottom: 20px;">\
                <div style="width:100%;padding: 20px 10px 10px 10px">\
                    <div style="white-space:normal;font-weight: normal;font-size: 18px;color: #ffffff;margin-bottom: 8px">'+ subject +'\</div>\
                    <div style="font-size: 11px;color: #ffffff;line-height: 18px;font-weight: normal">\
                        <span style="display: block;white-space:normal;">'+ startTime +'\</span>\
                        <span style="display: block;white-space:normal;">'+ endTime +'\</span>\
                        <span style="display: block;white-space:normal;">'+ venue +'\</span>\
                    </div>\
                </div>\
            </div>\
             '+ html_text +'\
            \</li>';
        return html;
    }

    //返回 显示所有活动的页面
    $('#questionnaires_activity_btn_back').off('click')
        .on('click',function() {
            p_backFrom == null;
            $.mobile.backChangePage(p_pageFrom, { transition: "slide", reverse: true, changeHash:false});
        });
    $('#questionnaires_activity_content').on('swiperight',function() {
        p_backFrom == null;
        $.mobile.backChangePage(p_pageFrom, { transition: "slide", reverse: true, changeHash:false});
    });

    $('#questionnaires_activity').on('pageshow', function(event) {
        console.error("#questionnaires_activity");
        window.setBodyOverflow($(document.body));
        $('#questionnaires_activity_content').css('height',($(window).height()-44-20));
        $('#questionnaires_content_info').css('min-height',($(window).height()-44-20));

        if (p_pageFrom == '#newsroom' ||
            p_pageFrom == '#video_detailed' ||
            p_pageFrom == '#clubActiveDetails') {
            if (p_backFrom == null){
                getQuestionInfo(questionInfos);
                getAcvtivitiesInfo(q_activity);
            }
        }
        var postSaveLogData = {};
        var module = "Other";
        if(p_pageFrom != null && p_pageFrom != ""){
            module = p_pageFrom.substr(1,p_pageFrom.length);
        }
        postSaveLogData['log.contentId'] = q_activity.id;
        postSaveLogData['log.module'] = module;
        postSaveLogData['type'] = "activity";
        net.post('log/saveLog', postSaveLogData, function (error) {
            },
            function (response) {
                if (response.code != 0) {

                }
                else {
                }
            });
        // window.historyView = [];
    });

    $("#questionnaires_activity").on( "pagehide", function( event ) {
        p_backFrom = null;
    });

    return {
        setAcvtivities: function (info) {
            q_activity = info.acvtivitie;
            questionInfos = info.question_infos;
        },
        from: function(pageFrom) {
            p_pageFrom = pageFrom;
            window.pageFrom = pageFrom;//add for register activity confirm page ok button back action
        }
    }
});
