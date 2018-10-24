/**
 * Created by levon on 2017/8/2.
 */
define(function (require) {
    var $ = require('jquery'),
        jqm = require('jquerymobile'),
        net = require('net'),
        dialogs = require('dialogs'),
        config = require('config'),
        mustache = require('mustache'),
        utils = require('utils'),
        activityRegister = require('activity_register'),
        questionnaires = require('questionnaires'),
        club_activeDetails = require('text!club_activeDetails');

    var currentPageNumer = 1,
        activityReg = false,
        last_time = '';

    var load = {
        init: function (data, pagefrom) {
            var activityInfo = data.data.active,
                activityId = data.data.active.id;
            this.render(data);
            this.bind(activityId, pagefrom, activityInfo);
        },
        render: function (response) {
            var data = response.data,
                end_time = data.active.end_time,
                deadline = data.active.deadline,
                nowTime = new Date().getTime();

            response.data.active.startTimeStr = utils.dateString(data.active.start_time, true);
            response.data.active.endTimeStr = utils.dateString(data.active.end_time, true);
            response.data.active.deadlineStr = utils.dateString(data.active.deadline, true);
            response.data.active.reviewTimeStr = utils.dateString(data.active.review_time);
            response.data.active.browse_times++;
            $('#clubActiveDetails-body').html(mustache.render(club_activeDetails, response));
            if (response.data.active.like === 'true') {
                $('#clubActiveDetails .comments_tab_like').addClass('on');
            }
            if (response.data.active.whosGetQR) {
                var backPer = response.data.active.whosGetQR.split(',');
                if(backPer.indexOf(q['user'].staffId)>-1){
                    $('#qrCode-img-box').show();
                }
            }
            if (nowTime > end_time) {
                $('.clubRegisterAcbtn .js-actOver').siblings('button').hide().end().show();
            } else if (nowTime > deadline) {
                $('.clubRegisterAcbtn .js-regOver').siblings('button').hide().end().show();
            } else{
                // data.active.enrollStatus值：0表示被活动管理者通过，1表示等待活动管理者审核，2表示被活动管理者拒绝
                if (data.active.enrollStatus == 0) {
                    if (data.active.isSetReminder == 'Y') {
                        $('.clubRegisterAcbtn .js-addCalendar').removeClass('btn_activity_details_calendar').addClass('tips').html('Added');
                    } else if(data.active.isSetReminder == 'N')  {
                        $('.clubRegisterAcbtn .js-addCalendar').addClass('btn_activity_details_calendar').removeClass('tips').html('Add to calendar');
                    }
                    $('.clubRegisterAcbtn .js-addCalendar').siblings('button').hide().end().show();
                } else if (data.active.enrollStatus == 1) {
                    $('.clubRegisterAcbtn .js-pending').siblings('button').hide().end().show();
                } else if (data.active.enrollStatus == 2) {
                    $('.clubRegisterAcbtn .js-rejust').siblings('button').hide().end().show();
                } else if (data.active.enrollStatus == 3) {
                    $('.clubRegisterAcbtn .js-Checked').siblings('button').hide().end().show();
                } else if (data.active.enrollStatus == 4) {
                    $('.clubRegisterAcbtn .js-jundge').siblings('button').hide().end().show();
                } else {
                    $('.clubRegisterAcbtn .js-registerNow').siblings('button').hide().end().show();
                }
            }



            // saveLog 后台通过接口来统计浏览量
            saveLog(data.active.id);
            // getComments 获取评论列表
            getComments(data.active.id, true);
        },
        bind: function (activityId, pagefrom, activityInfo) {
            $('.details-content').click(function () {
                $('.commentArea').hide();
                $('#clubActiveDetails .comments_tab').css('height', '36px');
            });

            $('#clubActiveDetails_back').off('click').on('click', function () {
                $.mobile.changePage(('#' + pagefrom), {transition: 'slide',reverse: true,changeHash: false,allowSamePageTransition:true});
            });

            $('.comments_tab_com').off('tap').on('tap', function (event) {
                $('.commentArea').toggle();
                if ($('.commentArea').is(':visible')) {
                    $('#clubActiveDetails .comments_tab').css('height', 'auto');
                    $("#clubActiveDetails-body .clubActivity-inner").scrollTop(parseInt($("#activeDetails .commentArea").offset().top+$("#clubActiveDetails-body .clubActivity-inner").scrollTop()-45));
                } else {
                    $('#clubActiveDetails .comments_tab').css('height', '36px');
                }
            });

            $('#clubActiveDetails').off('tap').on('tap', '.comments_tab_like', function () {
                $(".loadingDiv").addClass("active");

                var $commentsLike = $('#clubActiveDetails .comments_tab_like');
                var praises_count = $("#clubActiveDetails .praises_count").html();
                var postData = {};
                postData['type'] = 'activity';

                if ($commentsLike.hasClass("on")) {
                    postData['contentId'] = activityId;
                    net.post('like/cancleLike', postData, function(error){
                        $(".ui-loader").hide();
                        $(".loadingDiv").removeClass("active");
                    }, function(response){
                        if (response.code != 0) {
                            $(".ui-loader").hide();
                            $(".loadingDiv").removeClass("active");
                        } else {
                            $commentsLike.removeClass("on");
                            if (praises_count != "Like") {
                                $("#clubActiveDetails .praises_count").html((parseInt(praises_count)-1 == 0) ? "Like" : parseInt(praises_count)-1);
                            }
                            $(".ui-loader").hide();
                            $(".loadingDiv").removeClass("active");
                        }
                    });
                } else {
                    postData['like.contentId'] = activityId;
                    net.post('like/saveLike', postData, function(error){
                        $(".ui-loader").hide();
                        $(".loadingDiv").removeClass("active");
                    }, function(response){
                        if (response.code != 0) {
                            $(".ui-loader").hide();
                            $(".loadingDiv").removeClass("active");
                        } else {
                            $commentsLike.addClass("on");
                            if(praises_count != "Like") {
                                $("#clubActiveDetails .praises_count").html(parseInt(praises_count) + 1);
                            }
                            $(".ui-loader").hide();
                            $(".loadingDiv").removeClass("active");
                        }
                    },{loading:false});
                }
            });


            $('#clubActiveDetails .addcomments_icon').off('click').on('click', function(){
                $(".clubActivity-inner").addClass("overFlowY");
                $("#clubActiveDetails .add_comment").show();
                $(".loadingDiv").addClass("active addCommentInput");
                $("#clubActiveDetails .commentinfo_video").focus();
            });

            $('#clubActiveDetails').off('click').on('click', '.commit_comments', function(){
                $(".clubActivity-inner").removeClass("overFlowY");
                commitComent(activityId);
            });

            $(".loading_comments").on("tap", function(){
                if($(".loading_comments").hasClass("loading_running")){
                    return false;
                }
                getComments(activityId);
            });

            //跳转到注册页面
            $('.clubRegisterAcbtn .js-registerNow').off('click')
                .on('click', function() {
                    activityReg = true;
                    // 将后台给的时间戳单位由毫秒改为秒，活动注册页面需要的是秒
                    activityInfo.startTime = activityInfo.start_time / 1000;
                    activityInfo.endTime = activityInfo.end_time / 1000;
                    activityInfo.deadline = activityInfo.deadline / 1000;

                    var _activityFlag = activityInfo.flag;
                    if(!_activityFlag){
                        activityInfo.frompage = '#clubActiveDetails';
                        var questioniInfos = null;
                        net.post('questionnaire/searchQuestionList', {
                            'questionnaire_id': activityId
                        }, function(error) {
                        }, function(response) {
                            if (response.code != 0) {
                                dialogs.alert('Confirmation', response.msg, ['OK'], function(title) {
                                });
                            }
                            else{
                                questioniInfos = response.data.questions;
                            }
                        },{async:false});

                        if (questioniInfos && questioniInfos.length > 0) {
                            questionnaires.from('#clubActiveDetails');
                            var info ={'acvtivitie':activityInfo,'question_infos':questioniInfos};
                            questionnaires.setAcvtivities(info);
                            $.mobile.newChangePage('#questionnaires_activity',{ transition: "slide",reverse: false, changeHash:false});
                        } else {
                            activityRegister.setAcvtivities(activityInfo);
                            activityRegister.from('#clubActiveDetails');
                            $.mobile.newChangePage('#activityRegister', { transition: "slide", reverse: false, changeHash:false});
                        }
                    } else {
                        if (_activityFlag=='activity.deadTime'){
                            dialogs.alert("Oops","You are too late! The registration of the activity is already closed.", ['OK'], function () {
                                return false;
                            });
                        } else if (_activityFlag=='activity.limitNum'){
                            dialogs.alert("Oops","Sorry but your registration cannot be processed now as the activity has reached its maximum capacity.", ['OK'], function () {
                                return false;
                            });
                        } else if(_activityFlag=='activity.appIsTwo'){
                            dialogs.alert("Oops","Looks like you have already registered this activity!", ['OK'], function () {
                                return false;
                            });
                        } else {
                            dialogs.alert("Oops","Looks like have other issues. please contact #red help center!", ['OK'], function () {
                                return false;
                            });
                        }
                    }
                });
            // 添加活动到日历提醒
            $('.clubRegisterAcbtn .js-addCalendar').off('click')
                .on('click', function() {
                    if(!$(this).hasClass('btn_activity_details_calendar')){
                        return false;
                    }

                    var remind_activity_time = activityInfo.start_time;
                    var remindActivityTime = new Date(remind_activity_time);
                    remindActivityTime.setDate(remindActivityTime.getDate()-1);
                    remindActivityTime.setHours(20);
                    remindActivityTime.setMinutes(0);

                    alarmClock.addAlarmClock([(Math.round(remindActivityTime.getTime()/1000)).toString(), activityInfo.subject,activityInfo.briefContent, '100', (activityInfo.start_time/1000).toString(), (activityInfo.end_time /1000).toString(), null, null, null, activityInfo.id + q['user'].userId], function(success){
                            var postData = {};
                            postData['contentId'] = activityInfo.id;
                            postData['type'] = 'activity';
                            postData['userId'] = q['user'].userId;
                            net.post('activity/saveCalendarReminder', postData,
                                function (error) {
                                    alarmClock.deleteManyAlarmClock([activityInfo.id+q['user'].userId],
                                        function(success){
                                            console.log(success);
                                        },
                                        function(error){
                                            console.log(error);

                                        });
                                }, function(response){
                                    if (response.code != 0) {
                                        alarmClock.deleteManyAlarmClock([activityInfo.id+q['user'].userId],
                                            function(success){
                                                console.log(success);
                                            },
                                            function(error){
                                                console.log(error);
                                            }
                                        );
                                        dialogs.alert('Oops','Fail to connect system calendar. Please restart and try again.',['OK'],function(title) {
                                        });
                                    } else {
                                        $('li#'+activityInfo.id+' .li_nowRegister').addClass('calendarAdded');
                                        $('.clubRegisterAcbtn .js-addCalendar').removeClass('btn_activity_details_calendar').addClass('tips').html('Added');
                                    }
                                },
                                {loading:false}
                            );
                        }, function(error){
                            dialogs.alert('Confirmation', 'Fail to connect system calendar. Please restart and try again.', ['OK'], function(title) {
                            });
                        });
                });
        }
    };

    /**
     * saveLog 后台通过接口来统计浏览量
     * @param id 当前activity的id
     */
    function saveLog(id) {
        var postSaveLogData = {};
        postSaveLogData['log.contentId'] = id;
        postSaveLogData['type'] =  'activity';
        postSaveLogData['log.module'] = 'newsroom';

        net.post('log/saveLog', postSaveLogData, function(error){
        }, function(response){
            if (response.code != 0) {
            } else {
            }
        });
    }

    /**
     * getComments 获取当前activity的评论
     * @param id 当前activity的id
     * @param refresh 是否刷新
     */
    function getComments(id, refresh) {
        var postData = {};
        if (refresh) {
            var $refreshEl = $('#refresh_comments');
            $refreshEl.addClass('loading');
            currentPageNumer = 1;
        } else {
            var $wrapper = $('#wrapper_comments_component'),
                $loadingEl = $wrapper.find('.loading_comments'),
                $loadingLabel = $loadingEl.find('.loadingLabel');
            $loadingEl.addClass('loading');
            $loadingLabel.text('Loading...');
            postData['lastTime'] = last_time;
        }
        postData['pager.pageNo'] = currentPageNumer;
        postData['pager.pageSize'] = 5;
        postData['contentId'] = id;
        postData['type'] = 'activity';
        // 获取评论列表
        net.post('comment/getCommentsList', postData, function(error){
                if (refresh) {
                    $refreshEl = $('#refresh_comments');
                    $refreshEl.removeClass('loading');
                    $('#refresh_comments').removeClass('refresh_running');
                } else {
                    var $wrapper = $('#wrapper_comments_component'),
                        $loadingEl = $wrapper.find('.loading_comments'),
                        $loadingLabel = $loadingEl.find('.loadingLabel');
                    $loadingEl.removeClass('loading');
                    $loadingLabel.text('Load more comments');
                    $('.loading_comments').removeClass('loading_running');
                }
            },
            function (response) {
                if (response.code != 0) {
                    if (refresh) {
                        var $refreshEl = $('#refresh_comments');
                        $refreshEl.removeClass('loading');
                        $('#refresh_comments').removeClass('refresh_running');
                    } else {
                        var $wrapper = $('#wrapper_comments_component'),
                            $loadingEl = $wrapper.find('.loading_comments'),
                            $loadingLabel = $loadingEl.find('.loadingLabel');
                        $loadingEl.removeClass('loading');
                        $loadingLabel.text('Load more comments');
                        $('.loading_comments').removeClass('loading_running');
                    }
                } else {
                    var commentsList = response.data.CommentList;
                    var commentsListLength = commentsList.length;
                    if (commentsListLength > 0) {
                        showCommentContent(commentsList, refresh);
                        currentPageNumer++;
                    } else {
                        $('.commentArea .no_comment').show();
                        if(refresh){
                            $('#comments_component_listview').html("");
                        } else {
                            $('#comments_component_listview').append("");
                        }
                    }
                    var commentsSize = response.data.CommentAmount;
                    $('#comments_praises .comments_count').html((commentsSize == 0) ? 'Comment' : commentsSize);
                    setTimeout(function() {
                        var $refreshEl = $('#refresh_comments'),
                            $refreshIcon = $refreshEl.find('.refreshIcon'),
                            $loadingEl = $('#wrapper_comments_component').find('.loading_comments'),
                            $loadingLabel = $loadingEl.find('.loadingLabel'),
                            $loadingIcon = $loadingEl.find('.loadingIcon');
                        if(refresh){
                            $refreshEl.removeClass('loading');
                            $('#refresh_comments').removeClass('refresh_running');

                            if(commentsListLength < 5){
                                $('#wrapper_comments_component .nomore_comments').hide();
                                $loadingEl.hide();
                                $('#wrapper_comments_component .backtop').hide();
                            }else{
                                $('#wrapper_comments_component .nomore_comments').hide();
                                $loadingEl.show();
                                $('#wrapper_comments_component .backtop').show();
                            }
                        } else {
                            $loadingEl.removeClass('loading');
                            $loadingLabel.text('Load more comments');
                            $('.loading_comments').removeClass('loading_running');
                            if(commentsListLength < 5){
                                $('#wrapper_comments_component .nomore_comments').show();
                                $('#wrapper_comments_component .nomore_comments .noLabel').text('No more comments');
                                $loadingEl.hide();
                                $('#wrapper_comments_component .backtop').show();
                            }else{
                                $('#nomore_comments').hide();
                                $loadingEl.show();
                                $('#wrapper_comments_component .backtop').show();
                            }
                        }
                        //disableClickEvent(false);
                    }, 800);
                }
            });
    }

    function showCommentContent(contentList, refresh){
        var contentHTML = "",
            contentArray = [],
            commentIds =[],
            $comment_listview = $("#comments_component_listview");
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
            $("#clubActiveDetails span#"+commentId+"del").on("tap",function(){
                dialogs.alert('Confirmation', 'Are you sure you want to delete this comment?', ['Cancel','Delete'],function(title) {
                    if(title == 'Delete') {
                        $(".loadingDiv").addClass("active");
                        var postData = {};
                        postData['commentId'] = commentId;
                        postData['flag'] = 'app';
                        net.post('comment/deleteComments', postData, function(error){
                            $(".ui-loader").hide();
                            $(".loadingDiv").removeClass("active");

                        }, function(response){
                            var fail = function(){
                                $(".ui-loader").hide();
                                $(".loadingDiv").removeClass("active");
                                dialogs.alert('Confirmation', "Fail to delete comment!", ['OK'], function(title) {
                                });
                            };
                            if (response.code != 0) {
                                fail();
                            } else {
                                var result = response.data.result;
                                if(result == true){
                                    $("li#"+commentId).remove();
                                    var comment_Count = $("#clubActiveDetails .comments_count").html();
                                    $("#comments_praises .comments_count").html(((parseInt(comment_Count)-1)==0) ? "Comment" :  parseInt(comment_Count)-1 );
                                    if($("#comments_component_listview").html() == "" && comment_Count <= 1){
                                        $(".commentArea .no_comment").show();
                                        $("#wrapper_comments_component .wrapper_comments").hide();
                                        $("#wrapper_comments_component .refresh_comments").hide();
                                        $("#wrapper_comments_component .backtop").hide();
                                    }
                                    setTimeout(function() {
                                        $(".ui-loader").hide();
                                        $(".loadingDiv").removeClass("active");
                                        // disableClickEvent(false);
                                    }, 1500);
                                } else {
                                    fail();
                                }
                            }
                        }, {loading:false});
                    }
                });
            });
        });
        //$comment_listview.listview("refresh");
    }

    function commitComent(id) {
        $("#clubActiveDetails .commentinfo_video").blur();
        $(".loadingDiv").addClass("active");
        var content = $("#clubActiveDetails .commentinfo_video").val().trim();
        if(content == ""){
            $(".ui-loader").hide();
            $(".loadingDiv").removeClass("active");
            dialogs.alert('Confirmation', "Please input your comment.", ['OK'], function(title) {
                $("#clubActiveDetails .add_comment").hide();
            });
            return false;
        }
        var postData = {};
        postData['comment.contentId'] = id;
        postData['comment.comments'] = content;
        postData['type'] = 'activity';

        net.post('comment/saveComment', postData, function(error){
                $(".ui-loader").hide();
                $(".loadingDiv").removeClass("active");
            },
            function(response){

                var fail = function() {
                    $(".ui-loader").hide();
                    $(".loadingDiv").removeClass("active");
                    dialogs.alert('Confirmation', "Fail to save comment", ['OK'], function(title) {
                    });
                };

                if (response.code != 0) {
                    fail();
                } else {
                    var commentInfo = response.data.commentObj;
                    var commentCount = $("#clubActiveDetails .comments_count").html();
                    $("#clubActiveDetails .comments_count").html((commentCount == "Comment") ? 1 :parseInt(commentCount)+1);
                    $("#clubActiveDetails .commentinfo_video").val("");
                    $("span.video_textlength").html(0);
                    $("#clubActiveDetails .addcomments_state").addClass("addcomments_icon");
                    $("#clubActiveDetails .addcomments_state").removeClass("canclecomments_icon");
                    var $comment = getCommentHTML(commentInfo,true);
                    $("#comments_component_listview").prepend($comment);
                    var commentId = commentInfo.id;
                    $("#clubActiveDetails span#"+commentId+"del").on("tap",function(){
                        dialogs.alert('Confirmation', 'Are you sure you want to delete this comment?', ['Cancel','Delete'], function(title) {
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
                                        dialogs.alert('Confirmation', "Fail to delete comment!", ['OK'], function(title) {
                                        });
                                    };
                                    if (response.code != 0) {
                                        fail();
                                    }
                                    else {
                                        var result = response.data.result;
                                        if(result == true){
                                            $("li#"+commentId).remove();
                                            var comment_Count = $("#clubActiveDetails .comments_count").html();
                                            $("#clubActiveDetails .comments_count").html((parseInt(comment_Count)-1 == 0) ? "Comment" :parseInt(comment_Count)-1 );
                                            if($("#comments_component_listview").html() == "" && comment_Count <= 1){
                                                $("#clubActiveDetails .no_comment").show();
                                                $("#wrapper_comments").hide();
                                                $("#refresh_comments").hide();
                                                $("#clubActiveDetails .backtop").hide();
                                            }
                                            setTimeout(function() {
                                                $(".ui-loader").hide();
                                                $(".loadingDiv").removeClass("active");
                                                //disableClickEvent(false);
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
                    $("#clubActiveDetails .no_comment").hide();
                    //var $commentlistview = $("#comments_component_listview");
                    //$commentlistview.listview("refresh");
                    $("#clubActiveDetails .commentinfo_video").blur();
                    $("#clubActiveDetails .add_comment").hide();
                    $("#clubActiveDetails .buttonShow").show().removeClass("buttonShow");
                    $(".loadingDiv").removeClass("addCommentInput");
                    setTimeout(function(){
                        //disableClickEvent(false);
                        $(".ui-loader").hide();
                        $(".loadingDiv").removeClass("active");
                    },1500);
                }
            }, {loading:false});
    }

    function getCommentHTML(comment, newcreate) {
        var date = new Date((comment.publish_time)*1000);
        var month = utils.getMonthString(date.getMonth());
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

    function getHm(hours, minutes){
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

    return {
        load: load
    };
});
