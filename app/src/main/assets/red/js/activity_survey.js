define(function(require) {
    var $ = require('jquery'),
        jqm = require('jquerymobile'),
        net = require('net'),
        dialogs = require('dialogs'),
        mustache = require('mustache'),
        utils = require('utils'),
        surveyQuestionnaires = require('surveyQuestionnaires'),
        club_survey = require('text!club_survey'),
        club_surveyDetails = require('text!club_surveyDetails'),
        surveyConfirm = require('survey_confirm'),
        MeScroll = require('MeScroll');

   // var currentPageNum = 1;

    var ActiveSurvey = {
        surveyId:null,
        currentPageNum:1,
        hasNext:true,
        totalLen:0,
        initEvent:function(){

        },
        backEvents:function(params){
            if(params){
                $('#clubSurveyDetails_back').off('click').on('click', function () {
                    $.mobile.changePage(('#'+params), {transition: 'slide',reverse: true,changeHash: false,allowSamePageTransition:true});
                });
            }else{
                $('#clubSurveyDetails_back').off('click').on('click', function () {
                    $.mobile.changePage(('#lastActive'), {transition: 'slide',reverse: true,changeHash: false,allowSamePageTransition:true});
                });
            }
        },
        listBackEvents:function(){
            $('#lastActive_back').off('click').on('click', function () {
                $.mobile.changePage(('#club'), {transition: 'slide',reverse: true,changeHash: false,allowSamePageTransition:true});
            });
        },
        toSurveyPageEvents:function(){
            var that = this;
            // take this survey btn
            $('#clubSurveyDetails .clubSurveyBtn .go-attend').off('tap').on('tap', function () {
                that.toSurveyPage();
            });
            //show result btn
            $('#clubSurveyDetails .clubSurveyBtn .show-result').off('tap').on('tap', function () {
                that.toSurveyConfirmPage();
            });

        },
        likeAndDislikeEvents:function(){
            $('#clubSurveyDetails .comments_tab_like').off('tap').on('tap', function () {
                $(".loadingDiv").addClass("active");

                var $commentsLike = $('#clubSurveyDetails .comments_tab_like');
                var praises_count = $("#clubSurveyDetails .praises_count").html();
                var postData = {};
                postData['type'] = 'survey';
                postData['userId'] = q['user'].userId;
                if ($commentsLike.hasClass("on")) {
                    postData['contentId'] = ActiveSurvey.surveyId;
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
                                $("#clubSurveyDetails .praises_count").html((parseInt(praises_count)-1 == 0) ? "Like" : parseInt(praises_count)-1);
                            }
                            $(".ui-loader").hide();
                            $(".loadingDiv").removeClass("active");
                        }
                    });
                } else {
                    postData['like.contentId'] = ActiveSurvey.surveyId;
                    net.post('like/saveLike', postData, function(error){
                        $(".ui-loader").hide();
                        $(".loadingDiv").removeClass("active");
                    }, function(response){
                        if (response.code != 0) {
                            $(".ui-loader").hide();
                            $(".loadingDiv").removeClass("active");
                            var msg = response.msg?response.msg:"You have already like it."
                            dialogs.alert("Tips",msg,['OK'],function(){
                                return false;
                            });

                        } else {
                            $commentsLike.addClass("on");
                            if(praises_count != "Like") {
                                $("#clubSurveyDetails .praises_count").html(parseInt(praises_count) + 1);
                            }
                            $(".ui-loader").hide();
                            $(".loadingDiv").removeClass("active");
                        }
                    },{loading:false});
                }
            });
        },
        toggleCommentAreaEvent:function(){
            var that = this;
            $("#clubSurveyDetails .comments_tab_com-survey").off('click').on('click',function(){
                 $('.commentArea').toggle();
                if ($('.commentArea').is(':visible')) {
                    $('#clubSurveyDetails .comments_tab').css('height', 'auto');
                    $("#clubDSurveyDetails-body .clubActivity-inner").scrollTop(parseInt($("#surveyDetails .commentArea").offset().top+$("#clubDSurveyDetails-body .clubActivity-inner").scrollTop()-45));

                    that.getComments(true);
                    that.addCommentsEvents();
                } else {
                    $('#clubSurveyDetails .comments_tab').css('height', '36px');
                }
            });
        },
        addCommentsEvents:function(){

            var that = this;
            $('#clubSurveyDetails').off('tap').on('tap','.addcomments_icon', function(event){
                 event.stopPropagation();
                 event.preventDefault();
                 $(".survey-detail").addClass('overFlowY');
                 $("#clubSurveyDetails .add_comment").show();
                 $(".loadingDiv").addClass("active addCommentInput");
                 $("#clubSurveyDetails .commentinfo_video").focus();
            });
            $('#clubSurveyDetails').off('click').on('click', '.commit_comments', function(){
                that.commitComent(that.surveyId);
            });
        },
        commitComent:function(id) {
            $(".survey-detail").removeClass('overFlowY');
            var that = this;
            $("#clubSurveyDetails .commentinfo_video").blur();
            $(".loadingDiv").addClass("active");
            var content = $("#clubSurveyDetails .commentinfo_video").val().trim();
            if(content == ""){
                $(".ui-loader").hide();
                $(".loadingDiv").removeClass("active");
                dialogs.alert('Confirmation', "Please input your comment.", ['OK'], function(title) {
                    $("#clubSurveyDetails .add_comment").hide();
                });
                return false;
            }
            var postData = {};
            postData['comment.contentId'] = id;
            postData['comment.comments'] = content;
            postData['type'] = 'survey';
            postData['userId'] = q['user'].userId;

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
                        var commentCount = $("#clubSurveyDetails .comments_count").html();
                        $("#clubSurveyDetails .comments_count").html((commentCount == "Comment") ? 1 :parseInt(commentCount)+1);
                        $("#clubSurveyDetails .commentinfo_video").val("");
                        $("span.video_textlength").html(0);
                        $("#clubSurveyDetails .addcomments_state").addClass("addcomments_icon");
                        $("#clubSurveyDetails .addcomments_state").removeClass("canclecomments_icon");
                        var $comment = that.getCommentHTML(commentInfo,true);
                        $("#clubSurveyDetails .no_comment").hide();
                        $("#comments_component_listview_survey").prepend($comment);
                        var commentId = commentInfo.id;
                        $("#clubSurveyDetails span#"+commentId+"del").on("tap",function(){
                            dialogs.alert('Confirmation', 'Are you sure you want to delete this comment?', ['Cancel','Delete'], function(title) {
                                if(title == 'Delete') {
                                    $(".loadingDiv").addClass("active");
                                    var postData = {};
                                    postData['commentId'] = commentId;
                                    postData['flag'] = 'app';
                                    postData['userId'] = q['user'].userId;
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
                                                var comment_Count = $("#clubSurveyDetails .comments_count").html();
                                                $("#clubSurveyDetails .comments_count").html((parseInt(comment_Count)-1 == 0) ? "Comment" :parseInt(comment_Count)-1 );
                                                if($("#comments_component_listview_survey").html() == "" && comment_Count <= 1){
                                                    $("#clubSurveyDetails .no_comment").show();
                                                    $("#wrapper_comments").hide();
                                                    $("#refresh_comments").hide();
                                                    $("#clubSurveyDetails .backtop").hide();
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
                        $("#clubSurveyDetails .commentinfo_video").blur();
                        $("#clubSurveyDetails .add_comment").hide();
                        $("#clubSurveyDetails .buttonShow").show().removeClass("buttonShow");
                        $(".loadingDiv").removeClass("addCommentInput");
                        setTimeout(function(){
                            $(".ui-loader").hide();
                            $(".loadingDiv").removeClass("active");
                        },1500);
                    }
                }, {loading:false});
        },
        /**
         * get survey list on club page icon
         *
         * @Param {Type} name
         * @Returns {returnType}
         * @Author Linda
         * @Date 25/10/2017
         */
        getSurveyList:function(isRefresh) {
            var that = this;
            $("#lastActive").unbind("pagebeforeshow");
            $('#lastActive .header-title').html('Survey');
            var pageSize = 5;
            var url = 'survey/searchListByapp';
            var post_param = {
                'userId':"8C947AEFEDDDFA44810335D1AE9D6DD2", //here to get the userId
                'pager.pageNo':that.currentPageNum,
                'pager.pageSize':pageSize
            }
            net.post(url,post_param,function (error) {
                //fail
                mescroll.endErr();
            },function (response) {

                if (response.code !== 0) {
                    mescroll.endErr();
                } else {

                    var responseLength = response.data.survey.length;
                    that.totalLen += responseLength;
                    if (responseLength > 0) {
                        that.hasNext = true;
                        $.each(response.data.survey, function (index, item) {
                            item.deadline = 'Deadline : ' + utils.dateString(item.deadline*1000);
                        });
                    }else{
                        that.hasNext = false;
                        mescroll.endSuccess(that.totalLen,that.hasNext);
                    }
                    if (isRefresh) {
                        $('#lastActiveSurvey-list li').html(mustache.render(club_survey, response.data));
                    } else {
                        $('#lastActiveSurvey-list li').append(mustache.render(club_survey, response.data));
                    }
                    mescroll.endSuccess();
                    that.listBackEvents();
                    that.currentPageNum ++;

                }
            })
        },
        /**
         * go to survey detail page
         *
         * @Param {Object} obj
         * @Returns {None}
         * @Author Linda
         * @Date 25/10/2017
         */
        getSurveyNewsDetailbyId:function(sid,params){
            var that = this;
            this.surveyId = sid;
            var url  = 'survey/getSurveyById';
            var post_param = {
                userId:q['user'].userId,
                surveyId:sid
            };
            net.post(url,post_param,function (error) {
                //fail
            },function (response) {
                if (response.code !== 0) {

                } else {
                    //var responseLength = response.data.survey.length;
                    if(response.data.survey){
                        //deadline time
                        var date = new Date(response.data.survey.deadline*1000);
                        var month = utils.getMonthString(date.getMonth());
                        response.data.survey.deadline =  date.getDate() + " " + month + " " + date.getFullYear();
                        var postOnData = new Date(response.data.survey.first_publish_time*1000);
                        var month = utils.getMonthString(postOnData.getMonth());
                        response.data.survey.first_publish_time =  postOnData.getDate() + " " + month + " " + postOnData.getFullYear();
                        response.data.survey.browse_times++;
                        $('#clubDSurveyDetails-body').html('');
                        $('#clubDSurveyDetails-body').append(mustache.render(club_surveyDetails, response.data));
                        //根据regFlag判断按钮类型
                        var isTaken = response.data.survey.regFlag;
                        if(isTaken == 'false'){
                            $(".clubSurveyBtn button").removeClass('show-result').addClass('go-attend').html("Take this survey now");
                        }else{
                            $(".clubSurveyBtn button").removeClass('go-attend').addClass('show-result').html("Show result");
                        }
                        if(response.data.survey.like == 'true'){
                            $('.comments_tab_like').addClass('on');
                        }else{
                            $('.comments_tab_like').removeClass('on');
                        }
                        that.toggleCommentAreaEvent();
                        that.likeAndDislikeEvents();
                        that.toSurveyPageEvents();
                        that.backEvents(params);
                        that.saveLog(response.data.survey.survey_id);
                        $.mobile.changePage("#clubSurveyDetails", {transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});

                    }else{
                        console.log("no page content");
                    }

                }
            })

        },
        saveLog:function(id) {
            var postSaveLogData = {};
            postSaveLogData['userId'] = q['user'].userId;
            postSaveLogData['log.contentId'] = id;
            postSaveLogData['type'] =  'survey';
            postSaveLogData['log.module'] = 'newsroom';

            net.post('log/saveLog', postSaveLogData, function(error){
            }, function(response){
                if (response.code != 0) {
                } else {
                }
            });
        },
        //获取评论列表
        getComments:function(refresh) {
            var that = this;
            var postData = {};
            if (refresh) {
                var $refreshEl = $('#refresh_comments');
                $refreshEl.addClass('loading');
                var currentPageNumer = 1;
            } else {
                var $wrapper = $('#wrapper_comments_component'),
                    $loadingEl = $wrapper.find('.loading_comments'),
                    $loadingLabel = $loadingEl.find('.loadingLabel');
                $loadingEl.addClass('loading');
                $loadingLabel.text('Loading...');
            }
            postData['pager.pageNo'] = currentPageNumer;
            postData['pager.pageSize'] = 5;
            postData['contentId'] = that.surveyId;
            postData['userId'] = q['user'].userId;
            postData['type'] = 'survey';
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
                        that.showCommentContent(commentsList, refresh);
                        currentPageNumer++;
                    } else {
                        $('.commentArea .no_comment').show();
                        if(refresh){
                            $('#comments_component_listview_survey').html("");
                        } else {
                            $('#comments_component_listview_survey').append("");
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
    },
        //显示评论列表
        showCommentContent:function(contentList, refresh){
                var that = this;
                var contentHTML = "",
                    contentArray = [],
                    commentIds =[],
                    $comment_listview = $("#comments_component_listview_survey");
                $.each(contentList, function(i, content) {
                    if(i == contentList.length-1){
                        last_time = content.publish_time;
                    }
                    if(refresh){
                        contentArray.push(that.getCommentHTML(content));
                        commentIds.push(content.id);
                    }
                    else{
                        if($("li#"+content.id).size() == 0){
                            contentArray.push(that.getCommentHTML(content));
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
                    $("#clubSurveyDetails span#"+commentId+"del").on("tap",function(){
                        dialogs.alert('Confirmation', 'Are you sure you want to delete this comment?', ['Cancel','Delete'],function(title) {
                            if(title == 'Delete') {
                                $(".loadingDiv").addClass("active");
                                var postData = {};
                                postData['commentId'] = commentId;
                                postData['flag'] = 'app';
                                postData['userId'] = q['user'].userId;
                                net.post('comment/deleteComments', postData, function(error){
                                    $(".ui-loader").hide();
                                    $(".loadingDiv").removeClass("active");

                                }, function(response){
                                    var fail = function(){
                                        $(".ui-loader").hide();
                                        $(".loadingDiv").removeClass("active");
                                        dialogs.alert('Confirmation', response.msg ? response.msg:"Fail to delete comment!", ['OK'], function(title) {
                                        });
                                    };
                                    if (response.code != 0) {
                                        fail();
                                    } else {
                                        var result = response.data.result;
                                        if(result == true){
                                            $("li#"+commentId).remove();
                                            var comment_Count = $("#clubSurveyDetails .comments_count").html();
                                            $("#comments_praises .comments_count").html(((parseInt(comment_Count)-1)==0) ? "Comment" :  parseInt(comment_Count)-1 );
                                            if($("#comments_component_listview_survey").html() == "" && comment_Count <= 1){
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
        },
        getCommentHTML:function(comment, newcreate) {
            var date = new Date((comment.publish_time)*1000);
            var month = utils.getMonthString(date.getMonth());
            var hm = this.getHm(date.getHours(),date.getMinutes())
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
        },
        getHm:function(hours, minutes){
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
        },
        /**
         * click the btn to survey page点击进入调查界面
         *
         * @Param {Type} name
         * @Returns {returnType}
         * @Author Linda
         * @Date 25/10/2017
         */
        toSurveyPage:function(params){
            var url = "survey/getSurveyDetial";
            var postData = {};
            postData['survey_id'] = ActiveSurvey.surveyId;
            postData['userId'] = q['user'].userId;
            postData['appOrPCFlag'] = 'APP';

            var questioniInfos = null;
            var surveyInfo = null;
            var surveyDeadLine = null;
            var isShow = null;

            net.post(url,postData,function (error) {
                //fail

            },function(response){
                //request success you can deal with the data here
                if(response.code != 0){

                }else{
                    isShow = response.data.survey.is_show;
                    surveyInfo = response.data.survey;
                    questioniInfos = response.data.survey.questions;
                    surveyDeadLine = response.data.survey.deadline;
                }

            },{async:false});
            // 根据deadline选择前往页面
            var now = (new Date()).valueOf()/1000;

            if(questioniInfos && questioniInfos.length > 0 && (now < surveyDeadLine)){
                surveyQuestionnaires.from('#clubSurveyDetails');
                surveyInfo.backpage = "#clubSurveyDetails";
                var info ={'survey':surveyInfo,'question_infos':questioniInfos};
                surveyQuestionnaires.setAcvtivities(info);
                $.mobile.newChangePage('#questionnaires_survey',{ transition: "slide",reverse: false, changeHash:false});
            }else{
                //调查已过期
                dialogs.alert("Oops","You are too late! The registration of the activity is already closed.", ['OK'], function () {
                    return false;
                });

            }
        },

        toSurveyConfirmPage : function () {
            var url = "survey/getSurveyDetial";
            var postData = {};
            postData['survey_id'] = ActiveSurvey.surveyId;
            postData['userId'] = q['user'].userId;
            postData['appOrPCFlag'] = 'APP';

            var isShow = null;
            net.post(url,postData,function (error) {
                //fail
            },function(response) {
                //request success you can deal with the data here
                if (response.code == 0) {
                    isShow = response.data.survey.is_show;
                }
            },{async:false});

            //跳转到Confirm页面
            surveyConfirm.showConfirmSurvey({"survey_id": postData['survey_id'],"is_show": isShow,"currentStatus":"going","frompage":"#club"});
            $.mobile.changePage('#surveyConfirm', {transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});

        }
    };
    var mescroll = new MeScroll("activityListSurvey", {
        down: {
            offset:60,
            clearEmptyId: "lastActiveSurvey-list-li",
            callback: downCallback
        },
        up: {
            callback: upCallback,
            offset:10,
            noMoreSize:5,
            showNoMore: function(mescroll, upwarp) {
				//无更多数据
				upwarp.innerHTML = mescroll.optUp.htmlNodata;
			}
        }
    });

    function upCallback(){
        ActiveSurvey.getSurveyList(false);
    }
    function downCallback(){
        ActiveSurvey.currentPageNum = 1;
        ActiveSurvey.getSurveyList(true);
    }

    return {
        ActiveSurvey:ActiveSurvey
    }
});
