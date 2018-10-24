/**
 * Created by yk on 16/8/26.
 */

define(['jquery', 'jquerymobile', 'net', 'dialogs','panle'], function($, m, net, dia,panle) {

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

    //点击进入添加TEAM页面
    $('#team_records').off('click').on('click',function(evt){
        //show_registration();
        $("#team_registration_records").attr("frompage","ca");
        $.mobile.newChangePage("#team_registration_records",{ transition: "slide",reverse: false,changeHash: false});
    });

    $('#team_detail_btn_menu').off('click').on('click', function() {
        $.mobile.backChangePage("#ca",{ transition: "slide",reverse: true,changeHash: false});
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
    });

    $("#team_registration_records").on( "pagecreate", function() {
        $( "body > [data-role='panel']" ).panel();
        $( "body > [data-role='panel'] [data-role='listview']" ).listview();
    });
    //changePassword页面 设置内容高度是Header剩下的高度
    $("#team_registration_records").on( "pagebeforeshow", function( event ) {
        $("#team_ul li").removeClass();
        $("#team_ul").empty();
        window.shouldPageRefresh.newsroom = true;
        $('#team_registration_content').css('height', ($(window).height()-44-20));
        $('#team_registration_content_info').css('min-height', ($(window).height()-44-20));
        // window.historyView = [];
        $("#pullDown_record").css("visibility","visible");
    });

    function initPageLoading(wrapper) {
        var $wrapper = $("#" + wrapper),
            $pullDownEl = $wrapper.find("#pullDown_record");

        var $pullDownLabel = $pullDownEl.find(".pullDownLabel");
        $wrapper.find(".scroller").css(window.getVendorStyle("transform"), "translate(0, 0)");
        $pullDownEl.css("margin-top","10px").attr("class", "loading");
        $pullDownLabel.text("Loading...");
    }

    $("#team_registration_records").on( "pageshow", function( event ) {
        initPageLoading('team_registration_records');

        // 服务器请求列表数据（获取到后，清除loading DOM，写入list DOM）
        show_registration();
    });

    $("#team_registration_records").on( "pagehide", function( event ) {
        $('#team_registration_content_info').hide();
    });

    function show_registration(){
        var postData = {};
        postData['userId'] = q['user'].userId;
        net.post('ca/searchRegListLM',postData,function(error){

        },function(response){
            if(response.code != 0){

            }else{

                $("#team_registration_records").find(".scroller").css(window.getVendorStyle("transform"), "translate(0, -50px)").find('#pullDown_record').removeClass('loading').css("margin-top","0px");
                $("#team_registration_records").find('#team_registration_content_info').show();

                $("#pullDown_record").css("visibility","hidden");

                var manager_html = [];
                $.each(response.data.RegList,function(index,val){
                    var englishName = val.englishName;
                    var domainName = val.domainName;
                    var levelName = val.levelName;
                    var locationName = val.locationName;
                    var locationNm = 'Location: '+locationName;
                    var examDate = val.examDate;
                    var examDateArr = examDate.split("-");
                    var examYm = 'Date: '+parseInt(examDateArr[2])+' '+getMonthString(parseInt(examDateArr[1])-1)+' '+parseInt(examDateArr[0]);
                    var manager_status = val.status;
                    var manager_statusYm = "";
                    if(manager_status == 1){
                        manager_statusYm = examYm;
                    }
                    if(manager_status == 2){
                        manager_statusYm = '\<span style="color:#db0011;">CANCELLED</span>';
                    }
                    else if(manager_status == 3){
                        manager_statusYm = '\<span style="color:#7976AC;">FINISHED</span>';
                    }else if(manager_status == 4){
                        manager_statusYm = '\<span style="color:#db0011;">DELETED</span>';
                    }
                    var manager_list = '\<li style="height:auto;border-bottom:1px solid #e0e0e0">\
                                        <div style="font-size:16px;font-weight:bold;color:black;padding:10px 10px 2px 10px;font-family: Arial;word-wrap: break-word;">'+englishName+'</div>\
                                        \<div style="font-size:16px;color:black;margin:0px 10px;font-family: Arial;word-wrap:break-word;">'+domainName+'&nbsp;-&nbsp;'+levelName+'</div>\
                                        \<div style="font-size:13px;color:#808080;padding:5px 10px 10px 10px;font-family: Arial;word-wrap:break-word;">\
                                        '+manager_statusYm+'\</div></li>';
                        manager_html.push(manager_list);
                });

                    $("#team_ul").html(manager_html.join(""));
                    $("#manager_device").css("display","block");
                if(manager_html.length == 0){
                    $("#manager_device").css("display","none");
                    var manager_list_Ym = '\<div style="font-size:12px;font-family: Arial;color:#808080;height:14px;margin:0 auto;text-align: center;padding-top: 170px;word-wrap: break-word;padding-left:20px;padding-right:20px;">No team registration record so far.</div>';
                    $("#team_ul").html(manager_list_Ym);
                }
            }
        })
    }

    function compatibility() {
        /* Logon */
        $('#title_team_registration').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_team_registration').css('postion', 'absulute')
            .css('width', '230px')
            .css('height','20px')
            .css('margin', '8px auto auto auto');
    }
    $(document).ready(function () {
        setTimeout(function() {
            // 兼容其他浏览器
            compatibility();
        },1000);

        $("#team_registration_records").find(".scroller").css("-webkit-transform", "translate(0px, -50px)");
    });
    return {
        show_registration : function(){
            initPageLoading('team_registration_records');
            show_registration();
        }
    }
});

