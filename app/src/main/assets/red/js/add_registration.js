
require(['jquery', 'jquerymobile', 'net', 'dialogs','registration_show','registration_manager'], function($, m, net, dia,registrationShow, registrationManager) {
    $("#add_registration").on("pagehide", function( event ) {  
        if($('#add_registration').attr("refresh") == "no"){
            return false;
        } 
        $("#registrationifo_area").hide();
        $('#ensure_registration_tips').show();
        $("#registrationifo_confirmation_icon").hide();
        $("#selectSubTech").show();
        $("#select_level").val("").removeClass().empty(); 
        $("#select_level_dummy").val("").remove();
        $("#select_subtech").val("").removeClass().empty();  
        $("#select_subtech_dummy").val("").remove();
        $("#select_domain").val("").removeClass().empty();
        $("#select_domain_dummy").remove();
        $("#select_location").val("").removeClass().empty(); 
        $("#select_location_dummy").val("").remove(); 
        $("#select_location").next().css("font-weight","normal").css("color","#888").html("Select location");
        $("#select_domain").next().css("font-weight","normal").css("color","#888").html("Select domain / technology");
        $("#select_subtech").next().css("font-weight","normal").css("color","#888").html("Select sub technology"); 
        $("#select_level").next().css("font-weight","normal").css("color","#888").html("Select level");
        $("#btn_add_registration").removeClass("btn_add_registration").css("background-color","#e0e0e0");
    });

    $("#add_registration").on("pagebeforeshow", function( event ) {
        $("#selectSubTech, #selectLevel").hide();
        if($('#add_registration').attr("refresh") == "no"){
            return false;
        }
        var postData = {}; 
        postData['userId'] = q['user'].userId;
        net.post("ca/queryLocationList", postData,
            function (error) { 
            },
            function(response){
                if (response.code != 0) { 
                }
                else{ 
                    var data = response.data.list; 
                    initSelectList('select_location',data);      
                }
            },
            {loading:false,async:false}
        ); 
        var postData = {}; 
        postData['userId'] = q['user'].userId;
        net.post("ca/queryTechnologyList", postData,
            function (error) { 
            },
            function(response){
                if (response.code != 0) {  
                }
                else{ 
                    var data = response.data.list; 
                    initSelectList('select_domain',data);      
                }
            },
            {loading:false,async:false}
        );  
    });  
    $("#add_registration").on("pageshow", function(event) {    
        if($('#add_registration').attr("refresh") == "no"){
            $('#add_registration').removeAttr("refresh");
            return false;
        }
        $('#add_registration_content').css('height', ($(window).height()-44-20));
        $('#add_registration_content_info').css('min-height', ($(window).height()-44-20));  
        //window.historyView = [];
    });
    //点击返回CA页面
    $('#add_registration_btn_back').off('click').on('click',function(evt){
        if($('.mbsc-sel-gr-whl.mbsc-fr-liq').is(':visible')){
            return false;
        }
        var frompage = $("#add_registration").attr("frompage");
        $("#add_registration").removeAttr("frompage");
        $.mobile.backChangePage("#"+frompage,{ transition: "slide",reverse: false,changeHash: false});
    });  
    $('#add_registration_content').on('swiperight',function() {
        var frompage = $("#add_registration").attr("frompage");
        $("#add_registration").removeAttr("frompage");
        $.mobile.backChangePage("#"+frompage,{ transition: "slide",reverse: false,changeHash: false});
    });

    //进入添加registration说明页面
    $('#add_registration').off('click','.records_link')
        .on('click','.records_link', function() { 
        $("#registration_record").attr("frompage","add_registration");
        $('#add_registration').attr("refresh","no");
        $.mobile.newChangePage('#registration_record',{ transition: "slide",reverse: false, changeHash:false});
    }); 
    //进入添加registration说明页面
    $('#add_registration_rules').off('click')
        .on('click', function() { 
        $('#add_registration').attr("refresh","no");
        $('#registration_rule').attr("frompage","add_registration");
        $.mobile.newChangePage('#registration_rule',{ transition: "slide",reverse: false, changeHash:false});
    }); 
    $('#add_registration').off('click','.rules_link')
        .on('click','.rules_link', function() { 
        $('#add_registration').attr("refresh","no");
        $('#registration_rule').attr("frompage","add_registration");
        $.mobile.newChangePage('#registration_rule',{ transition: "slide",reverse: false, changeHash:false}); 
    }); 

    $('#btn_add_registration').off('click').on('click',function(evt){
        if($("#btn_add_registration").hasClass("btn_add_registration")){
            var selRadio = $('#add_registration div.registrationDiv i').filter('.selRadio'); 
            if(selRadio.size() > 0){ 
                var postData = {}; 
                postData['userId'] = q['user'].userId; 
                postData['caId'] = selRadio.attr("id");
                postData['domainId'] = $("#select_domain").val(); 
                postData['subId'] = (($("#select_subtech").val() == null) ? -1 : $("#select_subtech").val());  
                postData['levelId'] = $("#select_level").val();            
                postData['regId'] = -1;
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
                            registrationManager.showRegistration(registrationData);
                            //registrationShow.showRegistration(registrationData);
                            //registrationShow.from("add_registration");
                            registrationManager.from("add_registration");
                            $.mobile.newChangePage("#line_manager",{ transition: "slide",reverse: false,changeHash: false});
                        }
                    }
                );            
            } 
            else{
                dia.alert("Confirmation","please choose item!", ['OK'], function () {
                });
            } 
        }
    });  

    $('#add_registration').off('click',"div.registrationDiv").on('click',"div.registrationDiv",function(evt){
        var $iLabel = $(this).find("i");
        if($iLabel.hasClass("norRadio")){  
            $('#add_registration div.registrationDiv i').filter('.selRadio').removeClass("selRadio").addClass("norRadio"); 
            $iLabel.addClass("selRadio").removeClass("norRadio");
            $("#btn_add_registration").addClass("btn_add_registration").css("background-color","#e6b012");
        }  
    });  
    $("#select_location").on("change", function( event ) { 
        $(this).next().css("font-weight","bold").css("color","#444").html($("#select_location_dummy").val());   
        show_registration();
    });
    $("#select_domain").on("change", function( event ) { 
        $(this).next().css("font-weight","bold").css("color","#444").html($("#select_domain_dummy").val());
        var postData = {};
        var selFlag = $("#select_domain option[value="+$(this).val()+"]").attr("flag");
        postData['userId'] = q['user'].userId;
        var command = "";
        if(selFlag == 'Y' || selFlag == 'N'){
            $('#selectLevel').show();
        }
        if(selFlag == "Y"){
            $("#selectSubTech").show ();  
            postData['domainId'] = $(this).val();
            command = "ca/querySubTechnologyList"; 
        }
        else{
            $("#selectSubTech").hide();
            postData['domain_sub_id'] = $(this).val();
            command = "ca/queryLevel"; 
            
        }
        $("#select_subtech").val("").removeClass().empty(); 
        $("#select_subtech_dummy").val("").remove();
        $("#select_level").val("").removeClass().empty(); 
        $("#select_level_dummy").val("").remove(); 
        $("#select_subtech").next().css("font-weight","normal").css("color","#888").html("Select sub technology"); 
        $("#select_level").next().css("font-weight","normal").css("color","#888").html("Select level"); 
        reset_registration();
        net.post(command, postData,
            function (error) {
                // $("#select_subtech").removeClass().empty();
                // $("#select_subtech_dummy").remove();
            },
            function(response){
                if (response.code != 0) {
                }
                else{
                    var data = response.data.list;
                    if(selFlag == "Y"){
                        initSelectList('select_subtech',data);
                    }
                    else{
                        initSelectList('select_level',data);
                    }
                }
            },
            {loading:false,async:false}
        );
    });
    $("#select_subtech").on("change", function( event ) { 
        $(this).next().css("font-weight","bold").css("color","#444").html($("#select_subtech_dummy").val());
        $("#select_level").next().css("font-weight","normal").css("color","#888").html("Select level"); 
        $("#select_level").val("").removeClass().empty(); 
        $("#select_level_dummy").val("");  
        reset_registration();  
        var postData = {}; 
        postData['userId'] = q['user'].userId; 
        postData['domain_sub_id'] = $(this).val();
        net.post("ca/queryLevel", postData,
            function (error) { 
            },
            function(response){
                if (response.code != 0) {  
                }
                else{ 
                    var data = response.data.list; 
                    initSelectList('select_level',data);      
                }
            },
            {loading:false,async:false}
        );
    }); 
    $("#select_level").on("change", function( event ) {  
        $(this).next().css("font-weight","bold").css("color","#444").html($("#select_level_dummy").val());
        show_registration();
    });

    function reset_registration(){
        $("#registrationifo_area").hide();
        $("#registrationifo_confirmation_icon").hide();
        $('#ensure_registration_tips').show();
        $("#registrationinfo").empty();
    }

    function show_registration(){ 
        var location = $("#select_location_dummy").val();
        var level = $("#select_level_dummy").val();
        console.log(location+"----"+level); 
        if((location != "" && typeof(location) != "undefind") && (level != "" && typeof(level) != "undefined")){
            $('#ensure_registration_tips').hide(); 
            var postData = {}; 
            postData['userId'] = q['user'].userId; 
            postData['locationId'] = $("#select_location").val();
            postData['domainId'] = $("#select_domain").val(); 
            console.log($("#select_subtech").val());
            postData['subId'] = (($("#select_subtech").val() == null) ? -1 : $("#select_subtech").val());  
            postData['levelId'] = $("#select_level").val();
            net.post("ca/queryCAList", postData,
                function (error) { 
                    $("#registrationinfo").html("<div style='padding:20px 10px;text-align:center;color:#888;'>No available items so far.</div>").next().hide();   
                    $("#btn_add_registration").removeClass("btn_add_registration").css("background-color","#e0e0e0"); 
                },
                function(response){
                    if (response.code != 0) { 
                        $("#registrationinfo").html("<div style='padding:20px 10px;text-align:center;color:#888;'>No available items so far.</div>").next().hide();   
                        $("#btn_add_registration").removeClass("btn_add_registration").css("background-color","#e0e0e0"); 
                    }
                    else{ 
                        var registrationData  = response.data; 
                        var registed = registrationData.isRegisted;
                        var overTime = registrationData.isOverTimes;
                        if(overTime == true){
                            $("#registrationifo_confirmation_icon .confirmation_content").html('You are not allowed to register same assessment over three times in a year. You can check your registration in  <span class="records_link" style="color:#f26647;">Registration records</span> .');
                            $("#registrationifo_confirmation_icon").show();
                        }
                        else{ 
                            if(registed == true){
                                $("#registrationifo_confirmation_icon .confirmation_content").html('You have register this item before. You can check it in <span class="records_link" style="color:#f26647;">Registration records</span> or register another one.</div>');
                                $("#registrationifo_confirmation_icon").show();
                            }
                            else{ 
                                $("#registrationifo_confirmation_icon").hide();
                            }
                        }
                        if(registrationData.list.length > 0){
                            //$("#btn_add_registration").addClass("btn_add_registration").css("background-color","#e6b012");
                            getRegistrationInfo(registrationData.list);
                        }
                        else{  
                            $("#registrationinfo").html("<div style='padding:20px 10px;text-align:center;color:#888;'>No available items so far.</div>").next().hide();   
                            $("#btn_add_registration").removeClass("btn_add_registration").css("background-color","#e0e0e0");
                        }
                        $("#registrationifo_area").show();    
                    }
                }
            );
        } 
    }
    function getRegistrationInfo(registrationData){
        var registrationArr = [];
        $.each(registrationData,function(index,registration){
            var caInfies = registration.caList;
            var groupTitle = new Date(registration.groupTitle * 1000); 
            var deadline = new Date(registration.deadline * 1000); 
            var groupTitleTime = getMonthString(groupTitle.getMonth()) + " " + groupTitle.getFullYear();
            var deadline =  "Deadline: " + getMonthString(deadline.getMonth()) + " " +  getDateString(deadline.getDate());
            var registrationHtml = "";
            registrationHtml += '\<div style="height:35px;background: #ededed;line-height:35px;color: #888;padding: 0 10px;">\
            <span>'+groupTitleTime+'\</span><span style="float: right">'+deadline+'</span></div>';
            $.each(caInfies,function(i,caInfo){
                var caInfoId = caInfo.id;
                var examDate = caInfo.exam_date;
                var examDateArr = examDate.split('-');
                var startTime = caInfo.start_time;
                var endTime = caInfo.end_time;
                var timeZone = caInfo.time_zone;
                var spareNum = caInfo.spare_num;
                registrationHtml += '\<div class= "registrationDiv" style="padding: 0px 10px; background: none; \
                border-radius: 0; font-size: 12px; line-height: 50px; height:50px;">\
                <div style="float: left; width: 80px; position: relative; padding-left: 30px;">\
                <i  id="'+caInfoId+'" style="width: 26px;height:50px;display: inline-block; position: absolute; top: 0; left:0px;" \
                class="norRadio"></i>'+getMonthString(parseInt(examDateArr[1])-1)+' '+parseInt(examDateArr[2])+'</div><div style="float: right; \
                width: 80px; text-align: right; word-break: break-word; -webkit-line-clamp: 1; \
                text-overflow: ellipsis; overflow: hidden; white-space: normal;">'+spareNum+' available\
                </div><div style="margin: 0px 80px; color: #404040; overflow: hidden; word-break: break-word;\
                 -webkit-line-clamp: 1; text-overflow: ellipsis; white-space: normal; text-align: center;">'+startTime+' - '+endTime+' '+timeZone+'</div></div>';
            });
            registrationArr.push(registrationHtml);
        });  
        $("#registrationinfo").html(registrationArr.join("")).next().show();     
    }

    function getDateString(date) {
        var suffixArr = ['st','nd','rd']; 
        var date = date.toString();
        var dateLastChar = date.charAt(date.length-1); 
        return  (dateLastChar > 3 || dateLastChar == 0 ) ? date+"th" : date+suffixArr[parseInt(dateLastChar)-1];
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
        $('#title_add_registration').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_add_registration').css('postion', 'absulute')
            .css('width', '230px')
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

