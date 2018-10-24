/**
 * Created by Aimee on 14-11-12.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs'], function($, m, net, dia) {
    //保存对应Registration信息
    var m_registration_info = null; 

    // 来自于某个页面
    var m_from_page = null; 

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


    function get_registration(registration) {
        var value = registration;   
        //获取registration  
        var domainName = registration.domainName;
        var subTecName = ($.trim(registration.subTecName) == "" ? "" : (registration.subTecName +" - "));
        var levelName = registration.levelName;
        var examDate = registration.examDate;
        var examDateArr = examDate.split("-");
        var locationName = 'Location: ' + registration.locationName;
        var startDate = registration.startTime;
        var endDate = registration.endTime; 
        var startDate = registration.startTime; 
        var timeZone = registration.timeZone;
        var examYm = 'Date: '+getMonthString(parseInt(examDateArr[1])-1)+' '+parseInt(examDateArr[2]);
        var examDay = 'Time: '+startDate +" - "+ endDate  +" "+ timeZone 
        var html_text = ''; 
        var needArr = ["Staff ID:"+registration.staffId,"English name:"+registration.englishName,
        "Chinese name:"+registration.chineseName,"Your line manager's english name:"+registration.lineManager];
        if(needArr != null){
            $.each(needArr, function(index, val) {
                var nameArr = val.split(":");
                html_text += '\<div style="width:100%;padding: 10px 10px 0px 10px">\
                <div style="font-family: Arial;font-size: 16px;font-weight: normal;color: #404040">'+ nameArr[0] +'\</div>\
                <div style="width: 100%;height: auto;font-family: Arial;font-size: 16px;font-weight: bold;color: #404040;">'+ nameArr[1] +'\</div>\
                </div>';
            });
        } 
        if(m_from_page == "line_manager"){
            html_text +='<div style="position: relative; margin: 0 10px; height: 50px; line-height: 50px;">\
            <i id="conditions_registration" style="width: 30px; display: inline-block; height: 30px; \
            position: absolute; top: 12px; left: 0;" class="sel"></i><span style="font-size: 12px;\
            padding-left: 40px;">I accept the assessment <span class="conditions_link" \
            style="color:#006EBA;">Terms & Conditions</span></span></div><div \
            style="display:none;margin: 0 10px 15px; font-size: 12px;color: red;" \
            class="conditions_registration_warn">Please accept the Terms &amp; Conditions</div>';
        }
        var html = '\<li style="padding: 0px;"><div style="width:100%;  padding: 0; border: \
                none;background-color: rgb(101,153,193);">\
                <div style="width:100%;padding: 20px 10px 10px 10px">\
                                    <div style="white-space:normal;font-weight: normal;font-size: 12px;color: #ffffff;">'+domainName+'\</div><div style="white-space:normal;font-weight: normal;font-size: 18px;color: #ffffff;margin-bottom: 8px">'+ subTecName+levelName +'\</div>\
                    <div style="font-size: 11px;color: #ffffff;line-height: 18px;font-weight: normal">\
                        <span style="display: block">'+ examYm +'\</span>\
                        <span style="display: block">'+ examDay +'\</span>\
                        <span style="display: block">'+locationName+'\</span></div>\
                </div>\
            </div>\
             '+ html_text +'\
            \</li>';

        $('#registration_show_list').html(html);
    } 

    //返回到CA页面
    $('#registration_show_btn_cancel').off('click')
        .on('click', function() { 
        dia.alert('Confirmation', 'Are you sure you want to cancel this registration process?', ['No','Yes'], function(title){
            if(title == "Yes"){
                $.mobile.newChangePage('#ca',{ transition: "slide",reverse: true, changeHash:false});
                var postData = {};
                postData['userId'] = q['user'].userId;
                net.post('ca/hasCaRegData',postData,function(error){

                },function(response){
                    if (response.code != 0) {
                    }
                    else{
                        var dataInfo = response.data.Info;
                        if(dataInfo == true){
                            $("#team_records").css("display","block");
                        }else{
                            $("#team_records").css("display","none");
                        }

                    }
                });
            }
        });
    }); 

    //返回到上一个页面
    $('#registration_show_btn_back').off('click')
        .on('click', function() { 
        $.mobile.backChangePage('#'+m_from_page,{ transition: "slide",reverse: true, changeHash:false});
    }); 
    $('#registration_show_content').on('swiperight',function() {
        if(m_from_page != null && m_from_page != "line_manager"){
            $.mobile.backChangePage('#'+m_from_page,{ transition: "slide",reverse: true, changeHash:false});
        }
    }); 
    //进入添加registration说明页面
    $('#registration_show_rules').off('click')
        .on('click', function() { 
        $('#registration_rule').attr("frompage","registration_show"); 
        $.mobile.newChangePage('#registration_rule',{ transition: "slide",reverse: false, changeHash:false});
    }); 
    //取消registration
    $('#btn_registration_cancel').off('click')
        .on('click', function() {  
        dia.alert('Confirmation', 'Are you sure you want to cancel this registration?', ['No','Yes'], function(title){
            if(title == "Yes"){ 
                var postData = {
                    'userId': q['user'].userId ,
                    'regId': m_registration_info.regId 
                };  
                net.post('ca/cancelCaReg', postData, function(error){ 
                }, function(response){ 
                    if (response.code != 0) {
                        dia.alert('Confirmation',response.msg,['OK'],function(title) {

                        });
                    } else { 
                        $.mobile.newChangePage('#registration_record',{ transition: "slide",reverse: true, changeHash:false});
                    }
                });
            }
        });
    }); 

    //选择是否接受协议
    $('#registration_show').off('click','#conditions_registration') 
    .on('click','#conditions_registration',function() {
        if($(this).hasClass("sel")){
            $(this).removeClass("sel").addClass("nor");
            $("#btn_registration_confirm").removeClass("btn_registration_confirm").css("background-color","#e0e0e0");
        }
        else{
            $(this).removeClass("nor").addClass("sel"); 
            $("#btn_registration_confirm").addClass("btn_registration_confirm").css("background-color","#e6b012");
            // $("#registration_show .conditions_registration_warn").hide();
        }
    });

    //跳转到registration conditions页面 
    $('#registration_show').off('click','.conditions_link')    
        .on('click','.conditions_link',function() {
        $.mobile.newChangePage('#registration_conditions', { transition: "slide", reverse: false, changeHash:false});
    }); 

    //跳转到registration确认页面 
    $('#btn_registration_confirm').off('click')
        .on('click', function() { 
        if($("#registration_show #conditions_registration").hasClass("sel") && $('#btn_registration_confirm').hasClass("btn_registration_confirm")){
            // $("#registration_show .conditions_registration_warn").show();  
            // $("#registration_show .conditions_registration_warn").hide();
            var postData = {
                'userId': q['user'].userId ,
                'domainId': m_registration_info.domainId ,
                'subId': m_registration_info.subTechId ,
                'levelId': m_registration_info.levelId ,
                'caId': m_registration_info.caId,
                'lotusAddress':m_registration_info.lineManager,//英文名
                'staffId':m_registration_info.lineManagerStaffId  //Staff id
            };

            net.post('ca/saveRegInfo', postData, function(error){ 
            }, function(response){ 
                if (response.code != 0) {
                    dia.alert('Confirmation',response.msg,['OK'],function(title) {

                    });
                } else {
                    m_registration_info.status = response.data.RegInfo.status;
                    $.mobile.newChangePage('#registration_confirm', { transition: "slide", reverse: false, changeHash:false}); 
                }
            });
        }
    });

    $('#registration_show').on('pagebeforeshow', function(event) { 
        $('#registration_show_header_title').parent()
            .css('display', 'block')
            .css('postion', 'relative');
        $('#registration_show_header_title').css('width', (m_from_page == "line_manager") ? "110px" :"195px")
            .css('height','20px')
            .css('margin', '8px auto auto auto');
        if(m_from_page == "line_manager"){
            $("#registration_show_header_title").html("Please verify");
            $("#registration_show_btn_back").hide();
            $("#registration_show_btn_cancel").show();
            $("#registration_show_rules").show(); 
            if($("#registration_show #conditions_registration").hasClass("nor")){ 
                $("#btn_registration_confirm").removeClass("btn_registration_confirm").css("background-color","#e0e0e0");
            }
            else{
                $("#btn_registration_confirm").addClass("btn_registration_confirm").css("background-color","#e6b012");
                // $("#registration_show .conditions_registration_warn").hide();
            }  

            $("#btn_registration_confirm").show();
            $("#btn_registration_cancel").hide();
        }
        else{
            $("#registration_show_btn_back").show();
            $("#registration_show_btn_cancel").hide();
            $("#registration_show_rules").hide();
            $("#btn_registration_confirm").hide();
            if(m_registration_info.status == 1){
                $("#btn_registration_cancel").show(); 
            }
            else{
                $("#btn_registration_cancel").hide(); 
            }
            $("#registration_show_header_title").html("Registered assessment");
        }    
        $('#registration_show_content').css('height',($(window).height()-44-20));
        $('#registration_show_content_info').css('min-height',($(window).height()-44-20)); 
        $('#registration_show_info').css('min-height',($(window).height()-44-20-56));
        get_registration(m_registration_info);    
    });

    $('#registration_show').on('pageshow', function(event) { 
        window.setBodyOverflow($(document.body));
        // window.historyView = [];
    });

    $("#registration_show").on( "pagehide", function( event ) {
        $('#registration_show_list').empty(); 
    });

    return {
        showRegistration: function(registration_info) {
            //获取registration基本信息
            m_registration_info = registration_info;
        },
        from: function(frompage){
            //获取返回页面
            m_from_page = frompage;
        } 
    }
});

