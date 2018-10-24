/**
 * Created by testbetta1 on 16/1/14.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs'], function($, m, net, dia) {

    var confirm_survey = null;
    var back_page = null;

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

    function get_confirmSurvey(survey) {
        var li = creatsurvey(survey.subject, survey.banner, survey.briefContent,survey.currentStatus,survey.frompage,survey.survey_id);
        $('#surveyConfirm_list').html(li);
    }

    //创建活动
    function creatsurvey(subject, banner, content,currentStatus,frompage,surveyId) {
        var statusHtml = '\<div class="information_icon" style="color:#444;border: 1px solid #ccc; margin: 10px;height:\
        auto; padding: 10px 10px 10px 50px;">You have already responded to this\
        survey. Thank you for your participation.</div>';
        if(currentStatus && currentStatus == "going"){
            statusHtml = '\<div class="confirmation_icon" style="color:#444;border: 1px solid #ccc;margin: 10px;height:\
        auto; padding: 10px 10px 10px 50px; ">Thank you for your participation.</div>';

        }
        var html = '\<li  id="survey_confirm_top" surveyid="'+surveyId+'"\ frompage="'+frompage+'"\ style="border: 0px;padding: 0px;margin-bottom:10px"><div>\
        <div style="width: 100%;position:relative; " ><img src="'+banner+'"\ style="width: 100%" alt=""/>\
        <label style="position:absolute; bottom:-3px; left:0;font-size: 18px;color: #fff;background:#000;opacity: 0.5;width: 100%; font-weight:bold; padding:6px 10px;text-shadow: none;\
        overflow:hidden;display:-webkit-box;word-break:break-word;-webkit-line-clamp:2;-webkit-box-orient:vertical;text-overflow:ellipsis;line-height:1.5;word-wrap: break-word; white-space:pre-line;">'+subject+'\</label>\
        </div>'+statusHtml+'\</li>';

        return html;
    }

    //返回到活动注册页面
    $('#surveyConfirm_btn_ok').off('click')
        .on('click', function() {
            var frompage = $("#survey_confirm_top").attr("frompage");

            if(typeof(frompage) == "undefined" || frompage == "undefined" || frompage == "#newsroom"){
                frompage = "#club";
            }
            var surveyid = $("#survey_confirm_top").attr("surveyid");
            if($("li#"+surveyid+" .li_nowSurvey").size()){
                $("li#"+surveyid+" .li_nowSurvey").addClass("registered");
            }
            $.mobile.newChangePage(frompage,{ transition: "slide",reverse: true, changeHash:false});
        });


    //获取注册活动 基本信息
    function getQuestionInfoConfirm(infos) {
        $('#survey_questionnairesconfirm_listView li').remove();
        var questioniInfos = infos.questions;
        var questionliArr = [];
        $.each(questioniInfos,function(index,questionInfo){
            var type = questionInfo.question_type;
            var question = questionInfo.question;
            var questionId = questionInfo.id;
//          var requried = (questionInfo.is_required == "Y") ? "\<span style='color:#f26647;'>&nbsp;*</span>" : "" ;
            var li = '\<li class="questionli" style="margin: 20px 0;padding:0px; border: none;" required="'+questionInfo.is_required+'"\
            id="'+questionId+'" questiontype="'+type+'"\><div  style="word-break: break-word;font-family: Arial; font-size: 14px;\
            font-weight: bold;  color: #404040;word-wrap: break-word; white-space:pre-line;" class="title">'+question+'\</div>';
            if (type == 1) {
                li = li + '\<div class="input_matrix" style="margin: 10px 0;"><div class="input_div" style="word-break: break-word;\
                font-family: Arial; font-size: 16px; color: #404040; margin: 0; padding: 0;word-wrap: break-word; white-space:pre-line;">\
                <span style="color: #666699; font-weight:bold;" >My response:</span>' + ((questionInfo.answerText)?(questionInfo.answerText): "")+ '<\/div>\
                <div style="font-style:italic; color:#676767;font-size:12px;font-family:Arial;margin:10px 0;">Total '+questionInfo.totleNum+'\ responses</div></div></li>';
            }
            else if (type == 2 || type == 3) {
                var answers = questionInfo.answers;
                var answersArr = [];
                var answerIds = (questionInfo.answerIds)?((questionInfo.answerIds).split(",")):[];
                $.each(answers, function (index, answerinfo) {
                    var answer = answerinfo.answer;
                    var answerId = answerinfo.id;
                    var checkImgHtml = "";
                    if (answerIds.indexOf(answerId.toString()) != -1) {
                        checkImgHtml = "checkimg";
                    }
                    var options = '\<div class="matrix" type="' + type + '" style="width: 100%;margin:10px 0;">\
                        \<div id="img_' + answerId +'" class="'+ checkImgHtml+'\ "> \<div style="cursor: pointer;word-break: break-word;\
                        font-family: Arial; font-size: 16px; color: #404040; margin: 0; padding: 0;width:75%;word-wrap: break-word; white-space:pre-line;">' + answer + '\</div></div>\
                        <div style="width: 100%; height: 20px;"><div style="width:180px;background: #fff;float: left"><div style="background: #666699; width:'+(parseFloat(answerinfo.answerPercent)*100).toFixed(1) +'\%; height: 20px;\
                        position: relative;"><span style="position: absolute;left:100%;'+(((parseFloat(answerinfo.answerPercent)*100).toFixed(1) == 0 )? "" : "padding-left:5px;")+'font-weight: bold;color:#676767;font-size:14px;font-family:Arial;">'+((answerinfo.totleNum.length) > 4 ? (parseInt(answerinfo.totleNum/1000)+'k') :answerinfo.totleNum )+'\</span></div></div><div style="width: 30%;\
                        float: right;text-align: right;color: #666699;font-weight: bold;">'+(parseFloat(answerinfo.answerPercent)*100).toFixed(1) +'\%</div></div></div>';
                    answersArr.push(options);
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
        });
        $('#survey_questionnairesconfirm_listView').append(questionliArr.join(""));
    }

    $('#surveyConfirm').off( "pageshow").on('pageshow', function(event) {
        console.error("#surveyConfirm");
        window.setBodyOverflow($(document.body));
        $('#surveyConfirm_content').css('height',($(window).height()-44-20));
        $('#surveyConfirm_content_info').css('min-height',($(window).height()-60-4));
        // window.historyView = [];
    });

    $("#surveyConfirm").off( "pagehide").on( "pagehide", function( event ) {
        $('#surveyConfirm_list').empty();
        $('#survey_questionnairesconfirm_listView').empty();
    });

    return {
        showConfirmSurvey: function(survey){
            confirm_survey = survey;
            if(confirm_survey != null){
                net.post('survey/searchStatistics',  {
                    'survey_id': confirm_survey.survey_id,
                    'userId' :q['user'].userId
                }, function(error){
                    $('#survey_questionnairesconfirm_listView').html('\<div style="color:#888;padding-top:50px;text-align:center;">The result of this survey is not available for public.</div>');
                }, function(response){
                    if (response.code != 0) {
                        $('#survey_questionnairesconfirm_listView').html('\<div style="color:#888;padding-top:50px;text-align:center;">The result of this survey is not available for public.</div>');
                    } else {
                        var surveyStatis = response.data.survey;
                        surveyStatis.frompage = confirm_survey.frompage;
                        surveyStatis.currentStatus = confirm_survey.currentStatus;
                        get_confirmSurvey(surveyStatis);
                        if(confirm_survey.is_show == "Y") {
                            getQuestionInfoConfirm(surveyStatis);
                        }
                        else{
                            $('#survey_questionnairesconfirm_listView').html('\<div style="color:#888;padding-top:50px;text-align:center;">The result of this survey is not available for public.</div>');
                        }
                    }
                });
            }
        },
        backPage:function(backPage){
            if (backPage == "#newsroom"){
                var postSaveLogData = {};
                postSaveLogData['log.contentId'] = confirm_survey.survey_id;
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
            back_page = backPage;
        }
    }
});
