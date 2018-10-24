/**
 * Created by Aimee on 14-11-10.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs','activity_confirm'], function($, m, net, dia, activityConfirm) {


        var m_activity = null;

    //保存需要确认的报名信息
    var m_activity_needStr = null;

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
    function getAcvtivities(activity) {
        var value = activity;

        //解析报名信息
        var need_info = null;
        need_info = value.enroll_need;
        console.assert(need_info != null, '必须有报名文本框显示 %o', need_info);
        var needArr = need_info.split('==');


        if ($('#activityRegister_list li').length != 1) {
            $('#activityRegister_list li:first').remove();
        }
        //获取活动
        var startDate = new Date(value.startTime * 1000);
        var endDate = new Date(value.endTime * 1000);
        var deadline = new Date(value.deadline * 1000);
        var startTime = 'Start: ' + pad(startDate.getHours(), 2) + ':' + pad(startDate.getMinutes(),2) + ', ' + startDate.getDate() + " " + getMonthString(startDate.getMonth()) + " " + startDate.getFullYear();
        var endTime = 'End: ' + pad(endDate.getHours(),2) + ':' + pad(endDate.getMinutes(),2) + ', ' + endDate.getDate() + " " + getMonthString(endDate.getMonth()) + " " + endDate.getFullYear();
        var venue = 'Venue: ' + value.venue;
        var deadlineTime = 'Deadline: ' + pad(deadline.getHours(),2) + ':' + pad(deadline.getMinutes(),2) + ', ' + deadline.getDate() + " " + getMonthString(deadline.getMonth()) + " " + deadline.getFullYear();

        var li = creatActivity(value.subject, startTime, endTime, venue,deadlineTime, needArr);
        $(li).insertBefore($('#activityRegister_list li:first'));
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
//        var sMobile = $("#activityRegister_txt_id_3_").val();
//        if(!(/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(sMobile))){
//            return true;
//        }
//        return false;
//    }
    //创建活动
    function creatActivity(subject, startTime, endTime, venue,deadlineTime, needArr) {
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
                                        \<input  id="activityRegister_txt_id_'+ i +'\_" type="hidden"  value="'+fValue+'"/>\
                                        \<div style="font-family: Arial; font-size: 14px; color: #404040; border-radius: 0px; float: left;">'+fValue+'</div>\
                                    </div>';
                    } else {
                        html_text += html_text = '<!--'+ nameValue +'\-->\
                                    <div style="border: none; height: 12px; line-height: 12px; margin:10px 10px 0px 10px;">\
                                        <div style="font-family: Arial; font-size: 14px; font-weight: normal; color: #404040; float: left">'+ nameValue +': \</div>\
                                        \<input  id="activityRegister_txt_id_'+ i +'\_" type="hidden"  value="'+fValue+'"/>\
                                        \<div style="font-family: Arial; font-size: 14px; color: #404040; border-radius: 0px; float: left;">'+fValue+'</div>\
                                    </div>';
                    }

                    i++;
                } else if(nameArr[1] == 'no'){
                    html_text += html_text = '<!--'+ index +'\-->\
                                    <div style="border: none; height: 12px; line-height: 12px; margin:10px 10px 0px 10px;">\
                                        \<input  id="activityRegister_txt_id_'+ i +'\_" type="hidden"  value="'+fValue+'"/>\
                                        \<div style="font-family: Arial; font-size: 14px; font-weight: normal; color: #404040; float: left">'+ nameValue +': \</div>\
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
                        <span style="display: block;white-space:normal;">'+ deadlineTime +'\</span>\
                    </div>\
                </div>\
            </div>\
             '+ html_text +'\
            \</li>';
        return html;
    }

    //返回 显示所有活动的页面
    $('#activityRegister_btn_back').off('click')
        .on('click',function() {
        p_backFrom == null;
        if(p_backFrom == "#activity_detail"){
            $("#activity_detail").addClass("fromRegPage");
        }
        $.mobile.backChangePage(p_pageFrom, { transition: "slide", reverse: true, changeHash:false});
    });
    $('#activityRegister_content').on('swiperight',function() {
        p_backFrom == null;
        $.mobile.backChangePage(p_pageFrom, { transition: "slide", reverse: true, changeHash:false});
    });

    //进入注册确认页面
    $('#btn_activityRegister').off('click')
        .on('click', function() {
            p_backFrom = null;
            var messages="";
            var needStr="";
            var activity_enroll_need = m_activity.enroll_need;
            var needInfo = activity_enroll_need.split('==');
            var i = 0,
                tipsArr = [];
            $.each(needInfo, function(index, val) {
               var needAttr = val.split(':');
               var text_val = $('#activityRegister_txt_id_'+ i +'_').val(),
                   text_key = $('#activityRegister_txt_id_'+ i +'_').prev('div').text();
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
            if(messages!=""){
                dia.alert("Confirmation",messages, ['OK'], function () {
                                   return false;

                });
            }else{
                needStr=needStr.substring(0,needStr.length-2);
//                window.q['verify_needStr'] = needStr;
                m_activity_needStr = needStr;
                var postData = {
                    'userId': q['user'].userId,
                    'activityId': m_activity.id,
                    'app.enroll_info': m_activity_needStr
                };
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
                        activityConfirm.showConfirmActivity(m_activity);
                        activityConfirm.showConfirmNeedStr(m_activity_needStr);
//                    $('#activityRegister_list li:first').empty();
                        $.mobile.newChangePage('#activityConfirm', { transition: "slide", reverse: false, changeHash:false});
                    }
                });
            }
        });
    $('#activityRegister').on('pageshow', function(event) {
        console.error("activityRegister");
        window.setBodyOverflow($(document.body));
        $('#activityRegister_content').css('height',($(window).height()-44-20));
        $('#activityRegister_list').css('min-height',($(window).height()-44-20));

        if (p_pageFrom == '#newsroom' || p_pageFrom == '#video_detailed' || p_pageFrom == '#clubActiveDetails') {
                if (p_backFrom == null){
                    getAcvtivities(m_activity);
                }
        }
        var module = "Other";
        if(p_pageFrom != null && p_pageFrom != ""){
            module = p_pageFrom.substr(1,p_pageFrom.length);
        }
        var postSaveLogData = {};
        postSaveLogData['log.contentId'] = m_activity.id;
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
        window.historyView = [];
    });

    $("#activityRegister").on( "pagehide", function( event ) {
        p_backFrom = null;
    });

    return {
        setAcvtivities: function (acvtivitie) {
            m_activity = acvtivitie;
        },
        from: function(pageFrom) {
            p_pageFrom = pageFrom;
			window.pageFrom = pageFrom;//add for register activity confirm page ok button back action
        }
    }
});
