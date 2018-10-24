/**
 * Created by yk on 16/8/29.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs','panle','registration_show'], function($, m, net, dia,panle,registrationShow) {

    //保存对应Registration信息
    var m_registration_info = null;

    // 来自于某个页面
    var m_from_page = null;

    var manager_value = "";
    var staffId_value = "";

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

    $('#manager_show_btn_back').off('click').on('click', function() {
        $.mobile.backChangePage("#add_registration",{ transition: "slide",reverse: true,changeHash: false});
    });

    //进入添加registration说明页面
    $('#manager_show_rules').off('click')
        .on('click', function() {
            $('#line_manager').attr("refresh","no");
            $('#registration_rule').attr("frompage","line_manager");
            manager_value = $("#manager_notes").val();
            staffId_value =  m_registration_info.staffId;
            $.mobile.newChangePage('#registration_rule',{ transition: "slide",reverse: false, changeHash:false});
        });


    function get_registration(registration) {
        var domainName = registration.domainName;
        var subTecName = ($.trim(registration.subTecName) == "" ? "" : (registration.subTecName + " - "));
        var levelName = registration.levelName;
        var examDate = registration.examDate;
        var examDateArr = examDate.split("-");
        var locationName = 'Location: ' + registration.locationName;
        var startDate = registration.startTime;
        var endDate = registration.endTime;
        var startDate = registration.startTime;
        var timeZone = registration.timeZone;
        var examYm = 'Date: ' + getMonthString(parseInt(examDateArr[1]) - 1) + ' ' + parseInt(examDateArr[2]);
        var examDay = 'Time: ' + startDate + " - " + endDate + " " + timeZone
        var html_text = '';
        //var needArr = ["Staff ID:"+registration.staffId,"English name:"+registration.englishName,
        //    "Line manager:"+registration.lineManager,"Line manager staff ID:"+registration.lineManagerStaffId];
        //if(needArr != null){
        //    $.each(needArr, function(index, val) {
        //        var nameArr = val.split(":");
        //        html_text += '\<div style="width:100%;padding: 10px 10px 0px 10px">\
        //        <div style="font-family: Arial;font-size: 14px;font-weight: normal;color: #404040">'+ nameArr[0] +'\</div>\
        //        <div style="width: 100%;height: auto;font-family: Arial;font-size: 16px;font-weight: bold;color: #404040;">'+ nameArr[1] +'\</div>\
        //        </div>';
        //    });
        //}


        if (m_from_page == "add_registration" || m_from_page == "registration_rule") {
            html_text += '\<div style="width:100%;padding:10px 10px 0px 10px;font-size:16px;"><div id="text_ca">Your line manager`s english name<span style="color:#f26647;">&nbsp;*</span></div>\
                                   <input type="text"  id="manager_notes" placeholder="example:David K Cai" style="width: 100%;outline:none;margin:0px auto;margin-top:5px;height: 44px;font-family: Arial;font-size: 16px;font-weight: bold;color: #404040;padding: 14px;border: solid 1px #E9E9E9;border-radius: 0px;" value="' + manager_value + '"/>' +
            ' <div id="camansearch_btn" style="float:right;position:absolute;top:22px;right:20px;width:26px;height:26px;display: none;"><i class="chren_icon"></i></div></div>'


            html_text += '<li style="padding: 0 10px;"><div id="inputSearch" style="height:400px;border:1px solid #e4e4e4;border-top:none;overflow: auto;width:100%;display: none"></div><div id="text_ca2" style="font-size: 13px;color: #808080;padding: 10px;word-wrap: break-word;font-family: Arial;">Your line manager will be notified about your registration.</div></li>';

            var html = '\<li style="padding: 0px;" id="first_list"><div style="width:100%;  padding: 0; border: \
                none;background-color: rgb(101,153,193);">\
                <div style="width:100%;padding: 20px 10px 10px 10px">\
                                    <div style="white-space:normal;font-weight: normal;font-size: 12px;color: #ffffff;">' + domainName + '\</div><div style="white-space:normal;font-weight: normal;font-size: 18px;color: #ffffff;margin-bottom: 8px">' + subTecName + levelName + '\</div>\
                    <div style="font-size: 11px;color: #ffffff;line-height: 18px;font-weight: normal">\
                        <span style="display: block">' + examYm + '\</span>\
                        <span style="display: block">' + examDay + '\</span>\
                        <span style="display: block">' + locationName + '\</span></div>\
                </div>\
            </div></li>';
                html+='<li style="padding: 0px;">'+ html_text +'</li>';

            $('#manager_show_list').html(html);


            //英文名字方法
            $("#manager_notes").on('click',function(){
                $("#camansearch_btn").show();
                $("#manager_show_content_info").css("margin-top",'0px');
                $("#text_ca").hide();
                $("#first_list").hide();
                $("#text_ca2").hide();
            });
            $("#camansearch_btn").click(function(){
                $("#manager_notes").val("");
                $("#btn_manager_continue").css("background-color", "#e0e0e0");
                $("#btn_manager_continue").addClass("disabled");
                $(this).hide();
                $("#inputSearch").hide();
                $("#text_ca").show();
                $("#first_list").show();
                $("#text_ca2").show();

            })
            $("#manager_notes").bind('input propertychange', function () {
                var keywords = $(this).val();
                //if($(this).val()==""){
                //    $("#inputSearch").hide();
                //    $("#inputSearch").html("");
                //}

                var postdata = {};
                postdata['keywords'] = keywords;
                net.post('ca/getLineManager', postdata, function (error) {
                }, function (response) {
                    if (response.code != 0) {

                    } else {
                        var data = response.data.LineManager;
                        var text = '';
                        $.each(data, function (index, val) {
                            text += '<div style="width: 100%;overflow: hidden;padding: 10px 10px;" name="manager_search" class="'+ val +'" >\
                         <div style="float: left;font-size: 16px;color: #333;" >'+ val.split("<")[0]  +'</div>\
                         <div style="float: left;font-size: 16px;margin-left: 10px;">'+'<'+ /\d+(?:\.\d+)?/.exec(val.split("<")[1])[0]+'>' +'</div>\
                     </div>';
                        });
                        $("#inputSearch").html(text);
                        $("#inputSearch").show();
                        $("div[name='manager_search']").on('click',function(){
                            $(this).css("background-color","#F1F1F1");
                            var titie = $(this).attr("class");
                            m_registration_info.staffId = /\d+(?:\.\d+)?/.exec(titie.split("<")[1])[0];
                            $("#manager_notes").val(titie.split("<")[0]);
                            $("#manager_notes").css("color","#333").css("font-weight","bold");
                            $("#btn_manager_continue").css("background-color", "#e6b012");
                            $("#btn_manager_continue").removeClass("disabled");
                            $("#inputSearch").hide();
                            $("#text_ca").show();
                            $("#first_list").show();
                            $("#text_ca2").show();
                            $("#camansearch_btn").hide();
                        });
                    }
                });
            });



            $("#manager_notes").on('input', function (evt) {
                var manager_notes_value = $("#manager_notes").val().trim();
                //StaffId 赋值
                var manager_staffId_value = m_registration_info.staffId;
                if (manager_notes_value != "") {
                    $("#btn_manager_continue").css("background-color", "#e6b012");
                    $("#btn_manager_continue").removeClass("disabled");
                } else {
                    $("#btn_manager_continue").css("background-color", "#e0e0e0");
                    $("#btn_manager_continue").addClass("disabled");
                }
            });
            //$("#manager_staffId").keyup(function () {
            //    $(this).val($(this).val().replace(/\D|^0/g, ''));
            //}).bind("paste", function () {
            //    $(this).val($(this).val().replace(/\D|^0/g, ''));
            //});
        //    $('#manager_notes').bind('keypress', function (event) {
        //    var regex = new RegExp("^[a-zA-Z0-9\.\/\@ ]+$");
        //    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        //    if (!regex.test(key)) {
        //        event.preventDefault();
        //        return false;
        //    }
        //});
    }
        //点击continue跳转registration_show
        $("#btn_manager_continue").off('click')
            .on('click', function () {
                var manager_notes_value = $("#manager_notes").val();
                var manager_staffId_value = m_registration_info.staffId;
                //alert(manager_notes_value);
                //alert(manager_staffId_value);
                //if (manager_notes_value == "" || manager_staffId_value == "") return false;
                //// if($(this).hasClass("disabled")) return false;
                //else {
                    $("#manager_notes").blur();
                    //$("#manager_staffId").blur();
                    var postData = {};
                    postData['userId'] = q['user'].userId;
                    postData['caId'] = m_registration_info.caId;
                    postData['domainId'] = m_registration_info.domainId;
                    postData['subId'] = m_registration_info.subTechId;
                    postData['levelId'] = m_registration_info.levelId;
                    postData['regId'] = -1;
                    postData['lotusAddress'] = $("#manager_notes").val();
                    postData['staffId'] = m_registration_info.staffId;

                        net.post("ca/getDetialInfo", postData,
                            function (error) {
                            },
                            function (response) {
                                if (response.code != 0) {
                                    dia.alert("Confirmation", response.msg, ['OK'], function () {
                                    });
                                }
                                else {
                                    var registrationData = response.data.detialInfo;
                                    registrationData['lineManager'] = $("#manager_notes").val();
                                    registrationData['lineManagerStaffId'] = m_registration_info.staffId;

                                    registrationShow.showRegistration(registrationData);
                                    registrationShow.from("line_manager");
                                    setTimeout(function () {
                                        $.mobile.newChangePage("#registration_show", {
                                            transition: "slide",
                                            reverse: false,
                                            changeHash: false
                                        });
                                    }, 300);
                                    //$("#btn_manager_continue").css("background-color", "#e0e0e0");
                                }
                            }
                        );
            });
    }

    $("#line_manager").on( "pagecreate", function() {
        $( "body > [data-role='panel']" ).panel();
        $( "body > [data-role='panel'] [data-role='listview']" ).listview();
    });
    //changePassword页面 设置内容高度是Header剩下的高度
    $("#line_manager").on( "pagebeforeshow", function( event ) {
        window.shouldPageRefresh.newsroom = true;
        $('#manager_show_content').css('height', ($(window).height()-44-20));
        $('#manager_show_content_info').css('min-height', ($(window).height()-44-10));
        $('#manager_show_info').css('min-height', ($(window).height()-44-20-56));
        // window.historyView = [];
        if(m_from_page != "registration_rule"){
            manager_value = "";
            staffId_value = "";
        }
        if(manager_value == "" || staffId_value == ""){
            $("#btn_manager_continue").css("background-color","#e0e0e0");
            $("#btn_manager_continue").addClass("disabled");
        }else{
            $("#btn_manager_continue").css("background-color","#e6b012");
            $("#btn_manager_continue").removeClass("disabled");
        }
        get_registration(m_registration_info);
    });

    $('#line_manager').on('pageshow', function(event) {
        window.setBodyOverflow($(document.body));
        // window.historyView = [];
    });

    function compatibility() {
        /* Logon */
        $('#title_registration_manager').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_registration_manager').css('postion', 'absulute')
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
})