/**
 * Created by steve on 14-10-7.
 */

define(['jquery', 'jquerymobile', 'net', 'md5','dialogs','registration_show'], function($, m, net, md5, dia,registrationShow) {
 
    //设置内容高度是Header剩下的高度 
    $('#registration_record_list').off('click').on('click', 'li', function() { 
        var status= $(this).attr("status");           
        var postData = {}; 
        postData['userId'] = q['user'].userId;               
        postData['regId'] = $(this).attr("id");
        postData['caId'] = -1;  
        postData['domainId'] = -1; 
        postData['subId'] =  -1;  
        postData['levelId'] =  -1;
        net.post("ca/getDetialInfo", postData,
            function (error) { 
            },
            function(response){
                if (response.code != 0) {
                    dia.alert("Confirmation",response.msg, ['OK'], function () {
                    }); 
                }
                else{
                    var registrationData = response.data.detialInfo;
                    registrationData.status = status;
                    registrationShow.showRegistration(registrationData);
                    registrationShow.from("registration_record");
                    $.mobile.newChangePage("#registration_show",{ transition: "slide",reverse: false,changeHash: false});
                }
            }
        );            
    });

    $('#registration_record').off('click','.new_registration_link')
        .on('click','.new_registration_link', function() {  
        $("#add_registration").attr("frompage","registration_record");
        $.mobile.newChangePage('#add_registration',{ transition: "slide",reverse: false, changeHash:false});
    }); 
    $('#registration_record_btn_back').off('click')
        .on('click', function() { 
        var frompage= $("#registration_record").attr("frompage"); 
        $("#registration_record").removeAttr("frompage");
        $.mobile.backChangePage("#"+frompage,{transition: "slide",reverse: true,changeHash: false});
    });
    $('#registration_record_content').on('swiperight',function() {
        var frompage= $("#registration_record").attr("frompage"); 
        $("#registration_record").removeAttr("frompage");
        $.mobile.backChangePage("#"+frompage,{transition: "slide",reverse: true,changeHash: false});
    });
        

    $("#registration_record").on('pagebeforeshow', function(event) { 
        $('#registration_record_content').css('height',($(window).height()-44-20)); 
        $('#registration_record_content_info').css('min-height',($(window).height()-44-20)); 
        window.setBodyOverflow($(document.body));
        $('#registration_record_list').empty();
        var postData = {}; 
        postData['userId'] = q['user'].userId;  
        net.post("ca/updateAndQueryRegInfoList", postData,
            function (error) { 
                getInfoListEmpty();
            },
            function(response){
                if (response.code != 0) {
                    getInfoListEmpty(); 
                    dia.alert("Confirmation",response.msg, ['OK'], function () {
                    }); 
                }
                else{
                    var registrationRecord = response.data.RegList;
                    var registrationRecordLength = registrationRecord.length;
                    if (registrationRecordLength > 0)  {
                        showRegistrationRecord(registrationRecord);
                    }
                    else{
                        //no data registration_record_list
                        getInfoListEmpty();
                    } 
                }
            },{async:false}
        ); 
        // window.historyView = [];
    });  
    $("#registration_record").off('pageshow')
        .on( "pageshow", function( event ) { 
            window.setBodyOverflow($(document.body));
            // 兼容其他浏览器
            compatibility();
            // window.historyView = [];
    });  
    function getInfoListEmpty(){
        var padTop = $(window).height()/2-60;
            $("#registration_record_list").html('\<div style="padding-top:\
            '+padTop+'\px;text-align: center;background:#fff;color:#808080;font-size:14px; margin: 10px 0;padding-left: 20px; padding-right: 20px;">\
            No registered item yet,you can go <span  class="new_registration_link" style="color:#f26647;">"New registration"</span> to register a new one.</div>');
        $("#registration_record_list").listview("refresh");
        $("#registration_record_list").next().hide();
    }
    function showRegistrationRecord(registrationRecord) {  
        var contentHTML = "",
            contentArray = [],
            $registration_record_list = $("#registration_record_list");
        $.each(registrationRecord, function(i, content) {
            contentArray.push(getRegistrationRecordHTML(content));
        });
        contentHTML = contentArray.join("");
        $registration_record_list.html(contentHTML); 
        $("#registration_record_list").next().show(); 
        $registration_record_list.listview("refresh"); 
    }

    function getRegistrationRecordHTML(content){
        var regId = content.regId; 
        var domainName = content.domainName;
        var subTecName = ($.trim(content.subTecName) == "" ? "" : content.subTecName+" - ");
        var levelName = content.levelName;
        var startTime = content.startTime;
        var endTime = content.endTime;
        var timeZone = content.timeZone;
        var examDate = content.examDate;
        var examArr = examDate.split("-");
        var status = content.status;
        var colorStatus ="";
        var time = "";
        if(status == 1){
            time = startTime+" - "+endTime+" "+timeZone+" "+parseInt(examArr[2])+" "+ getMonthString(parseInt(examArr[1])-1) +" "+examArr[0];    
        }
        if(status == 2){
            colorStatus = '\<span style="color:#db0011;">CANCELLED</span>';
        }
        else if(status == 3){
            colorStatus = '\<span style="color:#7976AC;">FINISHED</span>';
        }else if(status == 4){
            colorStatus = '\<span style="color:#db0011;">DELETED</span>';
        }
        var csstime = "color: #808080;"; 
        var html = '\<li status="'+status+'"  id="'+regId+'"\ style="font-size: 14px; font-weight: normal; height: auto; border: none; border-bottom: 1px solid #e0e0e0; padding: 10px; margin: 0;">\
            <div style="position: relative; padding-right:40px;"><div style="font-size: 16px; white-space: normal; color: #404040;\
            word-break: break-word; margin-bottom: 5px; max-height: 38px; overflow: hidden;">'+domainName+'\</div>\
            <div style="font-size: 16px; white-space: normal; color: #404040; word-break: break-word; margin-bottom: 5px; max-height: 38px; overflow: hidden;">'+subTecName+levelName+'\</div>\
            <div style="font-size: 13px;white-space: normal; color: #808080;'+csstime+'">'+colorStatus+time+'\</div>\
            <div class="right_icon" style="position: absolute;top:28%;right:-5px;"></div></div></li>';
        return html;
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

    function compatibility() {
        /* Logon */
        $('#title_registration_record').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_registration_record').css('postion', 'absulute')
            .css('width', '230px')
            .css('height','20px')
            .css('margin', '8px auto auto auto')
            .css('text-align', 'center');
    }

    $(document).ready(function () {
        setTimeout(function() {
            // 兼容其他浏览器
            compatibility();
        },1000);
    }); 
});