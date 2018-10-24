/**
 * Created by testbetta1 on 15/8/27.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs', 'videoDetailed','panle'], function($, m, net, dia, videodetail,panle) {
    // 补充0
    var isScrolling = false,
        showeye = "false",
        iScroll_allcorner = {
            myScroll: null,
            allowGetMore: true,
            pullUpAction: function () {
                if($("#mycornerall_content #cornerall_ul").attr("type") == "reg"){
                    getRegActivity(false);
                }
                else{
                    getLikeNews(false);
                }
            },
            loaded: function(wrapper) {
                var $wrapper = $("#" + wrapper),
                    $pullUpEl = $wrapper.find("#pullUp_allcorner"),
                    $pullUpLabel = $pullUpEl.find(".pullUpLabel"),
                    $pullUpIcon = $pullUpEl.find(".pullUpIcon"),
                    pullUpOffset = $pullUpEl[0].offsetHeight;
                    iScroll_allcorner.myScroll = new iScroll(wrapper, {
                    hScrollbar: false,
                    vScrollbar: false,
                    useTransition:false,
                    checkDOMChanges:false,
                    onRefresh: function () {
                        if ($pullUpEl.hasClass("loading")) {
                            $pullUpEl.removeClass("loading");
                            if (iScroll_allcorner.allowGetMore) {
                                $pullUpIcon.show();
                                $pullUpLabel.text("Pull up to load more...");
                                $("#pullUp_allcorner").show();
                            } else {
                                $pullUpIcon.hide();
                                $pullUpLabel.text("");
                                $("#pullUp_allcorner").hide();
                            }
                        }
                    },
                    onScrollMove: function () {
                        if (this.y < (this.maxScrollY - 5) && !$pullUpEl.hasClass("flip")) {
                            if (iScroll_allcorner.allowGetMore) {
                                $pullUpEl.addClass("flip");
                                $pullUpLabel.text("Release to refresh...");
                                $("#pullUp_allcorner").show();
                                this.maxScrollY = this.maxScrollY;
                            }
                        } else if (this.y > (this.maxScrollY + 5) && $pullUpEl.hasClass("flip")) {
                            if (iScroll_allcorner.allowGetMore) {
                                $pullUpEl.removeClass("flip");
                                $pullUpLabel.text("Pull up to load more...");
                                $("#pullUp_allcorner").show();
                                this.maxScrollY = pullUpOffset;
                            }
                        }
                        isScrolling = true;
                    },
                    onScrollEnd: function () {
                        if ($pullUpEl.hasClass("flip")) {
                            if (iScroll_allcorner.allowGetMore) {
                                iScroll_allcorner.allowGetMore = false;
                                $pullUpEl.attr("class", "loading");
                                $pullUpLabel.text("Loading...");
                                $("#pullUp_allcorner").show();
                                iScroll_allcorner.pullUpAction();
                            }
                        }
                        setTimeout(function() {
                            isScrolling = false;
                        }, 500);
                    }
                });
            }
        };
    // 当前页数
    var currentPageNumer = 1;
    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    //创建注册survey
    function creatSurvey(title,time,id,type,cornerType) {
        if(cornerType == "like"){
            cornerType = "likeSurvey";
        }
        var html = '\<li  style="margin: 0px; padding:12px 0px;border: none; border-bottom: 1px solid #e0e0e0;" class="articlesall"  cornertype="'+cornerType+'"  types="'+type+'" idflag="'+id+'"\><div style="float:left;padding: 1px 10px 0 10px;font-family:Arial;font-size: 14px;font-weight: normal;width: 85%;">\
            \<div style="font-size: 14px; white-space:normal;color: #404040;word-break:break-word;margin-bottom:12px;text-overflow: ellipsis;max-height: 38px;height: auto; overflow: hidden;display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">'+title+'\</div>\
              \<div style="font-size: 10px;white-space: normal;color: #808080;">'+time+'\</div></div>\
            \<div style="float: right; padding:9px 0px 0px 0px;margin-right:3px;"><i class="right_icon"></i></div></li>';
        return html;
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
        var html = '\<li  style="margin: 0px; padding:12px 0px;border: none; border-bottom: 1px solid #e0e0e0;" class="articlesall" reg="'+reg+'" enrollStatus = "'+enrollStatus+'"  cornertype="'+fromtype+'" types="'+type+'" idflag="'+id+'"\><div style="float:left;padding: 1px 10px 0 10px;font-family:Arial;font-size: 14px;font-weight: normal;width: 85%;">\
            \<div style="font-size: 14px; white-space:normal;color: #404040;word-break:break-word;margin-bottom:12px;text-overflow: ellipsis;max-height: 38px;height: auto; overflow: hidden;display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">'+activityBrifContent+'\</div>\
              \<div style="font-size: 10px;white-space: normal; '+csstime+'">'+colorStatus+time+'\</div></div>\
            \<div style="float: right; padding:9px 0px 0px 0px;margin-right:3px;"><i class="right_icon"></i></div></li>';
        return html;
    }
    /**
     * 展示已点赞新闻/展示当前已注册活动
     * @param content
     */
    function showLikeOrRegArticle(contentList,from) {
        var contentHTML = "",
            contentArray = [],
            $corner_all_listview = $("#cornerall_ul");
            $.each(contentList, function(i, content) {
                console.assert(content.types != null, '要展示的内容都没有类型啊');
            if (content.types == 'new') {
                contentArray.push(getNewsHTML(content));
            }
            else if (content.types == 'activity') {
                contentArray.push(getAcitvityHTML(content,from));
            }
            else if (content.types == 'survey') {
                contentArray.push(getSurveyHTML(content,from));
            }
            else {
                console.assert(false, '除了新闻和活动，目前不会有%s类型。', content.types);
            }
        });
        contentHTML = contentArray.join("");
        $corner_all_listview.append(contentHTML);
        $("#pullUp_allcorner").show();
        $corner_all_listview.listview("refresh");
        if (iScroll_allcorner.myScroll == null) {
            iScroll_allcorner.loaded("wrapper_allcorner");
        }
    }
    /**
     * 展示已注册survey
     * @param content
     */
    function showSurveies(contentList,conrnerType) {
        var contentHTML = "",
            contentArray = [],
            $corner_all_listview = $("#cornerall_ul");
        $.each(contentList, function(i, content) {
            contentArray.push(getSurveyHTML(content,conrnerType));
        });
        contentHTML = contentArray.join("");
        $corner_all_listview.append(contentHTML);
        $("#pullUp_allcorner").show();
        $corner_all_listview.listview("refresh");
        if (iScroll_allcorner.myScroll == null) {
            iScroll_allcorner.loaded("wrapper_allcorner");
        }
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
        if(from == "reg"){
            if (activity.finishFlag == "false") {
                var enrollStatus = activity.enrollStatus;
                if(enrollStatus == 0){
                    var startDate = new Date(activity.startTime * 1000);
  //                var endDate = new Date(activity.endTime * 1000);
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
        var li = creatArticle(activity.subject,time, activity.id,activity.types,(activity.regFlag ? activity.regFlag:"yes"),enrollStatus,from);
        return li;
    }

    function getSurveyHTML(survey,cornerType) {
        var submitTime = new Date(survey.deadline * 1000);
        var month = getMonthString(submitTime.getMonth());
        var time = 'Participated on ' + submitTime.getDate() + " " + month + " " + submitTime.getFullYear();
        var li = creatSurvey(survey.subject,time, survey.survey_id,survey.types,cornerType);
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
    function getRegActivity(refresh) {
        $("#mycornerallarticle").page();
        if (refresh) {
            currentPageNumer = 1;
        }
        var postData = {};
        postData['pager.pageNo'] = currentPageNumer;
        postData['pager.pageSize'] = 10;
        postData['userId'] = q['user'].userId;
        // 获取新闻
        net.post('myCorner/getAllRegActivity', postData, function(error){
        }, function(response){
            if (response.code != 0) {
                dia.alert('Confirmation', response.msg, ['OK'], function(title) {
                }); 
            } else {
                var newsList = response.data.ActivityList,
                    newsListLength = newsList.length;
                if (newsListLength > 0)  {
                    showLikeOrRegArticle(newsList,"reg");
                    currentPageNumer++;
                }
                var $pullUpEl = $("#wrapper_allcorner").find("#pullUp_allcorner"),
                    $pullUpLabel = $pullUpEl.find(".pullUpLabel"),
                    $pullUpIcon = $pullUpEl.find(".pullUpIcon");
                if (newsListLength == 0) {
                    iScroll_allcorner.allowGetMore = false;
                } else {
                    iScroll_allcorner.allowGetMore = true;
                }

                setTimeout(function() {
                    var $cornerAllgHeight = $(window).height()-44-20-50-10;
                    if(iScroll_allcorner.myScroll){
                        iScroll_allcorner.myScroll.refresh();
                    }
                    if(newsListLength == 0){
                        $pullUpEl.show();
                        $pullUpIcon.hide();
                        $pullUpLabel.text("");
                        $("#pullUp_allcorner").hide();
                    }
                    else{
                        $("#pullUp_allcorner").show();
                        $cornerAllgHeight = $(window).height()-44-20;
                    }

                    if(refresh && newsListLength > 0){
                        $("#cornerall_ul").show();
                    }
                    $("#cornerall_ul").css("min-height",$cornerAllgHeight+"px");
                    disableClickEvent(false);
                }, 800);
            }
        },{async:false,loading:false});
    }

    function getRegSurvey(refresh) {
        $("#mycornerallarticle").page();
        if (refresh) {
            currentPageNumer = 1;
        }
        var postData = {};
        postData['pager.pageNo'] = currentPageNumer;
        postData['pager.pageSize'] = 10;
        postData['userId'] = q['user'].userId;
        // 获取新闻
        net.post('myCorner/getAllRegSurvey', postData, function(error){
        }, function(response){
            if (response.code != 0) {
                dia.alert('Confirmation', response.msg, ['OK'], function(title) {
                });

            } else {
                var surveyList = response.data.SurveyList,
                    surveyListLength = surveyList.length;
                if (surveyListLength > 0)  {
                    showSurveies(surveyList,"regSurvey");
                    currentPageNumer++;
                }
                var $pullUpEl = $("#wrapper_allcorner").find("#pullUp_allcorner"),
                    $pullUpLabel = $pullUpEl.find(".pullUpLabel"),
                    $pullUpIcon = $pullUpEl.find(".pullUpIcon");
                if (surveyListLength == 0) {
                    iScroll_allcorner.allowGetMore = false;
                } else {
                    iScroll_allcorner.allowGetMore = true;
                }
                setTimeout(function() {
                    var $cornerAllgHeight = $(window).height()-44-20-50-10;
                    if(iScroll_allcorner.myScroll){
                        iScroll_allcorner.myScroll.refresh();
                    }
                    if(surveyListLength == 0){
                        $pullUpEl.show();
                        $pullUpIcon.hide();
                        $pullUpLabel.text("");
                        $("#pullUp_allcorner").hide();
                    }
                    else{
                        $("#pullUp_allcorner").show();
                        $cornerAllgHeight = $(window).height()-44-20;
                    }

                    if(refresh && surveyListLength > 0){
                        $("#cornerall_ul").show();
                    }
                    $("#cornerall_ul").css("min-height",$cornerAllgHeight+"px");
                    disableClickEvent(false);
                }, 800);
            }
        },{async:false,loading:false});
    }

    function getLikeNews(refresh) {
        $("#mycornerallarticle").page();
        if (refresh) {
            currentPageNumer = 1;
        }
        var postData = {};
        postData['pager.pageNo'] = currentPageNumer;
        postData['pager.pageSize'] = 10;
        postData['userId'] = q['user'].userId;
        // 获取新闻
        net.post('myCorner/getAllLikeArticles', postData, function(error){
        }, function(response){
            if (response.code != 0) {
                dia.alert('Confirmation', response.msg, ['OK'], function(title) {
                }); 
            } else {
                var newsList = response.data.ArticlesList,
                    newsListLength = newsList.length;
                if (newsListLength > 0)  {
                    showLikeOrRegArticle(newsList,"like");
                    currentPageNumer++;
                }
                var $pullUpEl = $("#wrapper_allcorner").find("#pullUp_allcorner"),
                    $pullUpLabel = $pullUpEl.find(".pullUpLabel"),
                    $pullUpIcon = $pullUpEl.find(".pullUpIcon");
                if (newsListLength == 0) {
                    iScroll_allcorner.allowGetMore = false;
                } else {
                    iScroll_allcorner.allowGetMore = true;
                }
                setTimeout(function() {
                    var $cornerAllgHeight = $(window).height()-44-20-50-10;
                    if(iScroll_allcorner.myScroll){
                        iScroll_allcorner.myScroll.refresh();
                    }
                    if(newsListLength == 0){
                        $pullUpEl.show();
                        $pullUpIcon.hide();
                        $pullUpLabel.text("");
                        $("#pullUp_allcorner").hide();
                    }
                    else{
                        $("#pullUp_allcorner").show();
                        $cornerAllgHeight = $(window).height()-44-20;
                    }

                    if(refresh && newsListLength > 0){
                        $("#cornerall_ul").show();
                    }
                    $("#cornerall_ul").css("min-height",$cornerAllgHeight+"px");
                    disableClickEvent(false);
                }, 800);
            }
        },{async:false,loading:false});
    }
    var getSurveyDetailInfo = function(id,type,cornertype){
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
                surveyInfo.showeye = showeye;
                surveyInfo.fromtype = cornertype;
                questioniInfos = response.data.survey.questions; 
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
                videodetail.from("#mycornerallarticle");
                videodetail.pageId = "mycornerallarticle";
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
    }
    //获取新闻详情
    var getDetailInfo = function(id,type,reg,cornertype,enrollStatus){
        var postData = {};
        var command = null;
        postData['appOrPCFlag'] = "APP";
        postData['userId'] = q['user'].userId;
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
                if(type == "new") {
                    infoObj = response.data.news;
                    infoObj.showeye = showeye;
                    infoObj.fromtype = cornertype;
                }
                else if(type == "activity") {
                    infoObj = response.data.activity;
                    infoObj.showeye = showeye;
                    infoObj.reg = reg;
                    infoObj.fromtype = cornertype;
                    infoObj.enrollStatus = enrollStatus;
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
                        $("#pullUp_allcorner").show();
                    }
                }
                
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
                videodetail.from("#mycornerallarticle");
                videodetail.pageId = "mycornerallarticle";
                videodetail.showDetailWithNew(infoObj);
                var commentAmount = infoObj.commentAmount ?  infoObj.commentAmount : 0;
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
    };

    $('#mycornerall_content').on('tap', 'li.articlesall', function(evt){
        window.disableTouch = true;
        var type = $(this).attr("types");
        var id = $(this).attr("idflag");
        var reg = $(this).attr("reg");
        var cornertype = $(this).attr("cornertype");
        var enrollStatus = $(this).attr("enrollStatus");
        if(type == "survey"){
            getSurveyDetailInfo(id,type,cornertype);
        } else{
            getDetailInfo(id,type,reg,cornertype,enrollStatus);
        }
    });
    $('.back_menu,.btn_back').on('click',function() {
        $('.back_menu').hide();
        $.mobile.backChangePage("#myCornerHome",{transition: "slide",reverse: false,changeHash: false});
    });

    // $('#mycornerall_content').on('swiperight',function() {
    //     $.mobile.backChangePage("#mycorner",{ transition: "slide",reverse: true,changeHash: false});
    // });

    $("#mycornerallarticle").on( "pagebeforeshow", function() {
        window.setBodyOverflow($(document.body));
        $('#mycornerall_content').css('height',($(window).height()-44-20));
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
        initPageLoad("wrapper_allcorner");
        $('#cornerall_ul li.articlesall').remove();
    });
    // 展示的时候请求新闻
    $("#mycornerallarticle").on( "pageshow", function( event ) {
        console.error("#mycornerallarticle");
        disableClickEvent(true);
        if($("#mycornerall_content #cornerall_ul").attr("type") == "reg"){
            getRegActivity(true);
        }
        else if($("#mycornerall_content #cornerall_ul").attr("type") == "survey"){
            getRegSurvey(true);
        }
        else{
            getLikeNews(true);
        }
        // window.historyView = [];
    });

    $("#mycornerallarticle").on( "pagehide", function( event ) {
        var $wrapper = $("#wrapper_allcorner"),
            $pullUpEl = $wrapper.find("#pullUp_allcorner"),
            $pullUpIcon = $pullUpEl.find(".pullUpIcon"),
            $pullUpLabel = $pullUpEl.find(".pullUpLabel");
            $pullUpEl.removeClass("flip").removeClass("loading");
            $pullUpLabel.text("Loading...");
            $pullUpIcon.show();
            $("#pullUp_allcorner").show();
            $("#cornerall_ul").css("min-height","0px");
            $("#cornerall_ul").hide();
    });

    function initPageLoad(wrapper) {
        var $wrapper = $("#" + wrapper),
            $pullDownEl = $wrapper.find("#pullUp_allcorner"),
            $pullDownLabel = $pullDownEl.find(".pullDownLabel");
            $wrapper.find(".scroller").css(window.getVendorStyle("transform"), "translate(0, 0)");
            $pullDownEl.attr("class", "loading");
            $pullDownLabel.text("Loading...");
            $("#pullUp_allcorner").show();
    }
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