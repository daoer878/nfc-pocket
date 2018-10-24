/**
 * Created by testbetta1 on 15/8/27.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs', 'videoDetailed','panle'], function($, m, net, dia, videodetail,panle) {
    // 补充0
    var showeye = "false";
    var likeMsg = "";
    var regMsg = "";
    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }


    //创建点赞或注册活动
    function creatArticle(title,time,id,type,regflag,enrollStatus,from) {
        var activityBrifContent = title;
        var colorStatus = "";
        var reg = "no";
        if(regflag){
            reg = regflag;
        }
        var fromtype = "like";
        if(from){
            fromtype = from;
            if(enrollStatus == 0){
                colorStatus = '\<span style="color:#a3d963;">SELECTED</span>-';
            }
            else if(enrollStatus == 1){
                colorStatus = '\<span style="color:#75c2bd;">PENDING</span>';
            }
            else if(enrollStatus == 2){
                colorStatus = '\<span style="color:#db0011;">NOT SELECTED</span>';
            }
        }
        var csstime = "color: #808080;";
        if(time == "FINISHED"){
            csstime = "color:#7a77ae;font-weight:bold;";
        }
        var html = '\<li  style="margin: 0px; padding:12px 0;border: none; border-bottom: 1px solid #e0e0e0;" class="articles" enrollStatus = "'+enrollStatus+'"  cornertype="'+fromtype+'" reg="'+reg+'" types="'+type+'" idflag="'+id+'"\><div style="float:left;padding: 1px 10px 0 10px;font-family:Arial;font-size: 14px;font-weight: normal;width: 85%;">\
            \<div style="font-size: 14px; white-space:normal;color: #404040;word-break:break-word;margin-bottom:12px;text-overflow: ellipsis;max-height: 38px;height: auto; overflow: hidden;display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">'+activityBrifContent+'\</div>\
            \<div style="font-size: 10px;white-space: normal; '+csstime+'">'+colorStatus+time+'\</div></div>\
            \<div style="float: right; padding:9px 0px 0px 0px;margin-right:3px;"><i class="right_icon"></i></div></li>';
        return html;
    }
    /**
     * 展示已点赞新闻
     * @param content
     */
    function showlikeArticle(contentList) {
        var contentHTML = "",
            contentArray = [],
            $corner_article_listview = $("#corner_article_ul");
        $.each(contentList, function(i, content) {
            console.assert(content.types != null, '要展示的内容都没有类型啊');
            if (content.types == 'new') {
                contentArray.push(getNewsHTML(content));
            }
            else if (content.types == 'activity') {
                contentArray.push(getAcitvityHTML(content,"like"));
            }
            else if (content.types == 'survey') {
                contentArray.push(getSurveyHTML(content,"likeSurvey"));
            }
            else {
                console.assert(false, '除了新闻和活动，目前不会有%s类型。', content.types);
            }
        });
        contentHTML = contentArray.join("");
        $corner_article_listview.append(contentHTML);
        $corner_article_listview.listview("refresh");
    }

    /**
     * 展示已点赞survey
     * @param content
     */
    function showRegSurvey(contentList,cornertype) {
        var contentHTML = "",
            contentArray = [],
            $corner_survey_listview = $("#corner_survey_ul");
        $.each(contentList, function(i, content) {
            if (content.types == 'survey') {
                contentArray.push(getSurveyHTML(content,cornertype));
            }
        });
        contentHTML = contentArray.join("");
        $corner_survey_listview.append(contentHTML);
        $corner_survey_listview.listview("refresh");
    }
    /**
     * 展示当前已注册活动
     * @param content
    */
    function showactivity(contentList) {
        var contentHTML = "",
            contentArray = [],
            $corner_activity_listview = $("#corner_activity_ul");
        $.each(contentList, function(i, content) {
            if (content.types == 'activity') {
                contentArray.push(getAcitvityHTML(content,"reg"));
            }
            else {
                console.assert(false, '除了新闻和活动，目前不会有%s类型。', content.types);
            }
        });
        contentHTML = contentArray.join("");
        $corner_activity_listview.append(contentHTML);
        $corner_activity_listview.listview("refresh");
    }

    /**
     * 获得新闻HTML
     * @param news
     */
    function getSurveyHTML(survies,cornertype) {

        var date = new Date(survies.deadline * 1000);
        var month = getMonthString(date.getMonth());
        var time = 'Participated on ' + date.getDate() + " " + month + " " + date.getFullYear();
        var li = creatSurvey(survies.subject,time,survies.survey_id,survies.types,cornertype);
        return li;
    }


    //创建点赞或注册活动
    function creatSurvey(title,time,id,type,cornertype) {
        var html = '\<li  style="margin: 0px; padding:12px 0;border: none; border-bottom: 1px solid #e0e0e0;" class="survey" cornertype="'+cornertype+'" idflag="'+id+'"\><div style="float:left;padding: 1px 10px 0 10px;font-family:Arial;font-size: 14px;font-weight: normal;width: 85%;">\
            \<div style="font-size: 14px; white-space:normal;color: #404040;word-break:break-word;margin-bottom:12px;text-overflow: ellipsis;max-height: 38px;height: auto; overflow: hidden;display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">'+title+'\</div>\
            \<div style="font-size: 10px;white-space: normal; color: #808080;">'+time+'\</div></div>\
            \<div style="float: right; padding:9px 0px 0px 0px;margin-right:3px;"><i class="right_icon"></i></div></li>';
        return html;
    }

    /**
     * 获得新闻HTML
     * @param news
     */
    function getNewsHTML(news) {

        var date = new Date(news.approvalTime * 1000);
        var month = getMonthString(date.getMonth());
        var time = 'Posted on ' + date.getDate() + " " + month + " " + date.getFullYear();
        var li = creatArticle(news.title,time,news.newsId,news.types);
        return li;
    }

    function getHm(hours,minutes){
        var dn="AM"
        if (hours>12){
            dn="PM"
            hours=hours-12;
        }
        if (hours==0){
            hours=12;
        }
        if(hours <= 9){
            hours="0"+hours;
        }
        if (minutes<=9){
            minutes="0"+minutes;
        }
        var ctime=hours+":"+minutes ;
        var timeArr  =  [];
        timeArr.push(ctime);
        timeArr.push(dn);
        return timeArr;
    }
    function getAcitvityHTML(activity,from) {
        var time = "FINISHED";
        if(from == "reg") {
            if (activity.finishFlag == "false") {
                var enrollStatus = activity.enrollStatus;
                if(enrollStatus == 0){
                    var startDate = new Date(activity.startTime * 1000);
                    var start = startDate.getDate() + " " + getMonthString(startDate.getMonth()) + " " + startDate.getFullYear();
                    var startHmArr = getHm(startDate.getHours(), startDate.getMinutes());
                    time = "Start at "+startHmArr[0] + startHmArr[1] + ', ' + start ;
                }
                else{
                    time = "";
                }
            }
        }
        else{
            var submitTime = new Date(activity.submit_time * 1000);
            var month = getMonthString(submitTime.getMonth());
            time = 'Posted on ' + submitTime.getDate() + " " + month + " " + submitTime.getFullYear();
        }
        var li = creatArticle(activity.subject,time, activity.id,activity.types,(activity.regFlag ? activity.regFlag : "yes"),enrollStatus,from);
        return li;
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
    function getRegActivity() {
        var postData = {};
        postData['userId'] = q['user'].userId;
        // 获取新闻
        net.post('myCorner/getRegActivity', postData, function(error){
            regMsg = "0";
        }, function(response){
            if (response.code != 0) {

            } else {
                var newsList = response.data.ActivityList,
                    newsListLength = newsList.length;
                if (newsListLength > 0)  {
                    $("#corner_content .corner_content_height").css("background", "#fff");
                    if(response.data.showmore == "yes"){
                        $("#corner_activity_ul .moreicon").removeClass("nomore");

                    }
                    else{
                        $("#corner_activity_ul .moreicon").addClass("nomore");
                    }
                    $("#corner_activity_ul").show();
                    showactivity(newsList);
                }
                else{
                    var padTop = $(window).height()/2-60;
                    $("#corner_content .corner_content_height").append('\<div id="mycorner_nocontent" style="height:'+($(window).height()-44-20)+'\px;padding-top:\
            '+padTop+'\px;text-align: center;background:#fff;color:#808080;font-size:14px; margin: 10px 0;padding-left: 20px; padding-right: 20px;">\
            Articles you liked and activities you registered can be easily found here.</div>');

                    $("#corner_activity_ul").hide();
                }
            }
        },{async:false,loading:false});
    }
    function getLikeNews() {
        var postData = {};
        postData['userId'] = q['user'].userId;
        // 获取新闻
        net.post('myCorner/getLikeArticles', postData, function(error){
        }, function(response){
            if (response.code != 0) {

            } else {
                var newsList = response.data.ArticlesList,
                    newsListLength = newsList.length;
                if (newsListLength > 0)  {
                    if(response.data.showmore == "yes"){
                        $("#corner_article_ul .moreicon").removeClass("nomore");

                    }
                    else{
                        $("#corner_article_ul .moreicon").addClass("nomore");
                    }
//                    $("#corner_article_ul").show();
                    showlikeArticle(newsList);
                }
                else{
                    $("#corner_article_ul").hide();
                }
            }
        },{async:false,loading:false});
    }

    function getRegSurvey() {
        var postData = {};
        postData['userId'] = q['user'].userId;
        // 获取surey
        net.post('myCorner/getRegSurvey', postData, function(error){
        }, function(response){
            if (response.code != 0) {

            } else {
                var surveyList = response.data.SurveyList,
                    surveyListLength = surveyList.length;
                if (surveyListLength > 0)  {
                    if(response.data.showmore == "yes"){
                        $("#corner_survey_ul .moreicon").removeClass("nomore");

                    }
                    else{
                        $("#corner_survey_ul .moreicon").addClass("nomore");
                    }
//                  $("#corner_survey_ul").show();
                    showRegSurvey(surveyList,"regSurvey");
                }
                else{
                    $("#corner_survey_ul").hide();
                }
            }
        },{async:false,loading:false});
    }

    //获取新闻详情
    var getDetailInfo = function(id,type,reg,cornertype,enrollStatus){
        var postData = {};
        var command = null;
        postData['appOrPCFlag'] = "APP";
        if(type == "new") {
            postData['newsId'] = id;
            command = "news/getDetialInfo";
        }
        else if(type == "activity") {
            postData['activityId'] = id;
            command = "activity/getDetialInfo";
        }
        net.post(command, postData, function(error){},function(response){
            if (response.code != 0) {
                dia.alert('Confirmation', response.msg, ['OK'], function(title) {
                });
            }
            else {
                var infoObj = null;
                var page = null;
                var wrapper = null;
                if(type == "new") {
                    infoObj = response.data.news;
                    infoObj.showeye = showeye;
                    infoObj.fromtype= cornertype;
                }
                else if(type == "activity") {
                    infoObj = response.data.activity;
                    infoObj.showeye = showeye;
                    infoObj.reg = reg;
                    infoObj.enrollStatus = enrollStatus;
                    infoObj.fromtype= cornertype;
                }
                var initPageLoading = function(wrapper) {
                    var $wrapper = $("#" + wrapper),
                        $pullDownEl = $wrapper.find("#pullDown");
                    if(wrapper == "wrapper_comments"){
                        $pullDownEl = $wrapper.find("#pullDown_comments");
                    }
                    else if(wrapper == "wrapper_comments_activity"){
                        $pullDownEl = $wrapper.find("#pullDown_comments_activity");
                    }
                    var $pullDownLabel = $pullDownEl.find(".pullDownLabel");
                    if ($wrapper.find("ul").html()) {
                        $wrapper.find(".scroller").css(window.getVendorStyle("transform"), "translate(0,0)");
                        $pullDownEl.attr("class", "loading");
                        $pullDownLabel.text("Loading...")
                    }
                }
                $("#video_detailed").page();
                $('#video_detailed_listview').empty();
                $('#video_listview_comments').empty();
                $("#video_detailed .praises_desc i").removeClass("praises_icon_no");
                $("#video_detailed .add_comment").hide();
                $("#video_detailed .news_commentarea").hide();
                if($("#video_detailed .addcomments_state").hasClass("exsit")){
                    $("#video_detailed .no_comment").removeClass("exsit");
                }
                $("#commentinfo_video").val("");
                $("span.video_textlength").html(0);
                if($("#video_detailed .addcomments_state").hasClass("canclecomments_icon")){
                    $("#video_detailed .addcomments_state").addClass("addcomments_icon");
                    $("#video_detailed .addcomments_state").removeClass("canclecomments_icon");
                }
                videodetail.from("#mycorner");
                infoObj.pageId = "mycorner";
                videodetail.showDetailWithNew(infoObj);
                var commentAmount = infoObj.commentAmount ?  infoObj.commentAmount : 0;
                videodetail.showCommentsContent(commentAmount);
                initPageLoading("wrapper_comments");
                $.mobile.newChangePage("#video_detailed",{ transition: "slide",reverse: false,changeHash: false});
            }
        },{async:false});
    };
    //点击更多
    $("#corner_content .moreicon").on("click",function(){
        var type = $(this).attr("type");
        $("#mycornerall_content #cornerall_ul").attr("type",type);
        if(type == "reg"){
            $("#title_cornerall").html("Registered Activities");
            $("#title_type").html("ALL ACTIVITIES I REGISTERED");
            $(".cornerallheadcolor").removeClass("likebgcolor surveybgcolor").addClass("regbgcolor");
        }
        else if(type == "survey"){
            $("#title_cornerall").html("SURVEY I PARTICIPATED");
            $("#title_type").html("ALL SURVIES I PARTICIPATED");
            $(".cornerallheadcolor").removeClass("regbgcolor likebgcolor").addClass("surveybgcolor");
        }
        else{
            $("#title_cornerall").html("Articles I Liked");
            $("#title_type").html("ALL ARTICLES I LIKED");
            $(".cornerallheadcolor").removeClass("regbgcolor surveybgcolor").addClass("likebgcolor");
        }
        $.mobile.newChangePage("#mycornerallarticle",{ transition: "slide",reverse: false,changeHash: false});
    });
    $('#corner_content').on('click', 'li.articles', function(evt) {
        window.disableTouch = true;
        var type = $(this).attr("types");
        var id = $(this).attr("idflag");
        var reg = $(this).attr("reg");
        var cornertype = $(this).attr("cornertype");
        var enrollStatus = $(this).attr("enrollStatus");
        getDetailInfo(id,type,reg,cornertype,enrollStatus);
    });
    $('#corner_content').on('click', 'li.survey', function(evt) {
        window.disableTouch = true;
        var id = $(this).attr("idflag");
        var cornertype = $(this).attr("cornertype");
        var questioniInfos = null;
        var surveyInfo = null;
        net.post('survey/getSurveyDetial', {
            'survey_id':id,
            'appOrPCFlag':'APP',
            'userId' :q['user'].userId
        }, function(error){
        }, function(response){
            if (response.code != 0) {
                dia.alert('Confirmation', response.msg, ['OK'], function(title) {
                });
            }
            else{
                surveyInfo = response.data.survey;
                questioniInfos = response.data.survey.questions;
                surveyInfo.showeye = showeye;
                surveyInfo.fromtype = cornertype;
                $("#video_detailed").page();
                $('#video_detailed_listview').empty();
                $('#survey_listview_comments').empty();
                $("#video_detailed .praises_desc i").removeClass("praises_icon_no");
                $("#video_detailed .activity_commentarea").hide();
                $("#video_detailed .add_comment").hide();
                if($("#video_detailed .addcomments_state").hasClass("exsit")){
                    $("#video_detailed .no_comment").removeClass("exsit");
                }
                $("#commentinfo_survey").val("");
                $("span.survey_textlength").html(0);
                if($("#video_detailed .addcomments_state").hasClass("canclecomments_icon")){
                    $("#video_detailed .addcomments_state").addClass("addcomments_icon");
                    $("#video_detailed .addcomments_state").removeClass("canclecomments_icon");
                }
                videodetail.from("#mycorner");
                surveyInfo.pageId = "mycorner";
                videodetail.showDetailWithNew(surveyInfo);
                var commentAmount = surveyInfo.commentAmount ?  surveyInfo.commentAmount : 0;
                videodetail.showCommentsContent(commentAmount);
                var $wrapper = $("#wrapper_comments_survey"),
                    $pullDownEl = $wrapper.find("#pullDown_comments_survey");
                var $pullDownLabel = $pullDownEl.find(".pullDownLabel");
                if ($wrapper.find("ul").html()) {
                    $wrapper.find(".scroller").css(window.getVendorStyle("transform"), "translate(0,0)");
                    $pullDownEl.attr("class", "loading");
                    $pullDownLabel.text("Loading...")
                }
                $.mobile.newChangePage("#video_detailed",{ transition: "slide",reverse: false,changeHash: false});

            }
        },{async:false});
    });


    $('#mycorner_upload').off('click').on('click',function(evt){
        if($("#mycorner_upload_content").hasClass("showuploadcatlog")){
            $("#mycorner_upload_content").removeClass("showuploadcatlog") ;
            $("#mycorner_upload_content").slideUp(500);
        }
        else{
            $("#mycorner_upload_content").addClass("showuploadcatlog") ;
            $("#mycorner_upload_content").slideDown(500);
        }
    });


    $('#mycorner_upload_opacity').off('click').on('click',function(evt){
        $("#mycorner_upload_content").removeClass("showuploadcatlog") ;
        $("#mycorner_upload_content").slideUp(500);
    });
    $('#mycorner_upload_info div').off('click').on('click',function(evt){
        var url = $(this).attr("url");
        if(url == "#uploadinfo"){
            $("#mycorner_upload_content").removeClass("showuploadcatlog") ;
            $("#mycorner_upload_content").slideUp(500);
            $.mobile.newChangePage(url,{ transition: "slide",reverse: false,changeHash: false});
        }
        else if(url == "#upload_videos"){
            pushJumpPage.pushVideoPage(q['user'].userId,
                function(data){
                    $("#mycorner_upload_content").removeClass("showuploadcatlog") ;
                    $("#mycorner_upload_content").slideUp(500);
                    $.mobile.newChangePage("#uploadinfo",{ transition: "slide",reverse: false,changeHash: false});
                },
                function(error) {
                    $("#mycorner_upload_content").removeClass("showuploadcatlog") ;
                    $("#mycorner_upload_content").slideUp(500);
            });
        }
        else if(url == "#upload_photo"){
            pushJumpPage.pushImagePage(q['user'].userId,
                function(data){
                    $("#mycorner_upload_content").removeClass("showuploadcatlog") ;
                    $("#mycorner_upload_content").slideUp(500);
                    $.mobile.newChangePage("#uploadinfo",{ transition: "slide",reverse: false,changeHash: false});
                },
                function(error) {
                    $("#mycorner_upload_content").removeClass("showuploadcatlog") ;
                    $("#mycorner_upload_content").slideUp(500);
            });
        }
    });

    $('#mycorner_btn_back').off('click').on('click',function(){
        $.mobile.newChangePage("#myCornerHome",{ transition: "slide",reverse: true,changeHash: false});
    });
    $("#mycorner").on( "pagecreate", function() {
        $( "body > [data-role='panel']" ).panel();
        $( "body > [data-role='panel'] [data-role='listview']" ).listview();
    });

    $("#mycorner").on( "pagebeforeshow", function() {
        // getRegActivity();
        $('#news_footer').hide();
        $('#corner_article_ul').hide();
        $("#corner_content .corner_content_height").css("background", "none");
        window.setBodyOverflow($(document.body));
        $('#corner_content').css('height',($(window).height()-44-20));
        $('#corner_content .corner_content_height').css('height',($(window).height()-60-4));
        $('#mycorner_upload_content').css('height', ($(window).height() - 44-20));
        $('#mycorner_upload_opacity').css('height', ($(window).height() - 44 - 16 - 150));
        var $wrapper = $("#mycorner_load");
        $wrapper.addClass("loading").show();
        var postData = {};
        postData['paramKey'] = "news";
        net.post('param/getParamByKey', postData, function(error){
            },
            function(response){
                if (response.code != 0) {
                }
                else {
                    showeye = response.data.param.param_value;
                }
            },{loading:false});
    });
    // 展示的时候请求新闻
    $("#mycorner").on( "pageshow", function( event ) {
        if($("#corner_content_height").hasClass("push")){
            $("#corner_content_height").removeClass("push");
        }
        // console.error("#mycorner");
        disableClickEvent(true);
        $("#mycorner li.articles").remove();
        $("#mycorner li.survey").remove();
        $("#mycornerallarticle li.articlesall").remove();

        // getLikeNews();

        // getRegSurvey();

        getRegActivity();


        $("#mycorner_load").hide();
        if($("#corner_activity_ul li.articles").size() > 0){
            // $("#corner_activity_ul").show();
            $("#corner_survey_ul").css("margin","0px 0px");
        }
        else{
            $("#corner_survey_ul").css("margin","10px 0px 0px");
        }
        if($("#corner_survey_ul li.survey").size() > 0 ){
            $("#corner_survey_ul").show();
            $("#corner_article_ul").css("margin","0px 0px");
        }
        else if($("#corner_activity_ul li.articles").size() > 0) {
            $("#corner_article_ul").css("margin","0px 0px");
        }
        else{
            $("#corner_article_ul").css("margin","10px 0");
        }
        if($("#corner_article_ul li.articles").size() > 0 || $("#corner_article_ul li.survey").size() > 0){
            $("#corner_article_ul").show();
        }


//           if( $("#corner_activity_ul li.articles").size() == 0 ) {
//             var padTop = $(window).height()/2-60;
//             $("#corner_content .corner_content_height").append('\<div id="mycorner_nocontent" style="height:'+($(window).height()-44-20)+'\px;padding-top:\
//             '+padTop+'\px;text-align: center;background:#fff;color:#808080;font-size:14px; margin: 10px 0;padding-left: 20px; padding-right: 20px;">\
//             Articles you liked and activities you registered can be easily found here.</div>');
//         }
//         else{
//             $("#corner_content .corner_content_height").css("background", "#fff");
//         }

        // window.historyView = [];
        window.shouldPageRefresh.newsroom = true;
    });
    $("#mycorner").on( "pagehide", function( event ) {
        if($("#mycorner_upload_content").hasClass("showuploadcatlog")){
            $("#mycorner_upload_content").removeClass("showuploadcatlog") ;
            $("#mycorner_upload_content").slideUp(500);
        }
        $("#corner_article_ul").hide();
        $("#corner_activity_ul").hide();
        $("#corner_survey_ul").hide();
        $("#mycorner_nocontent").remove();
        var $wrapper = $("#mycorner_load");
        $wrapper.removeClass("loading").show();

    });
    function stopEventPropagation(event) {
        event.stopPropagation();
    }

    function disableClickEvent(addListener) {
        var $disabledBody = $("body.disabled");
        if ($disabledBody.length > 0) {
            if (addListener) {
                $disabledBody[0].addEventListener("click", stopEventPropagation, true);
            } else {
                $disabledBody[0].removeEventListener("click", stopEventPropagation, true);
                $disabledBody.removeClass("disabled");
            }
        }
    }
});
