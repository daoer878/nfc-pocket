/**
 * Created by testbetta1 on 15/9/9.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs','bookrequest','book'], function($, m, net, dia,bookrequest,book) {
    //创建书的详情
    var bookDetailInfo = {};
    var push = false;
    var commentscount = null;
    var likeAmount = null;
    var isLike = false;
    var last_time = null;
    var page_from = null;
    var pageId = null;

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
    $("\#book_wrapper_comments .backtop").on('click',function(){
        var href = $("\#book_wrapper_comments a").attr("href");
        console.log(href);
        location.href = href;
    });


    $("#book_detail .comments_desc").off("click")
        .on("click",function(){
            if($("#book_detail .news_commentarea:visible").size() > 0){
                $("#book_detail .news_commentarea").hide();
                $("#commentinfo_book").val("");
                $("#book_detail .add_comment").hide();
                $('.comments_praises .praises_desc').css('border-bottom', '0px solid #ccc');
            }else{
                $("#book_detail .news_commentarea").show();
                $("#commentinfo_book").val("");
                $("#book_detail .add_comment").hide();
                if($("#book_listview_comments").html() == ""){
                    $("#book_detail .no_comment").show();
                }else{
                    $("#book_detail .no_comment").hide();
                }
                $('.comments_praises .praises_desc').css('border-bottom', '1px solid #ccc');
                $("#book_detail_content").scrollTop(parseInt($("#book_comments_area").offset().top+$("#book_detail_content").scrollTop()-45));
            }
        });

    $("#book_detail .praises_desc").unbind("tap").on("tap",function(){
        $(".loadingDiv").addClass("active");
        var ilabel = $(this).find("i");
        var praises_count = $("#book_detail .detail_praises_count").html();
        if(ilabel.hasClass("praises_icon_no")){
            var postData = {};
            postData['like.contentId'] = bookDetailInfo.book_mgrNo;
            postData['type'] = 'book';
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
                            $("#book_detail .detail_praises_count").html((parseInt(praises_count)+1));
                        }
                        if($("#newsroom li#" + bookDetailInfo.infoId).size() > 0){
                            var priseCount = $("#newsroom li#"+bookDetailInfo.infoId+" .prise_pagetag").html();
                            $("#newsroom li#"+bookDetailInfo.infoId).attr("like","yes");
                            $("#newsroom li#"+bookDetailInfo.infoId+" .prise_pagetag").html(parseInt(priseCount)+1);
                        }
                        $(".ui-loader").hide();
                        $(".loadingDiv").removeClass("active");
                    }
                },{loading:false});
        }
        else{
            var postData = {};
            postData['contentId'] = bookDetailInfo.book_mgrNo;
            postData['type'] = 'book';
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
                        $("#book_detail .detail_praises_count").html((parseInt(praises_count)-1 == 0) ? "Like" : parseInt(praises_count)-1);
                    }
                    if($("#newsroom li#" + bookDetailInfo.infoId).size() > 0) {
                        var priseCount = $("#newsroom li#" + bookDetailInfo.infoId + " .prise_pagetag").html();
                        $("#newsroom li#" + bookDetailInfo.infoId).attr("like", "no");
                        $("#newsroom li#" + bookDetailInfo.infoId + " .prise_pagetag").html(parseInt(priseCount) - 1);
                    }
                    $(".ui-loader").hide();
                    $(".loadingDiv").removeClass("active");
                }
            });
        }
    });

    $("#book_detail .addcomments_state").unbind("click").on("click",function(){
        if($("#book_detail .registerAcbtn:visible").size() > 0){
            $("#book_detail .registerAcbtn").addClass("buttonShow").hide();
        }
        if($("#book_detail .registerbtn:visible").size() > 0){
            $("#book_detail .registerbtn").addClass("buttonShow").hide();
        }
        if($("#book_detail .activity_details_calendar:visible").size() > 0){
            $("#book_detail .activity_details_calendar").addClass("buttonShow").hide();
        }
        $("#book_detail .add_comment").show();
        $(".loadingDiv").addClass("active addCommentInput");
        $("#commentinfo_book").focus();
    });
    $('.loadingDiv').on('tap',function(evt){
        $('#commentinfo_book').blur();
        $("#book_detail .add_comment").hide();
        $(".loadingDiv").removeClass("active addCommentInput");
        //if($(this).hasClass("active") && $(this).hasClass("addCommentInput")){
        //    $("#book_detail .buttonShow").show().removeClass("buttonShow");
        //    $("#book_detail .add_comment").show();
        //    $(".loadingDiv").removeClass("active addCommentInput");
        //}
    });
    $("#book_loading_comments").on("tap",function(){
        if($("#book_loading_comments").hasClass("loading_running")){
            return false;
        }
        getComments();
    });

    // 当前页数
    var currentPageNumer = 1;

    function getComments(refresh,bookinfo) {
        var postData = {};
        if (refresh) {
            var $refreshEl = $("#refresh_comments");
            $refreshEl.addClass("loading");
            currentPageNumer = 1;
        }
        else{
            var $wrapper = $("#book_wrapper_comments"),
                $loadingEl = $wrapper.find("#book_loading_comments"),
                $loadingLabel = $loadingEl.find(".loadingLabel");
            $loadingEl.addClass("loading");
            $loadingLabel.text("Loading...");
            postData['lastTime'] = last_time;
        }
        if(page_from == "#myComments"){
            bookDetailInfo = bookinfo;
        }
        postData['pager.pageNo'] = currentPageNumer;
        postData['pager.pageSize'] = 5;
        postData['userId'] = q['user'].userId;
        postData['contentId'] = bookDetailInfo.book_mgrNo;
        postData['type'] = 'book';
        // 获取视频
        net.post('comment/getCommentsList', postData, function(error){
                if (refresh) {
                    $refreshEl = $("#refresh_comments");
                    $refreshEl.removeClass("loading");
                    $("#refresh_comments").removeClass("refresh_running");
                }
                else{
                    var $wrapper = $("#book_wrapper_comments"),
                        $loadingEl = $wrapper.find("#book_loading_comments"),
                        $loadingLabel = $loadingEl.find(".loadingLabel");
                    $loadingEl.removeClass("loading");
                    $loadingLabel.text("Load more comments");
                    $("#book_loading_comments").removeClass("loading_running");
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
                        var $wrapper = $("#book_wrapper_comments"),
                            $loadingEl = $wrapper.find("#book_loading_comments"),
                            $loadingLabel = $loadingEl.find(".loadingLabel");
                        $loadingEl.removeClass("loading");
                        $loadingLabel.text("Load more comments");
                        $("#book_loading_comments").removeClass("loading_running");
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
                            $("#book_listview_comments").html("");
                        }else{
                            $("#book_listview_comments").append("");
                        }
                    }
                    var commentsSize = response.data.CommentAmount;
                    $("#book_detail .detail_comments_count").html((commentsSize == 0) ? "Comment" : commentsSize);
                    setTimeout(function() {
                        var $refreshEl = $("#refresh_comments"),
                            $refreshIcon = $refreshEl.find(".refreshIcon"),
                            $loadingEl = $("#book_wrapper_comments").find("#book_loading_comments"),
                            $loadingLabel = $loadingEl.find(".loadingLabel"),
                            $loadingIcon = $loadingEl.find(".loadingIcon");
                        if(refresh){
                            $refreshEl.removeClass("loading");
                            $("#refresh_comments").removeClass("refresh_running");

                            if(commentsListLength < 5){
                                $("#book_nomore_comments").hide();
                                $loadingEl.hide();
                                $("#book_detail .backtop").hide();
                            }else{
                                $("#book_nomore_comments").hide();
                                $loadingEl.show();
                                $("#book_detail .backtop").show();
                            }
                        }
                        else{
                            $loadingEl.removeClass("loading");
                            $loadingLabel.text("Load more comments");
                            $("#book_loading_comments").removeClass("loading_running");
                            if(commentsListLength < 5){
                                $("#book_nomore_comments").show();
                                $("#book_nomore_comments .noLabel").text("No more comments");
                                $loadingEl.hide();
                                $("#book_detail .backtop").show();
                            }else{
                                $("#book_nomore_comments").hide();
                                $loadingEl.show();
                                $("#book_detail .backtop").show();
                            }
                        }
                        disableClickEvent(false);
                    }, 800);
                    if(commentsSize == "Comment"){
                        $("#book_detail .no_comment").show();
                    }else{
                        $("#book_detail .no_comment").hide();
                    }
                }
            },{loading:false});
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
        var html = '\<li  style="border: 0px;padding: 0px;margin:10px 10px 5px 10px;background:none"  id='+commentId+'\>\
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
            $comment_listview = $("#book_listview_comments");
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
            $("#book_detail span#"+commentId+"del").on("tap",function(){
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
                                    var comment_Count = $("#book_detail .detail_comments_count").html();
                                    $("#book_detail .detail_comments_count").html(((parseInt(comment_Count)-1)==0) ? "Comment" :  parseInt(comment_Count)-1 );
                                    if($("#book_listview_comments").html() == "" && comment_Count <= 1){
                                        $("#book_detail .no_comment").show();
                                        $("#book_wrapper_comments").hide();
                                        $("#refresh_comments").hide();
                                        $("#book_detail .backtop").hide();
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

    $('#commentinfo_book').off('keyup')
        .on('keyup', function(evt) {
            if (evt.keyCode == 13) {
                commitComent_video();
            }
        });
    $("#book_detail .commit_comments").off('click').on("click",function(){
        commitComent_video();
    });

    function commitComent_video(){
        $("#commentinfo_book").blur();
        $(".loadingDiv").addClass("active");
        var content = $("#commentinfo_book").val().trim();
        if(content == ""){
            $(".ui-loader").hide();
            $(".loadingDiv").removeClass("active");
            dia.alert('Confirmation', "Please input your comment.", ['OK'], function(title) {

            });
            return false;
        }
        var postData = {};
        postData['comment.contentId'] = bookDetailInfo.book_mgrNo;
        postData['comment.comments'] = content;
        postData['type'] = 'book';
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
                    var commentCount = $("#book_detail .detail_comments_count").html();
                    $("#book_detail .detail_comments_count").html((commentCount == "Comment") ? 1 :parseInt(commentCount)+1);
                    $("#commentinfo_book").val("");
                    $("span.video_textlength").html(0);
                    $("#book_detail .addcomments_state").addClass("addcomments_icon");
                    $("#book_detail .addcomments_state").removeClass("canclecomments_icon");
                    var $comment = getCommentHTML(commentInfo,true);
                    $("#book_listview_comments").prepend($comment);
                    var commentId = commentInfo.id;
                    $("#book_detail span#"+commentId+"del").on("tap",function(){
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
                                            var comment_Count = $("#book_detail .detail_comments_count").html();
                                            $("#book_detail .detail_comments_count").html((parseInt(comment_Count)-1 == 0) ? "Comment" :parseInt(comment_Count)-1 );
                                            if($("#book_listview_comments").html() == "" && comment_Count <= 1){
                                                $("#book_detail .no_comment").show();
                                                $("#book_wrapper_comments").hide();
                                                $("#refresh_comments").hide();
                                                $("#book_detail .backtop").hide();
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
                    $("#book_wrapper_comments").show();
                    $("#refresh_comments").show();
                    $("#book_detail .no_comment").hide();
                    var  $commentlistview = $("#book_listview_comments");
                    $commentlistview.listview("refresh");
                    $("#commentinfo_book").blur();
                    $("#book_detail .add_comment").hide();
                    $("#book_detail .buttonShow").show().removeClass("buttonShow");
                    $(".loadingDiv").removeClass("addCommentInput");
                    setTimeout(function(){
                        disableClickEvent(false);
                        $(".ui-loader").hide();
                        $(".loadingDiv").removeClass("active");
                    },1500);
                }
            },{loading:false});
    }

    function createBookDetailHtml(borrowData) {
        var bookimg = borrowData.book_cover;
        var bookname = borrowData.book_Name;
        var author = borrowData.book_Author;
        var borrownum = borrowData.available_quantity;
        var bookdesc = borrowData.book_desp;
        var publisher = borrowData.book_year;
        var category = borrowData.categoryName;
        var serialNo = borrowData.book_mgrNo;
        var borrowflag = borrowData.borrowFlag;
        var haveBookFlag = borrowData.haveBookFlag;
        var library=borrowData.libraryName;
        var borrow_btn = '\<div id="btn_book_borrow" style="height: 36px; background-color: #e6b012; font-size: 14px; color: #ffffff; margin: 20px 0px 0px 0px; line-height: 36px; text-align: center;">Borrow This Book</div>';

        if(borrowflag == true){
            borrow_btn = '\<div style="border: 1px solid #d2d2d2;font-size:14px;color:#404040; overflow: auto;margin: 20px 0px 0px 0px;text-align: left;">\
            <div class="confirmation_icon" style="height: auto; padding: 10px 10px 10px 50px; width: 100%;">You have already borrowed this book.</div></div> \
            <div id="btn_book_detail_record" style="height: 36px; background-color: #a3bdad; font-size: 14px; color: #ffffff; margin: 20px 0px 0px 0px; line-height: 36px;\
                text-align: center">View My Current Book</div>';
        }
        else {
            var unvisible_btn = "";
            var alertHtml = "";
            if(haveBookFlag == true){
                alertHtml = '\<div style="border: 1px solid #d2d2d2;font-size:14px;color:#404040; overflow: auto;margin: 20px 0px 0px 0px;text-align: left;">\
                <div class="confirmation_icon" id="unvisible_html"  style="height: auto; padding: 10px 10px 10px 50px; width: 100%;">You have already borrowed a book, please check\
                in your current book before borrowing a new one.</div></div>';
                unvisible_btn = '\<div id="btn_book_detail_record" style="height: 36px; background-color: #a3bdad; font-size: 14px; color: #ffffff;margin: 20px 0px 0px 0px;line-height: 36px;\
                    text-align: center">View My Current Book</div>';
            }
            if(borrownum == 0){
                if(borrowData.haveReminderFlag == true){
                    alertHtml = '\<div id="btn_alert_set" style="border: 1px solid #d2d2d2;font-size:14px;color:#404040; overflow: auto;margin: 20px 0px 0px 0px;text-align: left;">\
                <div class="confirmation_icon" style="height: auto; padding: 10px 10px 10px 50px; width: 100%;">Reminder has been set. You will receive a push message once this book becomes as available.</div></div>';
                }
                else{
                    unvisible_btn += '\<div id="btn_book_borrow_no" style="height: 36px; background-color: #a3bdad; font-size: 14px; color: #ffffff;margin: 20px 0px 0px 0px; line-height: 36px;\
                text-align: center;">Remind Me When Available</div>\<div id="btn_alert_set" style="display:none;border: 1px solid #d2d2d2;font-size:14px;color:#404040; overflow: auto;margin: 20px 0px 0px 0px;text-align: left;">\
                <div class="confirmation_icon" style="height: auto; padding: 10px 10px 10px 50px; width: 100%;">Reminder has been set. You will receive a push message once this book becomes as available.</div></div>';
                }
            }
            if(unvisible_btn != "" || alertHtml != ""){
                borrow_btn =  alertHtml + unvisible_btn;
            }
        }
        var publisherEl = "";
        if(publisher){
            publisherEl = '\<div style="margin: 10px 0;">\
            <div style="color:#808080;font-size:12px;width: 80px;float: left;">\
            Publisher</div><div style="margin-left: 80px;color:#404040;font-size:12px;">'+publisher+'\</div></div>';
        }
        var html = '\<img style="max-width: 92px;max-height: 120px;" src="'+bookimg+'"\ ><div style="\
            text-align: center; font-size: 10px; color: #808080; margin-top: 10px;" id="borrownum">'+borrownum+'\ available</div><div style="font-size: 14px; color: #404040;\
            text-align: center; margin: 20px 0 10px 0;word-break: break-all;">'+bookname+'\</div><div style="font-size: 10px; color: #808080;\
            text-align: center">'+(author ? 'By '+author : "")+'\</div><div id="borrow_state_btn">'+borrow_btn+'\</div><div style="height:auto;margin:10px 20px;font-size:10px;\
            color:#f26647">Sorry that borrowing is only available for permanent staff so far.Sorry for the inconvenience.</div>\
            <div style="width: 100%; font-size: 12px; color: #404040; line-height:\
            20px; text-align: left; margin-top: 20px;word-break: break-all;">'+(bookdesc ? bookdesc.replace(/\n/g,'</br>') : "")+'\</div><div style="margin-top:20px;text-align:left;">'+publisherEl+'\
            <div style="margin: 10px 0;">\
            <div style="color:#808080;font-size:12px;width: 80px;float: left;">Category</div><div style="margin-left: 80px;color:#404040;font-size:12px;">\
            '+category+'\</div></div><div style="margin: 10px 0;"><div style="color:#808080;font-size:12px;width: 80px;float: left;">Serial No</div>\
            <div style="margin-left: 80px;color:#404040;font-size:12px;">'+serialNo+'\</div> </div><div style="margin: 10px 0;"><div style="color:#808080;font-size:12px;width: 80px;float: left;">Library</div><div style="margin-left: 80px;color:#404040;font-size:12px;">'+library+'\</div></div></div>';
        return html;
    }

    /**
     * 展示书的详情信息
     * @param content
     */
    function getBookDetail(bookData) {
        var bookDetailHtml = createBookDetailHtml(bookData);
        $("#book_detail_listview").html(bookDetailHtml);
    };
    function getRequestBook(){
        var postData = {};
        postData['userName'] = q['user'].userName;
        postData['bookId'] = bookDetailInfo.book_sn;
        postData['currentTime'] = Math.round(new Date().getTime()/1000);
        postData['libraryId'] = $("#book_detail_listview").attr("cur_ot");
        net.post("bookapp/getPickUpDateAndBookinfo", postData, function(error){},function(response){
            if (response.code != 0) {
                dia.alert('Confirmation', response.msg, ['OK'], function(title) {
                });
            }
            else {
                var bookDetailInfo = response.data.book;
                if(bookDetailInfo.available_quantity == 0){
                    var  borrow_state_btn = '\<div id="btn_book_borrow_no" style="height: 36px; background-color: #e6b012; font-size: 14px; color: #ffffff; margin:  20px 0px 0px 0px; line-height: 36px; text-align: center;">Remind Me When Available</div>\
                    <div  id="btn_alert_set" style="border: 1px solid #d2d2d2;font-size:14px;color:#404040; overflow: auto;margin: 20px 0px 0px 0px;text-align: left;display:none;">\
                    <div class="confirmation_icon" style="height: auto; padding: 10px 10px 10px 50px; width: 100%;">Reminder has been set. You will receive a push message once this book becomes as available.</div></div>';
                    $("#borrow_state_btn").html(borrow_state_btn);
                    $("#borrownum").html("0 available");
                    dia.alert('Confirmation', "No books that can be borrowed.", ['OK'], function(title) {
                    });
                }
                else{
                    var pickUpDayInfo = response.data.pickUpDayInfo;
                    $.extend(bookDetailInfo,pickUpDayInfo);
                    $('#book_request').page();
                    $("#book_request_content").empty();
                    bookrequest.showRequestWithBook(bookDetailInfo);
                    $.mobile.newChangePage("#book_request",{ transition: "slide",reverse:false,changeHash: false});
                }
            }
        },{async:false});
    }


    $('#book_detail').off('click','#btn_book_detail_record').on('click','#btn_book_detail_record', function() {
        $.mobile.newChangePage('#bookrecord_detail',{ transition: "slide",reverse: false, changeHash:false});
    });

    $('#book_detail').off('click','#btn_book_borrow').on('click', '#btn_book_borrow', function(evt){
        getRequestBook();
    });
    $('#book_detail').off('click','#btn_book_borrow_no').on('click', '#btn_book_borrow_no', function(evt){
        var u = navigator.userAgent, app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
        if(isAndroid){
            var postData = {};
            postData['userName'] = q['user'].userName;
            postData['book_sn'] = bookDetailInfo.book_sn;
            net.post('bookapp/saveReminderNoBook', postData,
                function(error){
                },
                function(response){
                    if (response.code != 0) {
                        dia.alert('Confirmation', response.msg, ['OK'], function(title) {
                        });
                    }
                    else {
                        $("#btn_book_borrow_no").remove();
                        if($("#unvisible_html").size() > 0){
                            $("#unvisible_html").html("Reminder has been set. You will receive a push message once this book becomes as available.");
                        }else{
                            $("#btn_alert_set").show();
                        }
                    }
                },
                {async:false});
        }
        else{
            pushJumpPage.boolAllowPush("",
                function(data){
                    if(data == false){
                        pushJumpPage.alertButtonShow(["Notifications","Push notifications is not allowed by your system settings.Do you want to enable it now?","Not now","Yes"],
                            function(data){
                                if(data == 1){
                                    pushJumpPage.topToSetting("",
                                        function(data){
                                        },
                                        function(error) {
                                        });
                                }
                            },
                            function(error) {
                            });
                    }
                    else{
                        var postData = {};
                        postData['userName'] = q['user'].userName;
                        postData['book_sn'] = bookDetailInfo.book_sn;
                        net.post('bookapp/saveReminderNoBook', postData,
                            function(error){
                            },
                            function(response){
                                if (response.code != 0) {
                                    dia.alert('Confirmation', response.msg, ['OK'], function(title) {
                                    });
                                }
                                else {
                                    $("#btn_book_borrow_no").remove();
                                    if($("#unvisible_html").size() > 0){
                                        $("#unvisible_html").html("Reminder has been set. You will receive a push message once this book becomes as available.");
                                    }else{
                                        $("#btn_alert_set").show();
                                    }
                                }
                            },
                            {async:false});
                    }
                },
                function(error) {
                });
        }

    });
    $('#book_detail_btn_menu').off('click').on('click',function() {

        var title_html = $("#title_book").html();
        if(title_html == "Book²"){

        }else{
            book.showRequestFavBook(bookDetailInfo);
        }
        if(push == false){
            window.shouldPageRefresh.book = false;
        }
        else{
            window.shouldPageRefresh.book = true;
        }
        //$("#book_detail .no_comment").hide();
        // $.mobile.newChangePage('#book',{ transition: "slide",reverse:true,changeHash: false});
        if(page_from == "#myComments"){
            $.mobile.newChangePage(page_from,{ transition: "slide",reverse:true,changeHash: false});
            push = true;
        }else{
            $.mobile.newChangePage('#book',{ transition: "slide",reverse:true,changeHash: false});
        }
        $("#book_detail .add_comment").hide();
    });
    $('#book_detail_content').on('swiperight',function() {
        if(push == false){
            window.shouldPageRefresh.book = false;
        }
        else{
            window.shouldPageRefresh.book = true;
        }
        $.mobile.backChangePage("#book" ,{ transition: "slide",reverse: true,changeHash: false});
    });
    // 展示的时候请求新闻
    $("#book_detail").on( "pagebeforeshow", function() {
        $("#book_detail .news_commentarea").hide();
        $("#book_detail .add_comment").hide();
        disableClickEvent(true);
        window.setBodyOverflow($(document.body));
        $('.comments_praises .praises_desc').css('border-bottom', '0px solid #ccc');
        $('#book_detail_content').css('height',($(window).height()-44-20));
        $('#book_detail_listview').css('min-height',($(window).height()-44-30-30));
        if(page_from == "#myComments"){

        }else{
            var bookId = $("#book_detail_listview").attr("bookid");
            getBookDetailData(bookId);
            getComments(true);
        }
        $("#book_detail .detail_comments_count").html(commentscount);
        if($("#book_detail_listview").hasClass("push")){
            push = true;
            $("#book_detail_listview").removeClass("push");
        }
        if(isLike == true){
            $("#book_detail .praises_desc").find("i").removeClass("praises_icon_no");
        }else{
            $("#book_detail .praises_desc").find("i").addClass("praises_icon_no");
        }
        $("#book_detail .detail_praises_count").html((parseInt(likeAmount) == 0) ? "Like" : parseInt(likeAmount));
    });
    $("#book_detail").on( "pagehide", function( event ) {
        $('.comments_praises .praises_desc').css('border-bottom', '0px solid #ccc');
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
    //获取新闻详情
    var getBookDetailData = function(bookId){
        var postData = {};
        postData['userName'] = q['user'].userName;
        postData['bookId'] = bookId;
        net.post("bookapp/getDetailInfo", postData, function(error){},function(response){
            if (response.code != 0) {
                dia.alert('Confirmation', response.msg, ['OK'], function(title) {
                });
            }
            else {
                var infoObj = response.data.book;
                commentscount = infoObj.commentscount;
                isLike = infoObj.like;
                bookDetailInfo = infoObj;
                likeAmount = infoObj.likeAmount;
                getBookDetail(infoObj);
            }
        },{loading:false,async:false});
    };

    return {
        showDetailWithNew : function (infoObj) {
            getBookDetail(infoObj);
        },
        showCommentsContent: function (bookinfo) {
            getComments(true,bookinfo);
        },
        from : function (from) {
            page_from = from;
        }
    }
});





