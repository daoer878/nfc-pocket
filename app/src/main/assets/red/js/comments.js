/**
 * Created by fannie on 2017/1/23.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs','videoDetailed','bookDetailed','panle'], function($, m, net, dia,videodetail,bookdetail,panle) {
    var showeye = "false";
    var currentPage = 1;//当前页
    var commentscount = null;
    var likeAmount = null;
    var isLike = false;

    var isScrolling = false,
        iScroll_news = {
            myScroll: null,
            allowGetMore: true,
            pullDownAction: function() {
                $('#pullUp_comments').hide();
                show_comment(true);

            },
            pullUpAction: function() {
                show_comment(true,currentPage);
            },
            loaded: function(wrapper)  {
                var $wrapper = $("#" + wrapper),
                    $pullDownEl = $wrapper.find("#pullDown_comments"),
                    $pullDownLabel = $pullDownEl.find(".pullDownLabel"),
                    pullDownOffset = $pullDownEl[0].offsetHeight,
                    $pullUpEl = $wrapper.find("#pullUp_comments"),
                    $pullUpLabel = $pullUpEl.find(".pullUpLabel"),
                    $pullUpIcon = $pullUpEl.find(".pullUpIcon"),
                    pullUpOffset = $pullUpEl[0].offsetHeight;

                iScroll_news.myScroll = new iScroll(wrapper, {
                    hScrollbar: false,
                    vScrollbar: false,
                    useTransition:false,
                    checkDOMChanges:false,
                    topOffset: pullDownOffset,
                    onRefresh: function () {
                        if ($pullDownEl.hasClass("loading")) {
                            $pullDownEl.removeClass("loading");
                            $pullDownLabel.text("Pull down to refresh...");
                        } else if ($pullUpEl.hasClass("loading")) {
                            $pullUpEl.removeClass("loading");
                            if (iScroll_news.allowGetMore) {
                                $pullUpIcon.show();
                                $pullUpLabel.text("Pull up to load more...");
                            } else {
                                $pullUpIcon.hide();
                                $pullUpLabel.text("No more articles available!");
                                $pullUpEl.css('margin-top','-10px');
                            }
                        }
                    },
                    onScrollMove: function () {
                        if (this.y > 5 && !$pullDownEl.hasClass("flip")) {
                            $pullDownEl.addClass("flip");
                            $pullDownLabel.text("Release to refresh...");
                            this.minScrollY = 0;
                            $pullDownEl.css("margin-top","0px");
                        } else if (this.y < 5 && $pullDownEl.hasClass("flip")) {
                            $pullDownEl.removeClass("flip");
                            $pullDownLabel.text("Pull down to refresh...");
                            $pullDownEl.css("margin-top","0px");
                            this.minScrollY = -pullDownOffset;
                        } else if (this.y < (this.maxScrollY - 5) && !$pullUpEl.hasClass("flip")) {
                            if (iScroll_news.allowGetMore) {
                                $pullUpEl.addClass("flip");
                                $pullUpLabel.text("Release to refresh...");
                                this.maxScrollY = this.maxScrollY;
                            }
                        } else if (this.y > (this.maxScrollY + 5) && $pullUpEl.hasClass("flip")) {
                            if (iScroll_news.allowGetMore) {
                                $pullUpEl.removeClass("flip");
                                $pullUpLabel.text("Pull up to load more...");
                                this.maxScrollY = pullUpOffset;
                            }
                        }
                        isScrolling = true;
                    },
                    onScrollEnd: function () {
                        console.log("onScrollEnd"+this.y);
                        if(this.y >= -50){
                            $('div[id=newsroom_top]').fadeOut();
                        }
                        else{
                            $('div[id=newsroom_top]').fadeIn();
                        }
                        if ($pullDownEl.hasClass("flip")) {
                            $pullDownEl.attr("class", "loading");
                            $pullDownLabel.text("Loading...");
                            iScroll_news.pullDownAction();
                            $pullDownEl.css("margin-top","0px");
                        } else if ($pullUpEl.hasClass("flip")) {
                            if (iScroll_news.allowGetMore) {
                                iScroll_news.allowGetMore = false;
                                $pullUpEl.attr("class", "loading");
                                $pullUpLabel.text("Loading...");
                                iScroll_news.pullUpAction();
                            }
                        }
                        else{
                            $pullDownEl.css("margin-top","0px");
                        }
                        setTimeout(function() {
                            isScrolling = false;
                        }, 500);
                    }
                });
            }
        };

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

    function getHm(hours,minutes){
        var dn="AM";
        if (hours>12){
            dn="PM";
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
        var ctime=hours+":"+minutes+" "+dn ;
        return ctime;
    }

    function comPageLoading(wrapper) {
        var $wrapper = $("#" + wrapper),
            $pullDownEl = $wrapper.find("#pullDown_comments"),
            $pullUpEl = $wrapper.find("#pullUp_comments");
        $pullUpEl.hide();
        var $pullDownLabel = $pullDownEl.find(".pullDownLabel");
        $wrapper.find(".scroller").css(window.getVendorStyle("transform"), "translate(0, 0)");
        $pullDownEl.css("margin-top","10px").attr("class", "loading");
        $pullDownLabel.text("Loading...");
    }

    function show_comment(refresh,page){
        if(page){
            currentPage = page;
        }else{
            currentPage = 1;
            $('#comments_ul').html("");
            if (iScroll_news.myScroll && iScroll_news.myScroll.y !== 0) {
                iScroll_news.myScroll.y = 0;
            }
        }
        var postData = {};
        postData['userId'] = q['user'].userId;
        postData['pager.pageNo'] = currentPage;
        // postData['pager.pageSize'] = 5;
        net.post('myCorner/getuserscomments',postData,function (error) {

        },function (response) {
            if (response.code != 0) {

            } else {
                var comment = response.data.myCommnets;
                var commentLength = comment.length;
                var commentHtml = [];
                var contId;//评论Id
                $.each(comment, function (index, val) {

                    var commentList = val.commentList;//评论列表
                    var commentId = val.id;//ID
                    var comIcon = val.icon;//图标
                    var comTitle = val.title;//标题
                    var comContent = val.details;//内容
                    var type = val.type;//类型
                    commentHtml.push('<div id="' + commentId + '"  type="'+type+'" class="comment_oll" style="width:100%;margin-bottom: 10px;">\
                                                <div style="width:100%;height:50px;">\
                                                    <div style="width: 15%;float:left;height:48px;"><img src="' + comIcon + '" style="width:48px;height:48px;"/></div>\
                                                    <div style="width:85%;float:right">\
                                                        <div style="width:100%;height:24px;line-height:24px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#000333;">' + comTitle + '</div>\
                                                        <div style="width:100%;height:24px;line-height:24px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#727272;">' + comContent + '</div>\
                                                    </div>\
                                                </div>\
                                                <div  style="background-color: rgb(239,239,239);overflow:hidden;">\
                                                    <div style="width:9%;float:left;height:50px;"><div class="icon-coll"></div></div>');
                    $.each(commentList, function (index, vol) {
                        var comments = vol.comments;//评论内容
                        // var publish_time = vol.publish_time;//评论时间
                        var date = new Date((vol.publish_time) * 1000);
                        var month = getMonthString(date.getMonth());
                        var hm = getHm(date.getHours(), date.getMinutes());
                        var time = month + "." + " " + date.getDate() + "," + date.getFullYear() + " " + hm;

                        var canDelete = vol.canDelete;//是否显示delete;
                        contId = vol.id;//评论ID
                        var name = vol.userName;//评论用户名
                        if(canDelete == true){
                            commentHtml.push('<div  id="' + contId + '" class="comment_cla" style="width:85%;float:right;margin:10px 10px 0 10px;border-bottom:1px solid #e4e4e4;padding-bottom: 10px;">\
                                                        <div style="width:100%;height:44px;">\
                                                        <div style="width:100%;height:21px;line-height:21px;">\
                                                            <div style="width:40%;float:left;color:#404040;font-size:12px;">' + name + '</div>\
                                                            <div style="width:60%;float:right;text-align: right;color:#999999;font-size:12px;">' + time + '</div>\
                                                        </div>\
                                                        <div style="width:100%;height:21px;line-height:21px;margin-top: 5px;">\
                                                            <div style="width:80%;float:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size: 12px;color:#404040;">' + comments + '</div>\
                                                            <div id="'+contId+'" class="delete_btn" style="color:#0088cc;font-size:12px;width:20%;float:right;text-align: right;">Delete</div>\
                                                        </div>\
                                                    </div>\
                                          </div>');
                        }else{
                            commentHtml.push('<div  id="' + contId + '" class="comment_cla" style="width:85%;float:right;margin:10px 10px 0 10px;border-bottom:1px solid #e4e4e4;padding-bottom: 10px;">\
                                                        <div style="width:100%;height:44px;">\
                                                        <div style="width:100%;height:21px;line-height:21px;">\
                                                            <div style="width:40%;float:left;color:#404040;font-size:12px;">' + name + '</div>\
                                                            <div style="width:60%;float:right;text-align: right;color:#999999;font-size:12px;">' + time + '</div>\
                                                        </div>\
                                                        <div style="width:100%;height:21px;line-height:21px;margin-top: 5px;">\
                                                            <div style="width:80%;float:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size: 12px;color:#404040;">' + comments + '</div>\
                                                        </div>\
                                                    </div>\
                                          </div>');
                        }

                    });
                    commentHtml.push('</div></div>');
                });

                $('#comments_ul').append(commentHtml.join(""));

                var obj = $('#comments_ul').find('div.comment_oll');
                obj.each(function (index,val) {
                    var type = $(this).attr('type');
                    if(type == 'survey'){
                        $(this).addClass('survey').removeClass('comment_oll');
                    }else if(type == 'book'){
                        $(this).addClass('book').removeClass('comment_oll');
                    }else{
                        $(this).removeClass('survey').removeClass('book').addClass('comment_oll');
                    }
                });


                if(commentLength > 0){
                    currentPage++;
                }else{
                    if(currentPage != 1){
                        $('#comments_ul').append("");
                    }else{
                        $('#comments_ul').html("");
                    }
                }

                //点击Delete按钮删除当前评论
                $('.delete_btn').off('click').on('click', function (event) {
                    var tId = $(this).attr("id");
                    var sId = $(this).parent().parent().parent('.comment_cla').attr('id');
                    var postData = {};
                    postData['userId'] = q['user'].userId;
                    postData['commentId'] = sId;
                    net.post('myCorner/deleteComments',postData,function(error){

                    },function(response){
                        if(response.code != 0){

                        }else{
                            if(tId == sId){
                                $('#'+sId).remove();
                            }
                        }
                    });
                    event.stopPropagation();
                });

                //最后一个元素border不显示
                $('.comment_oll').find('.comment_cla:last').css('border', "none");

                if (iScroll_news.myScroll == null) {
                    iScroll_news.loaded("coms_wrapper");
                }

                var $pullUpEl = $("#coms_wrapper").find("#pullUp_comments"),
                    $pullUpLabel = $pullUpEl.find(".pullUpLabel"),
                    $pullUpIcon = $pullUpEl.find(".pullUpIcon");

                if(refresh){
                    if(commentLength < 10){
                        $pullUpIcon.hide();
                        $pullUpLabel.text("No more articles available!");
                    }else{
                        $pullUpLabel.text("Pull up to load more...");
                        $pullUpIcon.show();
                        $pullUpEl.show();
                    }
                    if (iScroll_news.myScroll && iScroll_news.myScroll.y !== 0) {
                        iScroll_news.myScroll.y = 0;
                    }
                }
                iScroll_news.allowGetMore = true;
                // if (commentLength < 1) {
                //     iScroll_news.allowGetMore = false;
                // } else {
                //     iScroll_news.allowGetMore = true;
                // }

                setTimeout(function(){
                    if(iScroll_news.allowGetMore){
                        iScroll_news.myScroll.refresh();
                    }
                    if(commentLength == 0){
                        $pullUpEl.show();
                        $pullUpIcon.hide();
                        $pullUpLabel.text("No more articles available!");
                        $pullUpEl.css("margin-top","0px");
                    }
                },300);
                window.shouldPageRefresh.newsroom = false;

                $('#pullUp_comments').removeClass('flip');
            }
        },{loading:false});
    }

    var getDetailInfo = function(id,type,reg,cornertype,enrollStatus){
        var postData = {};
        var command = null;
        postData['appOrPCFlag'] = "APP";
        if(type == "news") {
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
                if(type == "news") {
                    infoObj = response.data.news;
                    infoObj.showeye = showeye;
                    infoObj.fromtype= cornertype;
                }
                else if(type == "activity") {
                    infoObj = response.data.activity;
                    infoObj.showeye = showeye;
                    infoObj.reg = reg;
                    infoObj.enrollStatus = enrollStatus?enrollStatus:infoObj.enrollStatus;
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
                videodetail.from("#myComments");
                infoObj.pageId = "myComments";
                videodetail.showDetailWithNew(infoObj);
                var commentAmount = infoObj.commentAmount ?  infoObj.commentAmount : 0;
                videodetail.showCommentsContent(commentAmount);
                initPageLoading("wrapper_comments");
                $.mobile.newChangePage("#video_detailed",{ transition: "slide",reverse: false,changeHash: false});
            }
        },{async:false});
    };
    //点击news、activity
    $('#comments_ul').off('click','.comment_oll').on('click','.comment_oll',function(event){
        window.disableTouch = true;
        var type = $(this).attr("type");
        var id = $(this).attr("id");
        var reg = $(this).attr("reg");
        var cornertype = $(this).attr("cornertype");
        var enrollStatus = $(this).attr("enrollStatus");
        getDetailInfo(id,type,reg,cornertype,enrollStatus);
        event.stopPropagation();
    });
    //点击survey
    $('#comments_ul').off('click','.survey').on('click', '.survey', function(event) {
        window.disableTouch = true;
        var id = $(this).attr("id");
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
                videodetail.from("#myComments");
                surveyInfo.pageId = "myComments";
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
        event.stopPropagation();
    });

    //点击book
    $('#comments_ul').off('click','.book').on('click', '.book', function(event) {
        window.disableTouch = true;
        var id = $(this).attr("id");
        // bookdetail.from("#myComments");
        // bookdetail.showDetailWithNew(id);
        // var commentAmount = infoObj.commentAmount ?  infoObj.commentAmount : 0;
        // bookdetail.showCommentsContent(commentAmount);
        // $.mobile.newChangePage("#book_detail",{ transition: "slide",reverse: false,changeHash: false});
        net.post('bookapp/getDetailInfo', {
            'bookId':id,
            'appOrPCFlag':'APP',
            'userName':q['user'].userName
        }, function(error){
        }, function(response){
            if (response.code != 0) {
                dia.alert('Confirmation', response.msg, ['OK'], function(title) {
                });
            }
            else{
                var infoObj = response.data.book;
                commentscount = infoObj.commentscount;
                isLike = infoObj.like;
                likeAmount = infoObj.likeAmount;
                bookdetail.from("#myComments");
                // infoObj.pageId = "myComments";
                bookdetail.showDetailWithNew(infoObj);
                // var commentAmount = infoObj.commentscount ?  infoObj.commentscount : 0;
                bookdetail.showCommentsContent(infoObj);
                $.mobile.newChangePage("#book_detail",{ transition: "slide",reverse: false,changeHash: false});
            }
        },{async:false});
        event.stopPropagation();
    });




    $("#myComments").on( "pagecreate", function() {
        $( "body > [data-role='panel']" ).panel();
        $( "body > [data-role='panel'] [data-role='listview']" ).listview();
    });
    //changePassword页面 设置内容高度是Header剩下的高度
    $("#myComments").on( "pagebeforeshow", function( event ) {
        $('#news_footer').hide();
        window.shouldPageRefresh.newsroom = true;
        $('#comments_content').css('height', ($(window).height()-44-20));
        $('#comments_content_info').css('min-height', ($(window).height()-44-20));
        $('#coms_wrapper').css('height', ($(window).height()-44-20));
        // window.historyView = [];
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

    $("#myComments").on( "pageshow", function( event ) {
       comPageLoading('coms_wrapper');
       show_comment(true);
    });

    $("#myComments").on( "pagehide", function( event ) {
        $('#pullDown_comments').css("margin-top","0px");
        $('#pullUp_comments').css("margin-top","0px");
        $('#comments_ul').html("");
    });

    function compatibility() {
        /* Logon */
        $('#title_comments').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_comments').css('postion', 'absulute')
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
