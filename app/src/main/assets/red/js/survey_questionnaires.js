/**
 * Created by testbetta1 on 16/1/14.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs', 'survey_confirm'], function($, m, net, dia, surveyConfirm) {
    var qustion_query = null;
    var questionInfos = null;
    //保存需要确认的报名信息
    var qustion_query_needStr = null;

    var p_pageFrom = null;

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
        $('#survey_questionnairesinfo_listView li').remove();
        var questionliArr = [];
        $.each(questioniInfos,function(index,questionInfo){
            var type = questionInfo.question_type;
            var question = questionInfo.question;
            var banner = questionInfo.banner;
            var questionId = questionInfo.id;
            var min_opt = questionInfo.minopt;
            var max_opt = questionInfo.maxopt;
            var bannerHtml = "";
            if(banner){
                bannerHtml = '<img src="'+banner+'" style="width:100%;margin-bottom:9px;"/>';
            }
            var warnCSS = "";
            if(bannerHtml != "" || type == 1){
                warnCSS = "margin-bottom:10px;";
            }
            var requried = (questionInfo.is_required == "Y") ? "\<span style='color:#f26647;'>&nbsp;*</span>" : "" ;
            var li = '\<li  class="questionli" style="margin: 10px 0;padding:0px; border: none;" questionrequired="'+questionInfo.is_required+'"\
            id="'+questionId+'" questiontype="'+type+'"  max_opt="'+max_opt+'"  min_opt="'+min_opt+'"\><div  style="padding-bottom:10px;word-break: break-word;font-family: Arial; font-size: 14px;\
            font-weight: normal; white-space:pre-line;word-wrap: break-word;color: #404040;font-weight: bold;" class="title">'+question+requried+'\</div>';
            if(type == 1){
                li = li+'<div class="warning_icon warninginfo" \
                style="'+warnCSS+'"\>Please respond to this mandatory field</div>'+bannerHtml+'\<div class="input_matrix"><div class="input_div " style="padding-bottom:10px;">\
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
                var warninfo = "";
                var messageinfo = "Please respond to this mandatory field";
                if(type == 3 && questionInfo.is_required == 'Y' && max_opt != 0){
                    if(min_opt == max_opt){
                        messageinfo = "Please select "+max_opt+" options";
                    }
                    else{
                        messageinfo = "Please select "+min_opt +"-"+ max_opt+" options";
                    }
                    warninfo = '<div class="warning_icon msginfo" \style="'+warnCSS+'"\>'+messageinfo+'\</div>';
                }
                else{
                    warninfo = '<div class="warning_icon warninginfo" \style="'+warnCSS+'"\>'+messageinfo+'\</div>';
                }
                $.each(answers,function(index,answerinfo){
                    var answer = answerinfo.answer;
                    var answerId = answerinfo.id;
                    var isDefault = answerinfo.is_default;
                    var checked = (isDefault == "Y") ? "checked=checked" : "";
                    var sel = (isDefault == "Y") ? "checked" : "";
                    var options = '\<div class="matrix" type="'+type+'" style="width: 100%;margin-bottom:20px;">\
                        \<div id="img_'+answerId+'" class="answerimg '+inputType+'\_div '+sel+'" >\
                        <input   data-role="none" type="'+inputType+'\" '+checked+' name="question_'+questionId+'"\
                        value="'+answerId+'"id="option_'+answerId+'"\ style="display: none;"><label \
                        class="option_label" style="cursor: pointer;display: inline-block;white-space:pre-line;word-wrap: break-word;text-shadow: none;word-break: break-word;\
                        font-family: Arial; font-size: 14px;color: #404040;margin: 0; padding: 0;">'+answer+'\</label></div></div>';
                    answersArr.push(options);
                });
                li = li+warninfo+bannerHtml+answersArr.join("")+'\</li>';
            }
            questionliArr.push(li);
        });
        $('#survey_questionnairesinfo_listView').append(questionliArr.join(""));
    }
    //防止重复提交
    var isSubmit=false;
    $('#btn_questionnaires_survey').off('click').on('click',function() {
        if(isSubmit){
            return false;
        }
        isSubmit=true;
        $("li .warning_icon").hide();
        var questionlis =$("#survey_questionnairesinfo_listView li");
        var emptyArr = [];
        var firstIndex = null;
        $.each(questionlis,function(index,questionli){
            var questionId = $(this).attr("id");
            var questiontype = $(this).attr("questiontype");
            var required = $(this).attr("questionrequired");
            var min_opt = parseInt($(this).attr("min_opt"));
            var max_opt = parseInt($(this).attr("max_opt"));
            var answerVal = "";
            if(required == "Y"){
                if(questiontype == 1){
                    answerVal = $("input[name=question_"+questionId+"]").val();
                }
                else if ($(this).find("div.answerimg.checked").size() == 0) {
                    $("li#" + questionId + " .warning_icon").html("Please respond to this mandatory field").removeClass("msginfo").addClass("warninginfo").show();
                }
                else{
                    answerVal = "Y";
                    if(questiontype == 3){
                        if(($(this).find("div.answerimg.checked").size() >= min_opt &&((max_opt == 0)|| $(this).find("div.answerimg.checked").size() <= max_opt))){
                            answerVal = "Y";
                            if(max_opt != 0 ){
                                if(min_opt == max_opt){
                                    $("li#"+questionId+" .warning_icon").html("Please select "+max_opt+" options").removeClass("warninginfo").addClass("msginfo").show();
                                }
                                else{
                                    $("li#"+questionId+" .warning_icon").html("Please select "+min_opt +"-"+ max_opt+" options").removeClass("warninginfo").addClass("msginfo").show();
                                }
                            }
                        }
                        else{
                            answerVal = "";
                            if(min_opt == max_opt){
                                $("li#"+questionId+" .warning_icon").html("Please select "+max_opt+" options").removeClass("msginfo").addClass("warninginfo").show();
                            }
                            else if($(this).find("div.answerimg.checked").size() < min_opt){
                                $("li#"+questionId+" .warning_icon").html("Please select at least "+min_opt+" options").removeClass("msginfo").addClass("warninginfo").show();
                            }
                            else if($(this).find("div.answerimg.checked").size() > max_opt){
                                $("li#"+questionId+" .warning_icon").html("Please select no more than "+max_opt+" options").removeClass("msginfo").addClass("warninginfo").show();
                            }
                        }
                    }
                }
            }
            if(required == "Y" && answerVal == ""){
                if(firstIndex == null){
                    firstIndex = questionId;
                }
                $("li#"+questionId+" .warning_icon").show();
                emptyArr.push(index);
            }
        });
        if(emptyArr.length > 0){
            $("#survey_questionnaires_content").scrollTop(parseInt($("#"+firstIndex).offset().top+$("#survey_questionnaires_content").scrollTop()-45));
            isSubmit=false;
            return false;
        }
        else{
            var answerArr = [];
            var question_survey_page = $("#surveyinfo_listView li");
            var surveyid = question_survey_page.attr("surveyid");
            var isshow = question_survey_page.attr("isshow");
            var frompage = question_survey_page.attr("frompage");

            $.each(questionlis,function(index,questionli){
                var answer = {};
                var questionId = $(this).attr('id');
                var questiontype = $(this).attr("questiontype");
                answer.questionnaire_id = surveyid;
                answer.user_id = q['user'].userId;
                answer.question_id =  questionId;
                if(questiontype == 1){
                    answer.answer_text =  $("input[name=question_"+questionId+"]").val();
                    answer.answer_id =  "";
                }
                else{
                    var answerimgs = $(this).find("div.matrix div.answerimg");
                    var answerIdArr = [];
                    var answerTextArr = [];
                    $.each(answerimgs,function(indexAnswer,answerimg){
                        if($(answerimg).hasClass("checked")){
                            answerIdArr.push( $(answerimg).find("input").val());
                            answerTextArr.push($(answerimg).find("label").html());
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
            var postData = {};
            postData['user_id'] =  q['user'].userId;
            postData['survey_id'] = surveyid;
            if(answerArr){
                $.each(answerArr,function(index,answer){
                    postData['survey.surveyRecords['+index+'].survey_id'] =  answer.questionnaire_id;
                    postData['survey.surveyRecords['+index+'].question_id'] =  parseInt(answer.question_id);
                    postData['survey.surveyRecords['+index+'].answer_id']=  answer.answer_id;
                    postData['survey.surveyRecords['+index+'].answer_text'] =  answer.answer_text;
                    postData['survey.surveyRecords['+index+'].user_id'] =  answer.user_id;
                });
            }

            net.post('survey/saveSurveyRecord', postData, function(error){
            }, function(response){
                if (response.code != 0) {
                    dia.alert('Confirmation',response.msg,['OK'],function(title) {

                    });
                } else {
                    surveyConfirm.showConfirmSurvey({"survey_id": surveyid,"is_show": isshow,"currentStatus":"going","frompage":frompage});
                    $.mobile.newChangePage('#surveyConfirm', { transition: "slide", reverse: false, changeHash:false});
                }
                isSubmit=false;
            });
        }
    });


    // $('#questionnaires_survey').off('tap','div.matrix').on('tap','div.matrix',function() {
    //     var type = $(this).attr("type");
    //     console.error($(this).find("label").html());
    //     if($(this).find(".answerimg").hasClass("checked")){
    //         if(type == 3){
    //             $(this).find(".answerimg").removeClass("checked");
    //             $(this).find(".answerimg input").removeAttr("checked");
    //         }
    //     }
    //     else{
    //         if(type == 2){
    //             $(this).parent().find("div.matrix .answerimg").removeClass("checked");
    //             $(this).parent().find("div.matrix .answerimg input").removeAttr("checked");
    //         }
    //         $(this).find(".answerimg").addClass("checked");
    //         $(this).find(".answerimg input").attr("checked","checked");
    //     }
    // });

    $('#questionnaires_survey').off('tap','div.matrix').on('tap','div.matrix',function() {
        var type = $(this).attr("type");
        console.error($(this).find("label").html());
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
    function getSurveyInfo(survey) {
        if ($('#surveyinfo_listView li').length != 0) {
            $('#surveyinfo_listView li').remove();
        }
        var li = creatsurveyInfo(survey.subject, survey.banner,survey.briefContent,survey.survey_id,survey.is_show,survey.frompage,survey.backpage);
        $('#surveyinfo_listView').html(li);
    }

    function valueForIndex(index) {
        var cuser = null;
        if (localStorage.getItem('login_user')!=null) {
            cuser = JSON.parse(localStorage.getItem('login_user'));
        } else {
            console.assert(false, '还没登录，没有用户信息可填写');
        }

        if (index == 0) {
            return cuser.staffId;
        } else if (index == 1) {
            return cuser.english_name;
        } else if (index == 2) {
            return cuser.chinese_name;
        }else if (index == 3) {
            return cuser.email;
        }

        return null;
    }
//    function checkMobile(){
//        var sMobile = $("#questionnaires_survey_txt_id_3_").val();
//        if(!(/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(sMobile))){
//            return true;
//        }
//        return false;
//    }
    //创建活动
    function creatsurveyInfo(subject, banner, content,id,isshow,frompage,backpage) {
        var html = '\<li  style="border: 0px;padding: 0px;margin-bottom:10px"  frompage="'+frompage+'" backpage="'+backpage+'"   isshow="'+isshow+'" surveyid="'+id+'"\ ><div>\
        <div style="width: 100%;position:relative; " ><img src="'+banner+'"\ style="width: 100%" alt=""/>\
        <label style="position:absolute; bottom:-3px; left:0;font-size: 15px;color: #fff;background:#000;opacity: 0.8;width: 100%; font-weight:bold; padding:6px 10px;text-shadow: none;\
        overflow:hidden;display:-webkit-box;word-break:break-word;-webkit-line-clamp:2;-webkit-box-orient:vertical;text-overflow:ellipsis;line-height:1.5; white-space:pre-line;word-wrap: break-word;">'+subject+'\</label>\
        </div>\
        <div style="margin: 10px">\
            <div style="white-space:normal;font-weight: normal;font-size: 12px;color: #404040;word-break: break-word;">'+content.replace(/\n/g,'</br>')+'\</div>\
        </div></li>';
        return html;
    }

    //返回 显示所有活动的页面
    $('#questionnaires_survey_btn_back').off('click')
        .on('click',function() {
            $.mobile.backChangePage($("#surveyinfo_listView li").attr("backpage"), { transition: "slide", reverse: true, changeHash:false});
        });
    $('#survey_questionnaires_content').on('swiperight',function() {
        $.mobile.backChangePage($("#surveyinfo_listView li").attr("backpage"), { transition: "slide", reverse: true, changeHash:false});
    });


    $('#questionnaires_survey').off( "pageshow").on('pageshow', function(event) {
        console.error("#questionnaires_survey");
        window.setBodyOverflow($(document.body));
        $('#survey_questionnaires_content').css('height',($(window).height()-44-20));
        if ($("#surveyinfo_listView li").attr("backpage") == "#newsroom"){
            var postSaveLogData = {};
            postSaveLogData['log.contentId'] = $("#surveyinfo_listView li").attr("surveyid");
            postSaveLogData['log.module'] = "Newsroom";
            postSaveLogData['type'] = "survey";
            net.post('log/saveLog', postSaveLogData, function (error) {
            },
            function (response) {
                if (response.code != 0) {
                }
                else {
                }
            });
        }
        // window.historyView = [];
    });

    $("#questionnaires_survey").off( "pagehide").on( "pagehide", function( event ) {
        $("#surveyinfo_listView").empty();
        $("#survey_questionnairesinfo_listView").empty();
    });

    return {
        setAcvtivities: function (info) {
            qustion_query = info.survey;
            questionInfos = info.question_infos;
            getQuestionInfo(questionInfos);
            getSurveyInfo(qustion_query);
        },
        from: function(pageFrom) {
            p_pageFrom = pageFrom;
        }
    }
});
