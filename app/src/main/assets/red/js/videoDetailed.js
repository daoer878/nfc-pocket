/**
 * Created by steve on 14-9-19.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs','activity_register','questionnaires','survey_questionnaires','survey_confirm'], function($, m, net, dia, activityRegister,questionnaires,surveyQuestionnaires,surveyConfirm) {
    var videoInfo = {};
    var page_from = null;
    var pageId = null;
    var last_time = null;
    var push = false;
    var activityReg = false;
    var surveyReg = false;
    $('#activities_calendar').on('click',function() {
        $.mobile.newChangePage("#activity_calendar_info",{ transition: "slide",reverse: false,changeHash: false});
    });

    $("#video_detailed .comments_desc").on("click",function(){
        if($("#video_detailed .news_commentarea:visible").size() > 0){
            $("#video_detailed .news_commentarea").hide();
            $("#video_detailed .add_comment").hide();
            $(".loadingDiv").removeClass("active addCommentInput");
            $("#video_detailed .buttonShow").show().removeClass("buttonShow");
            $("#commentinfo_video").val("");
            $('.comments_praises .praises_desc').css('border-bottom', '0px solid #ccc');
        }
        else{
            $("#video_detailed .news_commentarea").show();
            $("#video_detailed .add_comment").hide();
            $("#video_detailed .buttonShow").show().removeClass("buttonShow");
            $(".loadingDiv").removeClass("active addCommentInput");
            $("#commentinfo_video").val("");
            $('.comments_praises .praises_desc').css('border-bottom', '1px solid #ccc');
            $("#videoDetail_content_height").scrollTop(parseInt($("#video_comments_area").offset().top+$("#videoDetail_content_height").scrollTop()-45));
        }
    });
    $("#video_detailed .praises_desc").on("tap",function(){
        $(".loadingDiv").addClass("active");
        var ilabel = $(this).find("i");
        var praises_count = $("#video_detailed .detail_praises_count").html();
        if(ilabel.hasClass("praises_icon_no")){
            var postData = {};
            postData['like.contentId'] = videoInfo.infoId;
            postData['type'] = videoInfo.type ? videoInfo.type : videoInfo.types;
            postData['userId'] = q['user'].userId;
            net.post('like/saveLike', postData, function(error){
                    $(".ui-loader").hide();
                    $(".loadingDiv").removeClass("active");
                },
                function(response){
                    if (response.code != 0) {
                        $(".ui-loader").hide();
                        $(".loadingDiv").removeClass("active");
                    }
                    else {
                        ilabel.removeClass("praises_icon_no");
                        if(praises_count != "Like") {
                            $("#video_detailed .detail_praises_count").html(parseInt(praises_count) + 1);
                        }
                        if($("#newsroom li#" + videoInfo.infoId).size() > 0){
                            var priseCount = $("#newsroom li#"+videoInfo.infoId+" .prise_pagetag").html();
                            $("#newsroom li#"+videoInfo.infoId).attr("like","yes");
                            $("#newsroom li#"+videoInfo.infoId+" .prise_pagetag").html(parseInt(priseCount)+1);
                        }
                        $(".ui-loader").hide();
                        $(".loadingDiv").removeClass("active");
                    }
                },{loading:false});
        }
        else{
            var postData = {};
            postData['contentId'] = videoInfo.infoId;
            postData['type'] = videoInfo.type ? videoInfo.type : videoInfo.types;
            postData['userId'] = q['user'].userId;
            net.post('like/cancleLike', postData, function(error){
                $(".ui-loader").hide();
                $(".loadingDiv").removeClass("active");

            },function(response){
                if (response.code != 0) {
                    $(".ui-loader").hide();
                    $(".loadingDiv").removeClass("active");
                }
                else {
                    ilabel.addClass("praises_icon_no");
                    if(praises_count != "Like"){
                        $("#video_detailed .detail_praises_count").html((parseInt(praises_count)-1 == 0) ? "Like" : parseInt(praises_count)-1);
                    }
                    if($("#newsroom li#" + videoInfo.infoId).size() > 0) {
                        var priseCount = $("#newsroom li#" + videoInfo.infoId + " .prise_pagetag").html();
                        $("#newsroom li#" + videoInfo.infoId).attr("like", "no");
                        $("#newsroom li#" + videoInfo.infoId + " .prise_pagetag").html(parseInt(priseCount) - 1);
                    }
                    $(".ui-loader").hide();
                    $(".loadingDiv").removeClass("active");
                }
            });
        }
    });
    // $("#video_detailed .addcomments_state").on("tap",function(){
    //     var add = $(this).hasClass("addcomments_icon");
    //     if(add){
    //         $("#video_detailed .add_comment").show();
    //         if($("#video_detailed .no_comment:visible").size() > 0){
    //             $("#video_detailed .no_comment").hide();
    //             $("#video_detailed .no_comment").addClass("exsit");
    //         }
    //     }
    //     else{
    //         $("#video_detailed .add_comment").hide();
    //         $("textarea").val("");
    //         $("span.video_textlength").html(0);
    //         if($("#video_detailed .no_comment").hasClass("exsit")){
    //             $("#video_detailed .no_comment").show();
    //             $("#video_detailed .no_comment").removeClass("exsit");
    //         }
    //     }
    //     $(this).toggleClass("addcomments_icon");
    //     $(this).toggleClass("canclecomments_icon");
    // });
    $("#video_detailed .addcomments_state").on("click",function(){
        if($("#video_detailed .registerAcbtn:visible").size() > 0){
            $("#video_detailed .registerAcbtn").addClass("buttonShow").hide();
        }
        if($("#video_detailed .registerbtn:visible").size() > 0){
            $("#video_detailed .registerbtn").addClass("buttonShow").hide();
        }
        if($("#video_detailed .activity_details_calendar:visible").size() > 0){
            $("#video_detailed .activity_details_calendar").addClass("buttonShow").hide();
        }
        $("#video_detailed .add_comment").show();
        $(".loadingDiv").addClass("active addCommentInput");
        $("#commentinfo_video").focus();
    });
    $('.loadingDiv').on('tap',function(event){
        $(".survey-detail").removeClass('overFlowY');
        $(".clubActivity-inner").removeClass("overFlowY");
        $('#commentinfo_video').blur();
        $(".commentinfo_video").blur();
        $(".loadingDiv").removeClass("active addCommentInput");
        $("#video_detailed .add_comment, #clubActiveDetails .add_comment, #clubSurveyDetails .add_comment").hide();
        $("#video_detailed .buttonShow").show().removeClass("buttonShow");
    });
    //$('.loadingDiv').off('click').on('click',function(evt){
    //    console.log("666")
    //
    //    //if($(this).hasClass("active") && $(this).hasClass("addCommentInput")){
    //    //    $("#video_detailed .buttonShow").show().removeClass("buttonShow");
    //    //    $(".loadingDiv").removeClass("active addCommentInput");
    //    //}
    //});
    $("#loading_comments").on("tap",function(){
        if($("#loading_comments").hasClass("loading_running")){
            return false;
        }
        getComments();
    });
    $("#refresh_comments").on("tap",function(){
        if($("#refresh_comments").hasClass("refresh_running")){
            return false;
        }
        getComments(true);
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
        var ctime=hours+":"+minutes+" "+dn ;
        return ctime;
    }

    function getCommentHTML(comment,newcreate) {
        var date = new Date((comment.publish_time)*1000);
        var month = getMonthString(date.getMonth());
        var hm = getHm(date.getHours(),date.getMinutes())
        var time = date.getDate() + " " + month + " " + date.getFullYear() + " " + hm ;
        var username = comment.userName;
        var content = comment.comments;
        var delCommentHtml = "";
        var commentId = comment.id;
        if(username == localStorage['username']){
            delCommentHtml ='\<div style="float:right;font-size: 14px;color:#f26647;margin-right:20px;" id='+commentId+'\><span id="'+commentId+'\del">Delete</span></div>';
        }
        var html = '\<li  style="border: 0px;padding: 0px;margin:10px 10px 5px 10px;"  id='+commentId+'\>\
            <div style="background: #f0f0f0; padding:10px; border-radius:10px;">\
                <div style="white-space:normal;font-weight: normal;font-size: 12px;color: #404040; word-break: break-word;margin-bottom:6px;">'+content.replace(/\n/g,'</br>')+'\</div>\
                <span style="font-size: 10px; color: #808080; white-space: normal; text-align: right; width:100%; display: inline-block;">'+time+'\</span>\
            \</div> <i class="comment-btn comment-triangle"></i></div>\
            <div style="margin: -10px 0 0 15px; width: auto; white-space: normal; height: 40px; line-height: 40px; ">\
            <i class="comment_user_icon"></i><span style="font-size: 14px;color:#404040;white-space: normal; margin-left: 10px;">'+username+'\</span>\
            '+delCommentHtml+'\<div style="clear:left; width: 100%;height:10px;"></div>\
        </li>';
        return html;
    }
    function showCommentContent(contentList,refresh){
        var contentHTML = "",
            contentArray = [],
            commentIds =[],
            $comment_listview = $("#video_listview_comments");
        $.each(contentList, function(i, content) {
            if(i == contentList.length-1){
                last_time = content.publish_time;
            }
            if(refresh){
                contentArray.push(getCommentHTML(content));
                commentIds.push(content.id);
            }
            else{
                if($("li#"+content.id).size() == 0){
                    contentArray.push(getCommentHTML(content));
                    commentIds.push(content.id);
                }
            }
        });
        contentHTML = contentArray.join("");
        if (refresh) {
            $comment_listview.html(contentHTML);
        } else {
            $comment_listview.append(contentHTML);
        }
        $.each(commentIds, function(i, commentId) {
            $("#video_detailed span#"+commentId+"del").on("tap",function(){
                dia.alert('Confirmation', 'Are you sure you want to delete this comment?', ['Cancel','Delete'],function(title) {
                    if(title == 'Delete') {
                        $(".loadingDiv").addClass("active");
                        var postData = {};
                        postData['commentId'] = commentId;
                        postData['flag'] = 'app';
                        net.post('comment/deleteComments', postData, function(error){
                            $(".ui-loader").hide();
                            $(".loadingDiv").removeClass("active");

                        },function(response){
                            var fail = function(){
                                $(".ui-loader").hide();
                                $(".loadingDiv").removeClass("active");
                                dia.alert('Confirmation', "Fail to delete comment!", ['OK'], function(title) {
                                });
                            };
                            if (response.code != 0) {
                                fail();
                            }
                            else {
                                var result = response.data.result;
                                if(result == true){
                                    $("li#"+commentId).remove();
                                    var comment_Count = $("#video_detailed .detail_comments_count").html();
                                    $("#video_detailed .detail_comments_count").html(((parseInt(comment_Count)-1)==0) ? "Comment" :  parseInt(comment_Count)-1 );
                                    if($("#video_listview_comments").html() == "" && comment_Count <= 1){
                                        $("#video_detailed .no_comment").show();
                                        $("#wrapper_comments").hide();
                                        $("#refresh_comments").hide();
                                        $("#video_detailed .backtop").hide();
                                    }
                                    setTimeout(function() {
                                        $(".ui-loader").hide();
                                        $(".loadingDiv").removeClass("active");
                                        disableClickEvent(false);
                                    }, 1500);
                                }else{
                                    fail();
                                }
                            }
                        },{loading:false});
                    }
                });
            });
        });
        $comment_listview.listview("refresh");
    }

    $('#commentinfo_video').off('keyup')
        .on('keyup', function(evt) {
            if (evt.keyCode == 13) {
                 commitComent_video();
            }
     });
    $("#video_detailed .commit_comments").on("tap",function(){
         commitComent_video();
    });
    function commitComent_video(){
        $("#commentinfo_video").blur();
        $(".loadingDiv").addClass("active");
        var content = $("#commentinfo_video").val().trim();
        if(content == ""){
            $(".ui-loader").hide();
            $(".loadingDiv").removeClass("active");
            dia.alert('Confirmation', "Please input your comment.", ['OK'], function(title) {
                  $("#video_detailed .add_comment").hide();
            });
            return false;
        }
        var postData = {};
        postData['comment.contentId'] = videoInfo.infoId;
        postData['comment.comments'] = content;
        postData['type'] = videoInfo.type ? videoInfo.type : videoInfo.types;
        postData['userId'] = q['user'].userId;
        net.post('comment/saveComment', postData, function(error){
                $(".ui-loader").hide();
                $(".loadingDiv").removeClass("active");
            },
            function(response){

                var fail = function(){
                    $(".ui-loader").hide();
                    $(".loadingDiv").removeClass("active");
                    dia.alert('Confirmation', "Fail to save comment", ['OK'], function(title) {
                    });
                };
                if (response.code != 0) {
                    fail();
                } else {
                    var commentInfo = response.data.commentObj;
                    var commentCount = $("#video_detailed .detail_comments_count").html();
                    $("#video_detailed .detail_comments_count").html((commentCount == "Comment") ? 1 :parseInt(commentCount)+1);
                    $("#commentinfo_video").val("");
                    $("span.video_textlength").html(0);
                    $("#video_detailed .addcomments_state").addClass("addcomments_icon");
                    $("#video_detailed .addcomments_state").removeClass("canclecomments_icon");
                    var $comment = getCommentHTML(commentInfo,true);
                    $("#video_listview_comments").prepend($comment);
                    var commentId = commentInfo.id;
                    $("#video_detailed span#"+commentId+"del").on("tap",function(){
                        dia.alert('Confirmation', 'Are you sure you want to delete this comment?', ['Cancel','Delete'], function(title) {
                            if(title == 'Delete') {
                                $(".loadingDiv").addClass("active");
                                var postData = {};
                                postData['commentId'] = commentId;
                                postData['flag'] = 'app';
                                net.post('comment/deleteComments', postData, function(error){
                                },function(response){
                                    var fail = function(){
                                        $(".ui-loader").hide();
                                        $(".loadingDiv").removeClass("active");
                                        dia.alert('Confirmation', "Fail to delete comment!", ['OK'], function(title) {
                                        });
                                    };
                                    if (response.code != 0) {
                                        fail();
                                    }
                                    else {
                                        var result = response.data.result;
                                        if(result == true){
                                            $("li#"+commentId).remove();
                                            var comment_Count = $("#video_detailed .detail_comments_count").html();
                                            $("#video_detailed .detail_comments_count").html((parseInt(comment_Count)-1 == 0) ? "Comment" :parseInt(comment_Count)-1 );
                                            if($("#video_listview_comments").html() == "" && comment_Count <= 1){
                                                $("#video_detailed .no_comment").show();
                                                $("#wrapper_comments").hide();
                                                $("#refresh_comments").hide();
                                                $("#video_detailed .backtop").hide();
                                            }
                                            setTimeout(function() {
                                                $(".ui-loader").hide();
                                                $(".loadingDiv").removeClass("active");
                                                disableClickEvent(false);
                                            },1500);
                                        }else{
                                            fail();
                                        }
                                    }
                                },{loading:false});
                            }
                        });
                    });
                    $("#wrapper_comments").show();
                    $("#refresh_comments").show();
                    $("#video_detailed .no_comment").hide();
                    var  $commentlistview = $("#video_listview_comments");
                    $commentlistview.listview("refresh");
                    $("#commentinfo_video").blur();
                    $("#video_detailed .add_comment").hide();
                    $("#video_detailed .buttonShow").show().removeClass("buttonShow");
                    $(".loadingDiv").removeClass("addCommentInput");
                    setTimeout(function(){
                        disableClickEvent(false);
                        $(".ui-loader").hide();
                        $(".loadingDiv").removeClass("active");
                    },1500);
                }
            },{loading:false});
    }
    // 当前页数
    var currentPageNumer = 1;

    // 控制底部事件激发开关 0表示开 非0表示关闭时间
    var scrollButtomOn = 0;

    // 上一次滚动的位置
    var scrollTopBefore = 0;

    function getComments(refresh) {
        var postData = {};
        if (refresh) {
            var $refreshEl = $("#refresh_comments");
            $refreshEl.addClass("loading");
            currentPageNumer = 1;
        }
        else{
            var $wrapper = $("#wrapper_comments"),
                $loadingEl = $wrapper.find("#loading_comments"),
                $loadingLabel = $loadingEl.find(".loadingLabel");
            $loadingEl.addClass("loading");
            $loadingLabel.text("Loading...");
            postData['lastTime'] = last_time;
        }
        postData['pager.pageNo'] = currentPageNumer;
        postData['pager.pageSize'] = 5;
        postData['userId'] = q['user'].userId;
        postData['contentId'] = videoInfo.infoId;
        postData['type'] = videoInfo.type ? videoInfo.type : videoInfo.types ;
        // 获取视频
        net.post('comment/getCommentsList', postData, function(error){
                if (refresh) {
                    $refreshEl = $("#refresh_comments");
                    $refreshEl.removeClass("loading");
                    $("#refresh_comments").removeClass("refresh_running");
                }
                else{
                    var $wrapper = $("#wrapper_comments"),
                        $loadingEl = $wrapper.find("#loading_comments"),
                        $loadingLabel = $loadingEl.find(".loadingLabel");
                    $loadingEl.removeClass("loading");
                    $loadingLabel.text("Load more comments");
                    $("#loading_comments").removeClass("loading_running");
                }
            },
            function(response){
                if (response.code != 0) {
                    if (refresh) {
                        var $refreshEl = $("#refresh_comments");
                        $refreshEl.removeClass("loading");
                        $("#refresh_comments").removeClass("refresh_running");
                    }
                    else{
                        var $wrapper = $("#wrapper_comments"),
                            $loadingEl = $wrapper.find("#loading_comments"),
                            $loadingLabel = $loadingEl.find(".loadingLabel");
                        $loadingEl.removeClass("loading");
                        $loadingLabel.text("Load more comments");
                        $("#loading_comments").removeClass("loading_running");
                    }
                }
                else {

                    var commentsList = response.data.CommentList;
                    var commentsListLength = commentsList.length;
                    if (commentsListLength > 0) {
                        showCommentContent(commentsList, refresh);
                        currentPageNumer++;
                    }
                    else{
                        if(refresh){
                            $("#video_listview_comments").html("");
                        }else{
                            $("#video_listview_comments").append("");
                        }
                    }
                    var commentsSize = response.data.CommentAmount;
                    $("#video_detailed .detail_comments_count").html((commentsSize == 0) ? "Comment" : commentsSize);
                    setTimeout(function() {
                        var $refreshEl = $("#refresh_comments"),
                            $refreshIcon = $refreshEl.find(".refreshIcon"),
                            $loadingEl = $("#wrapper_comments").find("#loading_comments"),
                            $loadingLabel = $loadingEl.find(".loadingLabel"),
                            $loadingIcon = $loadingEl.find(".loadingIcon");
                        if(refresh){
                            $refreshEl.removeClass("loading");
                            $("#refresh_comments").removeClass("refresh_running");

                            if(commentsListLength < 5){
                                $("#nomore_comments").hide();
                                $loadingEl.hide();
                                $("#video_detailed .backtop").hide();
                            }else{
                                $("#nomore_comments").hide();
                                $loadingEl.show();
                                $("#video_detailed .backtop").show();
                            }
                        }
                        else{
                            $loadingEl.removeClass("loading");
                            $loadingLabel.text("Load more comments");
                            $("#loading_comments").removeClass("loading_running");
                            if(commentsListLength < 5){
                                $("#nomore_comments").show();
                                $("#nomore_comments .noLabel").text("No more comments");
                                $loadingEl.hide();
                                $("#video_detailed .backtop").show();
                            }else{
                                $("#nomore_comments").hide();
                                $loadingEl.show();
                                $("#video_detailed .backtop").show();
                            }
                        }
                        disableClickEvent(false);
                    }, 800);
                }
            });
    }

    function getTags(tags){
        var html_tags = "";
        $.each(tags, function(index, val) {
            if (val.name == 'Communications')
                html_tags += '\<span class="spanTag" style="background-color: rgb(77, 134, 176);">COMMS</span>  ';
            if (val.name == 'Corporate Sustainability')
                html_tags += '\<span class="spanTag" style="background-color: rgb(137, 217, 78);">CS</span>  ';
            if (val.name == 'Finance')
                html_tags += '\<span class="spanTag" style="background-color: rgb(219, 218, 0);">FIN</span>  ';
            if (val.name == 'Trade Union')
                html_tags += '\<span class="spanTag" style="background-color: rgb(147, 182, 164);">GTU</span>  ';
            if (val.name == 'Human Resources')
                html_tags += '\<span class="spanTag" style="background-color: rgb(230, 170, 0);">HR</span>  ';
            if (val.name == 'Q&P')
                html_tags += '\<span class="spanTag" style="background-color: rgb(76, 176, 170);">Q&P</span>  ';
            if (val.name == 'Center Operations')
                html_tags += '\<span class="spanTag" style="background-color: rgb(138, 116, 122);">OPS</span>  ';
            if (val.name == 'Technical Development')
                html_tags += '\<span class="spanTag" style="background-color: rgb(121, 110, 172);">TD</span>  ';
            if (val.name == 'NOW')
                html_tags += '\<span class="spanTag" style="background-color: #db0011;">NOW</span>  ';
            if (val.name == 'Talent Show')
                html_tags += '\<span class="spanTag" style="background-color: #a3bdad;">TALENT SHOW</span>  ';
            if (val.name == '#red')
                html_tags += '\<span class="spanTag" style="background-color: #f26647;">#red</span>  ';
            if (val.name == 'GSC')
                html_tags += '\<span class="spanTag" style="background-color: #e6b012;">GSC</span>  ';
        });
        return html_tags;
    }
    function filterTag(tags,tag){
        var tagArr = [];
        $.each(tags, function(index, val) {
            tagArr.push(val.name);
        });
        return tagArr.indexOf(tag);
    }
    // 获得新闻
    function getVideos(value) {
        if($('#video_detailed_listview li').length > 1){
            return;
        }
        // 获取新闻
        var date = new Date(value.addTime * 1000);
        var month = getMonthString(date.getMonth());
        var time = 'Posted on ' + date.getDate() + " " + month + " " + date.getFullYear();

        var eye = value.allBrowseTimes;
        if(value.showeye == "false"){
            eye = "no";
        }
        value.addDate = time;
        value.eye = eye;
        var li = createVideos(value);
        $('#video_detailed_listview').empty();
        $('#video_detailed_listview').append(li);
    }

    // 创建新闻
    function createVideos(value) {
        var img = value.pic ,
            title = value.title,
            content = value.content,
            timestamp = value.addDate,
            tags = value.TTagses,
            eye = value.eye,
            currentId = value.newsId,
            currentType = value.types,
            like = value.like;
        var html_tags = '';

        if (tags != null) {
            html_tags = getTags(tags);
        }

        if (html_tags.length == 0) {
            html_tags = '\<span style="height: 35px;"> &nbsp; </span>';
        }
        var imgHeight ='';
        var videoFlag = value.videoFlag;
        if(videoFlag == "video"){
            imgHeight = "min-height:120px;"
        }
        var html_image ='\<div style="width: 100%;"> <img src="'+img+'"\ style="width: 100%;'+imgHeight+'" alt=""/></div>';

        var eyehtml = "";
        if(eye != "no"){
            eyehtml = '\<div style="float:right;font-size: 10px;color: #808080;"><span style="margin-left:10px "><i class="eyeicon"></i><span class="eyeCount">'+eye+'\</span></span></div>';
        }
        var html = '\<li style="border: 0px;padding: 0px;background-color:white;">\
			'+html_image+'\<label style="margin:30px 10px 15px 10px; font-size: 18px; white-space:normal;color: #404040;word-break: break-word;">'+title+'\</label>\
            <div style="margin: 0px 10px; height: 16px; line-height: 16px;">\
                <span style="font-size: 10px;color: #808080;white-space: normal;">'+timestamp+'\</span>'+eyehtml+'\</div><div style="margin:20px 10px 25px 10px">\
                <div class="content_href" like="'+like+'" eyecount="'+eye+'" id="'+currentId+'" type="'+currentType+'" beforepage="'+page_from+'" style="white-space:normal;font-weight: normal;font-size: 12px;color: #404040;overflow:auto; word-break: break-word;">'+content.replace(/\n/g,'</br>')+'\</div>\
            </div> <div style="margin-left: 10px;width: auto;white-space: normal;">\
                '+html_tags+'\
            \</div>\
            <div style="clear:left; width: 100%;height:10px;"></div>\
        </li>';
        return html;
    }

    //获取活动
    function getAcvtivities(value) {
        if($('#video_detailed_listview li').length > 1){
            return;
        }
        //获取活动
        var startDate = new Date(value.startTime * 1000);
        var endDate = new Date(value.endTime * 1000);
        var deadline = new Date(value.deadline * 1000);
        var startTime = 'Start: ' + pad(startDate.getHours(), 2) + ':' + pad(startDate.getMinutes(),2) + ', ' + startDate.getDate() + " " + getMonthString(startDate.getMonth()) + " " + startDate.getFullYear();
        var endTime = 'End: ' + pad(endDate.getHours(),2) + ':' + pad(endDate.getMinutes(),2) + ', ' + endDate.getDate() + " " + getMonthString(endDate.getMonth()) + " " + endDate.getFullYear();
        var venue = 'Venue: ' + value.venue;
        var deadlineTime = 'Deadline: ' + pad(deadline.getHours(),2) + ':' + pad(deadline.getMinutes(),2) + ', ' + deadline.getDate() + " " + getMonthString(deadline.getMonth()) + " " + deadline.getFullYear();

        var eye = value.allBrowseTimes;
        if(value.showeye == "false"){
            eye = "no";
        }
        var reviewTime = new Date(value.reviewTime * 1000);
        var month = getMonthString(reviewTime.getMonth());
        var time = 'Posted on ' + reviewTime.getDate() + " " + month + " " + reviewTime.getFullYear();
        value.startDate = startTime;
        value.endDate = endTime;
        value.venuedate = venue;
        value.deadlineDate = deadlineTime;
        value.eye = eye;
        value.reviewDate = time;
        var li = creatActivity(value);
        $('#video_detailed_listview').empty();
        $('#video_detailed_listview').append(li);
    }

    //创建活动
    function creatActivity(value) {
        var img = value.banner,
            subject = value.subject,
            brifContent = value.description,
            time = value.startDate,
            day = value.endDate,
            venue = value.venuedate,
            deadline = value.deadlineDate,
            tags = value.tags,
            eye = value.eye,
            reviewDate = value.reviewDate,
            like = value.like,
            currentId = value.id,
            currentType = value.types;
        var html_tags = '';
        if (tags != null) {
            html_tags = getTags(tags);
        }
        var eyehtml = "";
        if(eye != "no"){
            eyehtml = '\<div style="text-align: right; margin: 10px;font-size: 10px;color: #808080;"><span style="margin-left:10px "><i class="eyeicon"></i><span class="eyeCount">'+eye+'\</span></span></div>';
        }
        var imgHeight ='';
        var videoFlag = value.videoFlag;
        if(videoFlag == "video"){
            imgHeight = "min-height:120px;"
        }
       var html = '\<li style="border: 0px;padding: 0px;background-color: white;">\
            <div id="detail_sele" style="overflow: auto;">\
            <div style="width: 100%" >\
                <img src="'+img+'" style="width: 100%;'+imgHeight+'" alt=""/>\
            </div>\
                <label style="margin:30px 10px 15px 10px; font-size: 18px; white-space:normal;color: #404040;word-break:break-word;">'+ subject +'\</label>\
            <div style="margin: 0px 10px; height: 16px; line-height: 16px;">\
                <span style="font-size: 10px;color: #808080;white-space: normal;float: left;">'+reviewDate+'\</span>'+eyehtml+'\</div>\
            <div style="margin: 20px 10px 25px 10px;">\
                    <div class="content_href" like="'+like+'" eyecount="'+eye+'" id="'+currentId+'" type="'+currentType+'"  beforepage="'+page_from+'" style="white-space:normal;font-weight: normal;font-size: 12px;color: #404040;word-break: break-word;">'+ brifContent.replace(/\n/g,'</br>') +'\</div>\
            </div>\
                <div style="margin: 0 10px 10px 10px;font-size: 11px;color: #404040;">\
                    <span style="display: block;white-space:normal;">'+ time +'\</span>\
                    <span style="display: block;white-space:normal;">'+ day +'\</span>\
                    <span style="display: block;white-space:normal;">'+ venue +'\</span>\
                    <span style="display: block;white-space:normal;">'+ deadline +'\</span>\
                </div><div style="margin-left: 10px;width: auto;white-space: normal;">\
                    '+ html_tags +'\ </div>\
                <div style="clear:left; width: 100%;height:10px;"></div>\
            </div>\
        </li>';
        return html;
    }

    //跳转到注册页面
    $('#btn_details_registerNow').off('click')
        .on('click', function() {
            activityReg = true;
            var _activityFlag = videoInfo['flag'];
            if(!_activityFlag){
                if(page_from === "#mycorner" || page_from == "#mycornerallarticle"){
                    videoInfo.frompage = page_from;
                }
                var questioniInfos = null;
                net.post('questionnaire/searchQuestionList', {
                    'questionnaire_id': videoInfo.id
                }, function(error){
                }, function(response){
                    if (response.code != 0) {
                        dia.alert('Confirmation', response.msg, ['OK'], function(title) {
                        });
                    }
                    else{
                        questioniInfos = response.data.questions;
                    }
                },{async:false});
                if(questioniInfos && questioniInfos.length > 0){
                    questionnaires.from('#video_detailed');
                    var info ={'acvtivitie':videoInfo,'question_infos':questioniInfos};
                    questionnaires.setAcvtivities(info);
                    $.mobile.newChangePage('#questionnaires_activity',{ transition: "slide",reverse: false, changeHash:false});
                }
                else{
                    activityRegister.setAcvtivities(videoInfo);
                    activityRegister.from('#video_detailed');
                    $.mobile.newChangePage('#activityRegister', { transition: "slide", reverse: false, changeHash:false});
                }
            }
            else{
                if(_activityFlag=='activity.deadTime'){
                    dia.alert("Oops","You are too late! The registration of the activity is already closed.", ['OK'], function () {
                        return false;
                    });
                }else if(_activityFlag=='activity.limitNum'){
                    dia.alert("Oops","Sorry but your registration cannot be processed now as the activity has reached its maximum capacity.", ['OK'], function () {
                        return false;
                    });
                }else if(_activityFlag=='activity.appIsTwo'){
                    dia.alert("Oops","Looks like you have already registered this activity!", ['OK'], function () {
                        return false;
                    });
                }else{
                    dia.alert("Oops","Looks like have other issues. please contact #red help center!", ['OK'], function () {
                        return false;
                    });
                }
            }
        });


    $('#video_detailed #btn_activity_details_calendar').off('click')
        .on('click', function() {
        if(!$(this).hasClass("btn_activity_details_calendar")){
            return false;
        }
        var remind_activity_time = videoInfo.startTime;
        var remindActivityTime = new Date(remind_activity_time * 1000);
        remindActivityTime.setDate(remindActivityTime.getDate()-1);
        remindActivityTime.setHours(20);
        remindActivityTime.setMinutes(0);
        alarmClock.addAlarmClock([(Math.round(remindActivityTime.getTime()/1000)).toString(),videoInfo.subject,videoInfo.briefContent,"100",videoInfo.startTime.toString(),
                videoInfo.endTime.toString(),null,null,null,videoInfo.id+q['user'].userId],
        function(success){
            var postData = {};
            postData['contentId'] = videoInfo.id;
            postData['type'] = "activity";
            postData['userId'] = q['user'].userId;
            net.post("activity/saveCalendarReminder", postData,
                function (error) {
                    alarmClock.deleteManyAlarmClock([videoInfo.id+q['user'].userId],
                        function(success){
                            console.log(success);
                        },
                        function(error){
                            console.log(error);

                        });
                },
                function(response){
                    if (response.code != 0) {
                        alarmClock.deleteManyAlarmClock([videoInfo.id+q['user'].userId],
                            function(success){
                                console.log(success);
                            },
                            function(error){
                                console.log(error);
                            }
                        );
                        dia.alert('Oops',"Fail to connect system calendar. Please restart and try again.",['OK'],function(title) {
                        });
                    }
                    else{
                        $("li#"+videoInfo.id+" .li_nowRegister").addClass("calendarAdded");
                        $("#video_detailed #btn_activity_details_calendar").removeClass("btn_activity_details_calendar").html("Added");
                    }
                },
                {loading:false}
            );
        },
        function(error){
            dia.alert('Confirmation', "Fail to connect system calendar. Please restart and try again.", ['OK'], function(title) {
            });
        });
    });



    //获取活动
    function getSurvies(surveyinfo) {
        if($('#video_detailed_listview li').length > 1){
            return;
        }
        var value = surveyinfo;
        //获取活动
        var startDate = new Date(value.startTime * 1000);
        var endDate = new Date(value.endTime * 1000);
        var eye = value.allBrowseTimes;
        if(value.showeye == "false"){
            eye = "no";
        }
        var reviewTime = new Date(value.reviewTime * 1000);
        var month = getMonthString(reviewTime.getMonth());
        var time = 'Posted on ' + reviewTime.getDate() + " " + month + " " + reviewTime.getFullYear();
        value.eye = eye;
        value.reviewDate = time;
        var li = creatSurveyDetail(value);
        $('#video_detailed_listview').empty();
        $('#video_detailed_listview').append(li);
    }

    //创建活动
    function creatSurveyDetail(value) {
        var img = value.banner,
            subject = value.subject,
            brifContent = value.description,
            tags = value.tags,
            eye = value.eye,
            reviewTime = value.reviewDate,
            isshow = value.is_show,
            regflag = value.regFlag,
            frompage = value.frompage,
            flag = value.flag,
            currentId = value.survey_id,
            currentType = value.types,
            like = value.like;
        var html_tags = '';
        if (tags != null) {
            html_tags = getTags(tags);
        }
        var eyehtml = "";
        if(eye != "no"){
            eyehtml = '\<div style="text-align: right; margin: 10px;font-size: 10px;color: #808080;"><span style="margin-left:10px "><i class="eyeicon"></i><span class="eyeCount">'+eye+'\</span></span></div>';
        }
        var imgHeight ='';
        var videoFlag = value.videoFlag;
        if(videoFlag == "video"){
            imgHeight = "min-height:120px;"
        }
        var html = '\<li id="surveydetail_li" surveyid="'+currentId+'" isshow="'+isshow+'" flag="'+flag+'" regflag="'+regflag+'"\
            frompage="'+frompage+'"\style="border: 0px;padding: 0px;background-color: white;">\
            <div id="detail_sele" style="overflow: auto;">\
            <div style="width: 100%" >\
                <img src="'+img+'"\ style="width: 100%;'+imgHeight+'" alt=""/></div>\
                <label style="margin:30px 10px 15px 10px; font-size: 18px; white-space:normal;color: #404040;word-break:break-word;">'+ subject +'\</label>\
            <div style="margin: 0px 10px; height:16px; line-height:16px;">\
                <span style="font-size: 10px;color: #808080;white-space: normal;float: left;">'+reviewTime+'\</span>'+eyehtml+'\</div>\
            <div style="margin:20px 10px 25px 10px">\
                    <div class="content_href"  like="'+like+'" eyecount="'+eye+'"  id="'+currentId+'" type="'+currentType+'"   beforepage="'+frompage+'" style="white-space:normal;font-weight: normal;font-size: 12px;color: #404040;word-break: break-word;">'+ brifContent.replace(/\n/g,'</br>') +'\</div>\
            </div>\
                <div style="margin-left: 10px;width: auto;white-space: normal;">\
                    '+ html_tags +'\ </div>\
                <div style="clear:left; width: 100%;height:10px;"></div>\
            </div>\
        </li>';
        return html;
    }

    $('#btn_details_submitNow').off('touchend').on('touchend', function(event) {
            event.preventDefault();
            surveyReg = true;
            if(videoInfo == null){
                videoInfo = {};
            }
            if(page_from === "#mycorner" || page_from == "#mycornerallarticle"){
                videoInfo.frompage = page_from;
            }
            else{
                videoInfo.frompage = "#newsroom";
            }
            var _delineFlag = $("li#surveydetail_li").attr("flag");
            var _surveyFlag = $("li#surveydetail_li").attr("regflag");
            if(_surveyFlag == "false"){
                if(_delineFlag=='survey.deadTime'){
                    dia.alert("Oops","You are a bit late! The survey is already closed.", ['OK'], function () {
                    });
                    return false;
                }
                var questioniInfos = null;
                var surveyInfo = null;
                net.post('survey/getSurveyDetial', {
                    'survey_id':  $("li#surveydetail_li").attr("surveyid") ,
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
                        surveyInfo.frompage = videoInfo.frompage;
                        questioniInfos = response.data.survey.questions;
                    }
                },{async:false});
                if(questioniInfos && questioniInfos.length > 0){
                    surveyQuestionnaires.from('#video_detailed');
                    surveyInfo.backpage = "#video_detailed";
                    var info ={'survey':surveyInfo,'question_infos':questioniInfos};
                    surveyQuestionnaires.setAcvtivities(info);
                    $.mobile.newChangePage('#questionnaires_survey',{ transition: "slide",reverse: false, changeHash:false});
                }
            }
            else{

                videoInfo.currentStatus = "complete";
                videoInfo.survey_id = $("li#surveydetail_li").attr("surveyid");
                videoInfo.is_show = $("li#surveydetail_li").attr("isshow");
                surveyConfirm.showConfirmSurvey(videoInfo);
                surveyConfirm.backPage("#video_detailed");
                $.mobile.newChangePage('#surveyConfirm', { transition: "slide", reverse: false, changeHash:false});
            }
        });


    $(document).ready(function() {
        $('#video_detailed_btn_menu').on('click',function(){
            $("#activity_community_hasnot").hide();
            $("#activity_community_check").hide();
            if(page_from == "#QrcodeScan"){
                var menuId = videoInfo.menuId;
                if(!menuId){
                    menuId = $('.ui-page-active').attr('id');
                }
                cordoveScan(menuId);
            }
            else{
                if(linkdetailList.length > 5){
                    var removeCount = linkdetailList.length-5 ;
                    linkdetailList.splice(1,removeCount);
                }
                if(linkdetailList.length > 1){
                    var linkInfo = linkdetailList[linkdetailList.length-1];
                    var type = linkInfo.type;
                    page = "#video_detailed";
                    var  menuId = $('.ui-page-active').attr('id');
                    if("#"+menuId  == page){
                        reViewPage();
                        showHrefBack();
                    }
                    else {
                        $(page).addClass("hrefback");
                        $.mobile.backChangePage(page, { transition: "slide", reverse: true, changeHash: false});
                    }
                }
                else if(linkdetailList.length == 1) {
                    var link = linkdetailList.pop();
                    $.mobile.backChangePage(link ,{ transition: "slide",reverse: true,changeHash: false});
                }
                else{
                    setTimeout(function(){
                        $.mobile.backChangePage(page_from ,{ transition: "slide",reverse: true,changeHash: false});
                    },300);
                }
            }
        });
        $('#videoDetail_content').on('swiperight',function() {
            if(page_from == "#QrcodeScan"){
                var menuId = videoInfo.menuId;
                if(!menuId){
                    menuId = $('.ui-page-active').attr('id');
                }
                cordoveScan(menuId);
            }
            else{
                if(linkdetailList.length > 5){
                    var removeCount = linkdetailList.length-5 ;
                    linkdetailList.splice(1,removeCount);
                }
                if(linkdetailList.length > 1){
                    var linkInfo = linkdetailList[linkdetailList.length-1];
                    var type = linkInfo.type;
                    var page = page_from;
                    if(type == "new"){
                        page = "#video_detailed";
                    }
                    else if(type == "survey"){
                        page = "#video_detailed";
                    }
                    else if(type == "activity"){
                        page = "#video_detailed";
                    }
                    $(page).addClass("hrefback");
                    $.mobile.backChangePage(page ,{ transition: "slide",reverse: true,changeHash: false});
                }
                else{
                    $.mobile.backChangePage(page_from ,{ transition: "slide",reverse: true,changeHash: false});
                }
            }
        });

    });

    $("#video_detailed").on( "pagebeforeshow", function( event ) {
        $("#video_detailed .add_comment").hide();
        $(".loadingDiv").removeClass("active addCommentInput");
        $("#video_detailed .buttonShow").removeClass("buttonShow");
        if($('#video_detailed').hasClass("hrefback")){
            $('#video_detailed').removeClass("hrefback");
            showHrefBack();
        }
    });

    //设置内容高度是Header剩下的高度
    $("#video_detailed").on( "pageshow", function( event ) {
        $(this).find("#videoDetail_content_height").scrollTop(0);
        $(".loadingDiv").removeClass("qrcodepage");
        console.error("#video_detailed");
        var height = $(window).height() > $(window).width() ? $(window).height() :$(window).width();
        if($("#video_detailed_listview").hasClass("push")){
            push = true;
            $("#video_detailed_listview").removeClass("push");
        }
        $("#videoDetail_content").show();
        disableClickEvent(true);
        // window.historyView = [];
        $(document.body).css('overflow-y','hidden');

        if($('.activity_details_calendar').is(':hidden') && $('.registerAcbtn').is(':hidden') && $('.registerbtn').is(':hidden')){
            $('#videoDetail_content').css('height',($(window).height()-44-20));
            //$('#videoDetail_content_height').css('height',($(window).height()-44-20-10-10));
        }

		// #red in commentarea click display none  start
        $("#video_detailed_listview li").on("click",function(){
            if($(".news_commentarea").is(":visible")){
                $(".news_commentarea").css("display","none");
            }
       });
        // #red in commentarea click display none  end


    });

   function cordoveScan(menuId){
        cordova.exec(function(){cordova.logger.debug("success");}, function(){cordova.logger.debug("error");}, "ShowVideoPlaybackView", "showVideoPlaybackView", []);
        cordova.exec(function(content){
            var menuId_c = videoInfo.menuId;
            if(!menuId_c){
                menuId_c = $('.ui-page-active').attr('id');
            }
            net.post('activity/getActivity', {
                'content': content,
                userId:q['user'].userId
            }, function(error){
                // $(".loadingDiv").addClass("dismiss").removeClass("qrcodepage");
                $(".loadingDiv").removeClass("qrcodepage");
                dia.alert('Oops', response.msg, ['OK'], function(title) {
                    return cordoveScan(menuId_c);
                });
            }, function(response){
                if (response.code != 0) {
                    // $(".loadingDiv").addClass("dismiss").removeClass("qrcodepage");
                    $(".loadingDiv").removeClass("qrcodepage");
                    dia.alert('Oops', response.msg, ['OK'], function(title) {
                        return cordoveScan(menuId_c);
                    });
                }
                else{
                    $(".ui-loader").hide();
                    $(".loadingDiv").removeClass("active");
                    $('#video_detailed_listview').empty();
                    $('#video_listview_comments').empty();
                    page_from = '#QrcodeScan';
                    var activity = response.data.activity;
                    activity.menuId = menuId;
                    showDetailWithNew(activity);
                    showCommentsContent();
                    $.mobile.newChangePage("#video_detailed",{ transition: "none",reverse: false,changeHash: false});
                }
            },{async:false});
        }, function(){
            // $(".loadingDiv").addClass("dismiss").removeClass("qrcodepage");
            $(".loadingDiv").removeClass("qrcodepage");
        }, "ShowVideoPlaybackView", "showVideoPlaybackViewAndReceiveScan", []);
        $.mobile.backChangePage("#"+videoInfo.menuId ,{ transition: "none",reverse: true,changeHash: false});
        $( "#panel_menu_extend").show();
        $( "#panel_menu_extend" ).panel( "open" );
        $( "#panel_menu_extend" ).removeClass();
        $(".loadingDiv").addClass("qrcodepage");
    }
    function videoSaveLog(){
        var postSaveLogData = {};
        postSaveLogData['log.contentId'] = videoInfo.infoId;
        postSaveLogData['type'] =  videoInfo.type ? videoInfo.type :videoInfo.types;
        postSaveLogData['log.module'] = "newsroom";
        if(pageId == "video"){
            postSaveLogData['log.module'] = "HSBC NOW";
        }
        else if (pageId === "newsroom") {
            postSaveLogData['log.module'] = "newsroom";
        }
        else if (pageId === "activities") {
            postSaveLogData['log.module'] = "Activity";
        }
        else if (pageId === "talentShow") {
            postSaveLogData['log.module'] = "Talent Show";
        }
        else if (pageId === "mycorner") {
            postSaveLogData['log.module'] = "Mycorner";
        }
        else if (pageId === "myComments") {
            postSaveLogData['log.module'] = "myComments";
        }
        else if(pageId == "mycornerallarticle"){
            postSaveLogData['log.module'] = "MycornerAllArticle";
        }
        net.post('log/saveLog', postSaveLogData, function(error){
        }, function(response){
            if (response.code != 0) {

            }
            else {
            }
        });
    }
    function showHrefBack(){
        var linkInfo = linkdetailList.pop();
        var id = linkInfo.id;
        var type = linkInfo.type;
        var postData = {};
        postData['appOrPCFlag'] = "APP";
        postData['userId'] = q['user'].userId;
        var command = 'news/getDetialInfo';
        if(type == "new"){
            postData['newsId'] = id;
            command = 'news/getDetialInfo';
        }
        else if(type == "survey"){
            postData['survey_id'] = id;
            command = 'survey/getSurveyDetial';
        }
        else if(type == "activity"){
            postData['activityId'] = id;
            command = 'activity/getDetialInfo';
        }
        net.post(command, postData, function (error) {
        }, function (response) {
            if (response.code != 0) {
            }
            else {
                var news = response.data.news;
                if(type == "new"){
                    news = response.data.news;
                }
                else if(type == "survey"){
                    news = response.data.survey;
                }
                else if(type == "activity"){
                    news = response.data.activity;
                }
                showDetailWithNew(news);
                showCommentsContent();
            }
        }, {async: false});
    }
    function reViewPage(){
        if(surveyReg == true){
            surveyReg = false;
            return false;
        }
         if(activityReg == true){
            activityReg = false;
            return false;
        }
        $("#video_detailed .praises_desc i").removeClass("praises_icon_no");
        $("#video_detailed .add_comment").hide();
        $(".loadingDiv").removeClass("active addCommentInput");
        $("#video_detailed .registerbtn").hide();
        $("#video_detailed .registerAcbtn").hide();
        $("#video_detailed .activity_details_calendar").hide();
        $("#video_detailed .buttonShow").removeClass("buttonShow");
        $("#video_detailed .news_commentarea").hide();
        $('.comments_praises .praises_desc').css('border-bottom', '0px solid #ccc');
        if($("#video_detailed .addcomments_state").hasClass("exsit")){
            $("#video_detailed .no_comment").removeClass("exsit");
        }
        $("#commentinfo_video").val("");
        $("span.video_textlength").html(0);
        if($("#video_detailed .addcomments_state").hasClass("canclecomments_icon")){
            $("#video_detailed .addcomments_state").addClass("addcomments_icon");
            $("#video_detailed .addcomments_state").removeClass("canclecomments_icon");
        }
    }
    $("#video_detailed").on( "pagehide", function( event ) {
        reViewPage();
    });

    function showDetailWithSuevey() {
        $("#video_detailed .registerbtn").show();
        $("#video_detailed .registerAcbtn").hide();
        $("#video_detailed .activity_details_calendar").hide();
        if(videoInfo.regFlag == "false"){
            $("#btn_details_submitNow").html("Take this survey now");
        }
        else{
            $("#btn_details_submitNow").html("Show result");
        }
        $('#videoDetail_content').css('height',($(window).height()-44-20-48));
        //$('#videoDetail_content_height').css('height',($(window).height()-44-20-10-10-48));
        getSurvies(videoInfo);
    }
    function showDetailWithActivity(){
        $("#video_detailed .registerbtn").hide();
        $('#videoDetail_content').css('height',($(window).height()-44-20-48));
          $('#videoDetail_content_height').css('height',($(window).height()-44-20-10-10-52));
        if((videoInfo.reg && videoInfo.fromtype == "like") || (typeof(videoInfo.enrollStatus) != "undefined" && videoInfo.enrollStatus != 0)){
            $("#video_detailed .registerAcbtn").hide();
            $("#video_detailed .activity_details_calendar").hide();
            if(videoInfo.enrollStatus == 3 ){
                //    已签到
                $("#activity_community_check").show();
                $("#activity_community_hasnot").hide();
            }
            if(videoInfo.enrollStatus == 4 ){
                //    签到时间未到
                $("#activity_community_hasnot").show();
                $("#activity_community_check").hide();
            }
        }
        else{
            if(videoInfo.enrollStatus == 0){
                if(videoInfo.isSetReminder == "Y"){
                    $("#video_detailed #btn_activity_details_calendar").removeClass("btn_activity_details_calendar").addClass('gray-bg').html("Added");
                }
                else{
                    $("#video_detailed #btn_activity_details_calendar").addClass("btn_activity_details_calendar").html("Add to calendar");
                }
                $("#video_detailed .registerAcbtn").hide();
                $("#video_detailed .activity_details_calendar").show();
                $("#activity_community_hasnot").hide();
                $("#activity_community_check").hide();

            } else{
                $("#activity_community_hasnot").hide();
                $("#activity_community_check").hide();
                $("#video_detailed .activity_details_calendar").hide();
                $("#video_detailed .registerAcbtn").show();
            }
        }
        getAcvtivities(videoInfo);
        if(activityReg == true ){
            activityReg = false;
            return false;
        }
        if($("#video_detailed").hasClass("fromRegPage")){
            activityReg = false;
            $("#video_detailed").removeClass("fromRegPage");
            return false;
        }
    }
    function showDetailWithVideo(){
        $("#video_detailed .registerbtn").hide();
        $("#video_detailed .registerAcbtn").hide();
        $("#video_detailed .activity_details_calendar").hide();
        $('#videoDetail_content').css('height',($(window).height()-44-20));
        $('#videoDetail_content_height').css('height',($(window).height()-44-20-10-10));
        getVideos(videoInfo);
    }
    function showDetailWithNew(video){
       // $('#video_detailed .add_comment').css('height', ($(window).height() - 44));
       // $('#add_comment_opacity').css('height', ($(window).height() - 44 - 50));
       videoInfo = video;
       if (video.types == 'new') {
            $("#title_video_details").html("Newsroom");
            videoInfo.infoId = video.newsId;
            showDetailWithVideo();
        } else if (video.types == 'activity') {
            $("#title_video_details").html("Activities");
            videoInfo.infoId = video.id;
            showDetailWithActivity();
        }
        else if (video.types == 'survey') {
            $("#title_video_details").html("Survey");
            videoInfo.infoId = video.survey_id;
            showDetailWithSuevey();
        }
        var tags = video.tags ? video.tags : video.TTagses;
        var result = filterTag(tags,"NOW");
        // if(pageId == "video"){
        //     $("#title_video_details").html("HSBC NOW");
        // }
        // else if (pageId === "newsroom") {
        //     $("#title_video_details").html("Newsroom");
        // }
        // else if (pageId === "activities") {
        // $("#title_video_details").html("Activities");
        // }
        // else if (pageId === "talentShow") {
        //     $("#title_video_details").html("Talent Show");
        // }
        // else
        if(result != -1){
            $("#title_video_details").html("HSBC NOW");
        }
        if ((pageId === "mycorner" || pageId == "mycornerallarticle") && videoInfo.fromtype) {
            if(videoInfo.fromtype == "likeSurvey" || videoInfo.fromtype == "like"){
                $("#title_video_details").html("Articles I Liked");
            }
            else if(videoInfo.fromtype == "regSurvey"){
                $("#title_video_details").html("SURVEY I PARTICIPATED");
            }
            else{
                $("#title_video_details").html("Registered Activities");
            }
        }
        else {
            $("#title_video_details").html(videoInfo.headerTitle);
        }
        var like = (video.like == true) ? "yes" : "no";
        if($("#newsroom li#" + video.infoId).size() > 0) {
            like = $("#newsroom li#" + video.infoId).attr("like");
        }
        var prise = video.likeAmount ? video.likeAmount :0;
        var likeit = video.like;
        if(like == "no"){
            $("#video_detailed .praises_desc i").addClass("praises_icon_no");
            $("#video_detailed .praises_desc i").removeClass("praisesrealy");
        }
        else{
            $("#video_detailed .praises_desc i").addClass("praisesrealy");
            $("#video_detailed .praises_desc i").removeClass("praises_icon_no");
        }
        if(likeit == false && like == "yes"){
            prise = parseInt(prise)+1;
        }
        if(likeit == true && like == "no"){
            prise = parseInt(prise)-1;
        }
        $("#video_detailed .detail_praises_count").html((prise == 0) ? "Like" : prise);

        var eyeCount = video.allBrowseTimes ? video.allBrowseTimes : 0;
        if($("#newsroom li#" + video.infoId).size() > 0) {
            eyeCount = $("#newsroom li#" + video.infoId + " span.eye_pagetag").html();
            $("#newsroom li#" + videoInfo.infoId + " span.eye_pagetag").html(parseInt(eyeCount) + 1);
        }
        $("#video_detailed span.eyeCount").html(parseInt(eyeCount)+1);
        $("#photoshow").hide();
        videoSaveLog();
    }
    function showCommentsContent() {
        var postData = {};
        postData['pager.pageNo'] = 1;
        postData['pager.pageSize'] = 1;
        postData['userId'] = q['user'].userId;
        postData['contentId'] = videoInfo.infoId;
        postData['type'] = videoInfo.type ? videoInfo.type : videoInfo.types ;

        net.post('comment/getCommentsList', postData, function(error){
                $("#video_detailed .no_comment").show();
                $("#wrapper_comments").hide();
                $("#refresh_comments").hide();
                $("#video_detailed .backtop").hide();
            },
            function(response){
                if (response.code != 0) {
                    $("#video_listview_comments").empty();
                    $("#video_detailed .detail_comments_count").html("Comment");
                    $("#video_detailed .no_comment").show();
                    $("#wrapper_comments").hide();
                    $("#refresh_comments").hide();
                    $("#loading_comments").hide();
                    $("#nomore_comments").hide();
                    $("#video_detailed .backtop").hide();
                }
                else {
                    var commentsLength = response.data.CommentAmount;
                    if(commentsLength == 0){
                        $("#video_listview_comments").empty();
                        $("#video_detailed .detail_comments_count").html("Comment");
                        $("#video_detailed .no_comment").show();
                        $("#wrapper_comments").hide();
                        $("#refresh_comments").hide();
                        $("#loading_comments").hide();
                        $("#nomore_comments").hide();
                        $("#video_detailed .backtop").hide();
                    }
                    else{
                        $("#video_detailed .detail_comments_count").html(commentsLength);
                        $("#video_detailed .no_comment").hide();
                        $("#wrapper_comments").show();
                        $("#refresh_comments").show();
                        $("#video_detailed .backtop").show();
                        getComments(true);
                    }
                }
            });
    }
    return {
        showDetailWithNew : function (video) {
            pageId = video.pageId;
            showDetailWithNew(video);
        },
        showCommentsContent: function () {
            showCommentsContent();
        },
        from : function (from) {
            page_from = from;
        }
    }

});
