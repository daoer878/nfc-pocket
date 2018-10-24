define(function (require) {
    var $ = require('jquery'),
        jqm = require('jquerymobile'),
        net = require('net'),
        dia = require('dialogs'),
        activityRegister = require('activity_register'),
        videodetail = require('videoDetailed'),
        filter = require('filter'),
        questionnaires = require('questionnaires'),
        surveyQuestionnaires = require('survey_questionnaires'),
        surveyConfirm = require('survey_confirm'),
        panle = require('panle'),
        Swiper = require('swiper'),
        myCornerHome = require('myCornerHome'),
        Club=require('club'),
        activitySurvey=require('activity_survey');


    // Nick added for pull to refresh end
    // 查询到的新闻数据
    var v_news = [];
    var newsList;
    //发的第几次请求
    var totalNum = 0;

    // 当前页数
    var currentPageNumer = 1;

    // 控制底部事件激发开关 0表示开 非0表示关闭时间F
    var scrollButtomOn = 0;

    // Nick added for pull to refresh start
    var isScrolling = false,
        showeye = "false",
        iScroll_news = {
            myScroll: null,
            allowGetMore: true,
            pullDownAction: function() {
                getNews(true);
            },
            pullUpAction: function() {
                getNews();
            },
            loaded: function(wrapper) {
                var $wrapper = $("#" + wrapper),
                    $pullDownEl = $wrapper.find("#pullDown"),
                    $pullDownLabel = $pullDownEl.find(".pullDownLabel"),
                    pullDownOffset = $pullDownEl[0].offsetHeight,
                    $pullUpEl = $wrapper.find("#pullUp"),
                    $pullUpLabel = $pullUpEl.find(".pullUpLabel"),
                    $pullUpIcon = $pullUpEl.find(".pullUpIcon"),
                    pullUpOffset = $pullUpEl[0].offsetHeight;

                iScroll_news.myScroll = new iScroll(wrapper, {
                    hScrollbar: false,
                    vScrollbar: false,
                    fixedScrollbar: true,
                    useTransition:false,
                    checkDOMChanges:false,
                    topOffset: pullDownOffset,
                    onRefresh: function () {
                        console.log("onRefresh");
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
                            }
                        }
                    },
                    onScrollMove: function () {
                        if(this.y >= -50){
                            $('div[id=newsroom_top]').fadeOut();
                        }
                        else{
                            $('div[id=newsroom_top]').fadeIn();
                        }
                        if (this.y > 5 && !$pullDownEl.hasClass("flip")) {
                            $pullDownEl.addClass("flip");
                            $pullDownLabel.text("Release to refresh...");
                            this.minScrollY = 0;
                            $pullDownEl.css("margin-top","10px");
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
                            $pullDownEl.css("margin-top","10px");
                        } else if ($pullUpEl.hasClass("flip")) {
                            if (iScroll_news.allowGetMore) {
                                iScroll_news.allowGetMore = false;
                                $pullUpEl.attr("class", "loading");
                                $pullUpLabel.text("Loading...");
                                iScroll_news.pullUpAction();
                            }
                        } else{
                            $pullDownEl.css("margin-top","0px");
                        }
                        setTimeout(function() {
                            isScrolling = false;
                            if(iScroll_news.myScroll){
                                iScroll_news.myScroll.refresh();
                            }
                        }, 500);
                    }
                });
            }
        };

    var mySwiper = new Swiper('.news-swiper-main',{
        initialSlide:0,
        speed: 200,
        direction: 'horizontal',
        autoHeight: true,
        observer:true,
        observeParents:true,
        followFinger: false,
        resistanceRatio: 0,
        touchAngle: 20,
        preventClicks:true,
        preventClicksPropagation:true,
        slideToClickedSlide:true,
        touchMoveStopPropagation: true, // true 阻止Swiper touchMove事件冒泡至上层iScroll
        onSlideChangeStart:function(swiper){
            var sIndex = swiper.activeIndex;
            if(sIndex == "0"){
                //2017.11.03 by leisong
                //$('#news_btn').addClass('news_hel');
                //$('#activity_btn').removeClass('news_hel');
                if($('#newsroom_header_cancel').is(":visible")){
                    initPageLoading("news_wrapper");
                    getNews(true);
                }else{
                    showContent(v_news,true);
                }
            }
        },
        onTap:function(swiper,e){
            var target = e.target || e.srcElement,
                $li = null,
                $respond = null;

            if(target.nodeName.toLowerCase() === 'li'){
                $li = $(target);
            } else {
                $li = $(target).parents('li');

                if(target.id === 'newsroom_nowRegister'){
                    $respond = $(target);
                } else {
                    $respond = $(target).parents('#newsroom_nowRegister');
                }
            }

            if($li.length <= 0){
                return false;
            }

            if($(target).parents('#news_wrapper').length > 0){
                // 点击news
                if (v_news[$li.index()].types == 'new') {
                    alert("你点击了news")
                    //v_news[$li.index()].showeye = showeye;
                    //toDetailPage(v_news[$li.index()]);
                }
            }
        }
    });


    // 补充0
    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    /**
     * 展示过滤按钮样子
     */
    function displayFilter() {
        var tagFilter = localStorage.getItem('tagFilter'),
            countryFilter = localStorage.getItem('countryFilter');

        if (((!$.isEmptyObject(tagFilter)) && tagFilter !== 'All') || ((!$.isEmptyObject(countryFilter)) && countryFilter !== 'All')) {
            $('#newsroom_btn_filter').removeClass('filter').addClass('filterOn');
        } else {
            $('#newsroom_btn_filter').removeClass('filterOn').addClass('filter');
        }

    }

    /**
     * 禁用滚动时间3秒
     */
    function disableScrollBottom() {
        scrollButtomOn = 3;
        var timer = setInterval(function() {
            if (scrollButtomOn == 0) {
                clearInterval(timer);
                return;
            }

            scrollButtomOn--;

        }, 1000);
    }

    function TagtoLit(tag) {
        if (tag == 'Center Operations')
            return 'OPS';
        else if (tag == 'Technical Development')
            return 'TD';
        else if (tag == 'Q&P')
            return 'Q&P';
        else if (tag == 'Human Resources')
            return 'HR';
        else if (tag == 'Trade Union')
            return 'GTU';
        else if (tag == 'Finance')
            return 'FIN';
        else if (tag == 'Corporate Sustainability')
            return 'CS';
        else if (tag == 'Communications')
            return 'COMMS';
        else if (tag == 'Talent Show')
            return 'TS';
        else if (tag == 'NOW')
            return 'NOW';
        else if (tag == '#red')
            return '#red';
        else if (tag == 'GSC')
            return 'GSC';
        else if (tag == 'Annual Party')
            return 'AP';
        else {
            console.assert(false, '标签 %o 不存在 ', tag );
        }
    }

    /**
     * 展示内容
     * @param content
     */
    function showContent(contentList, refresh) {
        var contentHTML;
        var contentArray = [],
            contentEventArray = [],
            $newsroom_listview = $("#newsroom_listview_news");
        $.each(contentList, function(i, content) {
            console.assert(content.types != null, '要展示的内容都没有类型啊');

            if (content.types == 'new') {
                contentEventArray.push(getNewsHTML(content));
                if (content.type == 'news') {
                    contentArray.push(getNewsHTML(content));
                }
                else if (content.type == 'video') {
                    contentArray.push(getVideoHTML(content));
                    //contentEventArray.push(getVideoHTML(content));
                }
            } else {
                console.assert(false, '除了新闻和活动，目前不会有%s类型。', content.types);
            }
        });
        contentHTML = contentArray.join("");
        if (refresh) {
            $newsroom_listview.html(contentHTML);
        } else {
            $newsroom_listview.append(contentHTML);
        }
        $newsroom_listview.listview("refresh");
    }
    // Nick added for pull to refresh end

    /**
     * 获得新闻HTML
     * @param news
     */
    function getNewsHTML(news) {
        news.TTagses.sort(function(a, b) {

            if (TagtoLit(a.name) > TagtoLit(b.name))
                return 1;
            else if (TagtoLit(a.name) < TagtoLit(b.name))
                return -1;

            return 0;
        });

        var date = new Date(news.approvalTime * 1000);
        var month = getMonthString(date.getMonth());
        var time = 'Posted on ' + date.getDate() + " " + month + " " + date.getFullYear();
        var eye = news.allBrowseTimes ? news.allBrowseTimes : 0;
        var like = news.like;
        var prise = news.likeAmount ? news.likeAmount : 0;
        var li = createNews(news.pic, news.title, news.briefContent, time, news.TTagses,eye,prise,like,news.newsId,news.videoFlag);
        // Nick removed for pull to refresh start
        // $('#newsroom_listview_news').append(li);
        // $('#newsroom_listview_news').listview( "refresh" );
        // Nick removed for pull to refresh end
        // Nick added for pull to refresh start
        return li;
        // Nick added for pull to refresh end
    }
    /**
     * 获得视频HTML
     * @param news
     */
    function getVideoHTML(video) {
        video.TTagses.sort(function(a, b) {

            if (TagtoLit(a.name) > TagtoLit(b.name))
                return 1;
            else if (TagtoLit(a.name) < TagtoLit(b.name))
                return -1;

            return 0;
        });
        var li = createVideo(video);
        return li;
    }
    function createVideo(video) {
        var videoimg = video.pic;
        var title = video.title;
        var briefContent = video.briefContent;
        var tags = video.TTagses;
        var eye = video.allBrowseTimes ? video.allBrowseTimes : 0;
        var like = video.like;
        var prise = video.likeAmount ? video.likeAmount : 0;
        var approvalTime = video.approvalTime;
        var videoFlag = video.videoFlag;
        var date = new Date(approvalTime * 1000);
        var month = getMonthString(date.getMonth());
        var time = 'Posted on ' + date.getDate() + " " + month + " " + date.getFullYear();
        if (briefContent.length > 160){
            briefContent = briefContent.substring(0, 160) + '...';
        }
        var html_tags = getTags(tags);
        if (html_tags.length == 0) {
            html_tags = '\<span style="height: 35px;"> &nbsp;</span>';
        }
        var likeAttr = (video.like==true) ? 'yes' :'no';
        var likeit = "no";
        var eyehtml = "";
        if(showeye == "true"){
            eyehtml ='\<span style="margin-left:10px "><i class="eyeicon"></i><span class="eye_pagetag" >'+eye+'\</span></span>';
        }
        var imgHtml = '\<div style="width: 100%" ><img src="'+videoimg+'"\ style="width: 100%" alt=""/></div>';
        if(videoFlag  == "video"){
            imgHtml = '\<div style="width: 100%;position:relative;"><i class="videotag_icon"></i><img src="'+videoimg+'"\ style="width: 100%;"  alt=""/>\ </div>';
        }
        var html = '\<li  style="border: 0px;padding: 0px;margin-bottom:10px" like="'+likeAttr+'" id="'+video.newsId+'"\>' +
            imgHtml+'\<label style="margin: 10px; font-size: 18px; white-space:normal;color: #404040;word-break: break-word;">'+title+'\</label>\
            <div style="margin: 10px">\
                <div style="white-space:normal;font-weight: normal;font-size: 12px;color: #404040;word-break: break-word;">'+briefContent.replace(/\n/g,'</br>')+'\</div>\
            </div>\
            <div style="margin: 0px 10px 0px 10px; height: 40px; line-height: 40px;">\
                <span style="font-size: 10px;color: #808080;white-space: normal;">'+time+'\</span>\
            \<div style="float:right;font-size: 10px;color: #808080;">'+eyehtml+'\<span style="margin-left:10px; ">\
            <i class="'+((likeit == "no")?"index_prise_no prise":"index_prise prise")+'"\></i><span class="prise_pagetag">'+prise+'\</span></span></div>\
            </div><div style="border-bottom: solid 1px;border-bottom-color: #C0C0C0;width: 100%;"></div>\
            <div style="margin-left: 10px; width: auto;white-space: normal;">\
            '+html_tags+'\
            \</div>\
            <div style="clear:left; width: 100%;height:10px;"></div>\
        </li>';
        return html;
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
    function getTags(tags){
        var html_tags = "";
        if (tags != null) {
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
                if (val.name == 'Talent Show')
                    html_tags += '\<span class="spanTag" style="background-color: #a3bdad;">TALENT SHOW</span>  ';
                if (val.name == 'NOW')
                    html_tags += '\<span class="spanTag" style="background-color: #db0011;">NOW</span>  ';
                if (val.name == '#red')
                    html_tags += '\<span class="spanTag" style="background-color: #f26647;">#red</span>  ';
                if (val.name == 'GSC')
                    html_tags += '\<span class="spanTag" style="background-color: #e6b012;">GSC</span>  ';
                if (val.name == 'Annual Party')
                    html_tags += '\<span class="spanTag" style="background-color: #e6b012;">AP</span>  ';
            });
        }
        return html_tags;


    }
    // 获得新闻
    function getNews(refresh,pageStatus) {
        if(pageStatus){
            pageInitShow();
            tagInitShow();
        }
        if (refresh) {
            currentPageNumer = 1;
            v_news = [];
        }
        // Nick added for pull to refresh end
        var postData = {};
        postData['pager.pageNo'] = currentPageNumer;
        postData['pager.pageSize'] = 5;
        postData['type'] = "news";
        postData['userId'] = '8C947AEFEDDDFA44810335D1AE9D6DD2';
        var filterSize = $("#newsFilter_ul li").size();
        if(filterSize > 0){
            filterSize = parseInt(filterSize);
        }
        else {
            filterSize = 0;
        }
        var tagFilter = localStorage.getItem('tagFilter'),
            countryFilter = localStorage.getItem('countryFilter');
        if (!$.isEmptyObject(tagFilter) && tagFilter !== 'All') {
            postData['tagNames'] = tagFilter;
        }
        if (!$.isEmptyObject(countryFilter) && countryFilter !== 'All') {
            postData['areaId'] = countryFilter;
        }
        // 获取新闻
        var command = "news/queryList";
        if ((!$.isEmptyObject($('#newsroom_header_searchbar')))
            && (!$.isEmptyObject($('#newsroom_header_searchbar').val()))){
            postData['keyword'] = $('#newsroom_header_searchbar').val();
        }
        //if($("#newsroom").hasClass("talentShow")){
        //    postData['tagNames'] = "Talent Show";
        //}
        //else if($("#newsroom").hasClass("video")){
        //    postData['type'] = "hbcnNow";
        //}
        //else if($("#newsroom").hasClass("newsroom")){
        //    postData['type'] = "newsroom";
        //}


        totalNum++;
        net.post(command, postData, function(error){
        }, function(response){
            if (response.code != 0) {

            } else {
                console.info('<===============newroom.js=response:' + totalNum + '===============>');
                $("#pullUp").css("marginTop",0);
                newsList = response.data.news;
                var newsListLength = newsList.length;
                if (newsListLength > 0) {
                   v_news = v_news.concat(newsList);
                    showContent(newsList, refresh);
                    currentPageNumer++;
                }else{
                    if(refresh){
                        $("#newsroom_listview_news").html("");
                    }else{
                        $("#newsroom_listview_news").append("");
                    }
                }
                if (iScroll_news.myScroll == null) {
                    iScroll_news.loaded("news_wrapper");
                }
                // Nick added for pull to refresh start
                var $pullUpEl = $("#news_wrapper").find("#pullUp"),
                    $pullUpLabel = $pullUpEl.find(".pullUpLabel"),
                    $pullUpIcon = $pullUpEl.find(".pullUpIcon");
                if (refresh) {
                    if(newsListLength == 1){
                        $pullUpIcon.hide();
                        $pullUpLabel.text("No more articles available!");
                    }else if(newsListLength == 0){
                        $pullUpIcon.hide();
                        $pullUpEl.hide();
                      // $("#pullUp").css("marginTop",75);
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
                if (newsListLength < 1) {
                    iScroll_news.allowGetMore = false;
                } else {
                    iScroll_news.allowGetMore = true;
                }
                setTimeout(function() {
                    if(iScroll_news.myScroll){
                        iScroll_news.myScroll.refresh();
                    }
                    if(newsListLength == 0){
                        $pullUpEl.show();
                        $pullUpIcon.hide();
                        $pullUpLabel.text("No more articles available!");
                    }
                    disableClickEvent(false);
                }, 800);
                window.shouldPageRefresh.newsroom = false;
            }
        },{loading:false});
    }

    // 创建新闻
    function createNews(img, title, content, timestamp, tags,eye,prise,like,id,videoFlag) {
        var newContent = content;
        if (newContent.length > 160)
            newContent = content.substring(0, 160) + '...';


        var html_tags = '';

        if (tags != null) {
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
                if (val.name == 'Talent Show')
                    html_tags += '\<span class="spanTag" style="background-color: #a3bdad;">TALENT SHOW</span>  ';
                if (val.name == 'NOW')
                    html_tags += '\<span class="spanTag" style="background-color: #db0011;">NOW</span>  ';
                if (val.name == '#red')
                    html_tags += '\<span class="spanTag" style="background-color: #f26647;">#red</span>  ';
                if (val.name == 'GSC')
                    html_tags += '\<span class="spanTag" style="background-color: #e6b012;">GSC</span>  ';
                if (val.name == 'Annual Party')
                    html_tags += '\<span class="spanTag" style="background-color: rgb(76, 176, 170);">AP</span>  ';
            });
        }

        if (html_tags.length == 0) {
            html_tags = '\<span style="height: 35px;"> &nbsp; </span>';
        }
        var likeAttr = (like==true) ? 'yes' :'no';
        var likeit = "no";
        var eyehtml = "";
        if(showeye == "true"){
            eyehtml ='\<span style="margin-left:10px "><i class="eyeicon"></i><span class="eye_pagetag" >'+eye+'\</span></span>';
        }
        var imgHtml = '\<div style="width: 100%" ><img src="'+img+'"\ style="width: 100%" alt=""/></div>';
        if(videoFlag  == "video"){
            imgHtml = '\<div style="width: 100%;position:relative;"><i class="videotag_icon"></i><img src="'+img+'"\ style="width: 100%;"  alt=""/>\ </div>';
        }
        var html = '\<li  style="border: 0px;padding: 0px;margin-bottom:10px" like="'+likeAttr+'" id="'+id+'"\>' +
            imgHtml+'\<label style="margin: 10px; font-size: 18px; white-space:normal;color: #404040;word-break: break-word;">'+title+'\</label>\
            <div style="margin: 10px">\
                <div style="white-space:normal;font-weight: normal;font-size: 12px;color: #404040;word-break: break-word;">'+newContent.replace(/\n/g,'</br>')+'\</div>\
            </div>\
            <div style="margin: 0px 10px 0px 10px; height: 40px; line-height: 40px;">\
                <span style="font-size: 10px;color: #808080;white-space: normal;">'+timestamp+'\</span>\
            \<div style="float:right;font-size: 10px;color: #808080;">'+eyehtml+'\<span style="margin-left:10px; ">\
            <i class="'+((likeit == "no")?"index_prise_no prise":"index_prise prise")+'"\></i><span class="prise_pagetag">'+prise+'\</span></span></div></div>\
            <div style="border-bottom: solid 1px;border-bottom-color: #C0C0C0;width: 100%;"></div>\
            <div style="margin-left: 10px; width: auto;white-space: normal;">\
            '+html_tags+'\
            \</div>\
            <div style="clear:left; width: 100%;height:10px;"></div>\
        </li>';

        return html;
    }
    //推出Tilter页面
    $('#newsroom_btn_filters').on('click',function() {
        $('.entrance-content').hide();
        if($("#filter_btn_applay").attr("filterResourcePage") == "video"){
            localStorage['selected_tags']='';
        }
        $('#filter_btn_applay').attr("filterResourcePage",'newsroom');
        if($('#activity_btn').hasClass("news_hel")){
            $('#filter_btn_applay').attr("filterResourceWrapper",'act_wrapper');
            $('#newsroom').attr("pageCont",'activities');
        }else if($('#event_btn').hasClass("news_hel")){
            $('#filter_btn_applay').attr("filterResourceWrapper",'event_wrapper');
            $('#newsroom').attr("pageCont",'video');
        }else{
            $('#filter_btn_applay').attr("filterResourceWrapper",'news_wrapper');
            $('#newsroom').attr("pageCont",'newsroom');
        }
        $.mobile.newChangePage("#filter",{ transition: "slide",reverse: false,changeHash: false});
    });

    $("#newsroom").on( "pagehide", function() {
        $('.entrance-content').hide();
    });
    $('#news_content').on('tap',function(e){
        e.stopPropagation();
        $('.entrance-content').hide();
    });
    $("#newsroom").on( "pagebeforeshow", function() {
        $('#news_footer li').removeClass('on').first().addClass('on');
        // 隐藏搜索,展示菜单和过滤
        if($('#newsroom_header_searchbar').val() == ''){
            $('#newsroom_header_search').hide();
            $('#newsroom_header_title, #newsroom_discovery, #newsroom_header_buttons').show();
        }

        $('#newsroom_listview_news').attr("flag","true");
        $('.news-swiper-main').removeClass('ui-listview');
        // #news_wrapper 高度为屏幕高度减去其他内容的高度108（44+44+20）
        $('#news_wrapper').css('height',($(window).height()-108));
        /*if($('#news_btn').hasClass("news_hel")){
            $("#newsroom").attr("pageCont","newsroom");
        }else if($('#activity_btn').hasClass("news_hel")){
            $("#newsroom").attr("pageCont","activities");
        }else if($('#event_btn').hasClass("news_hel")){
            $("#newsroom").attr("pageCont","video");
        }*/
        if (window.shouldPageRefresh.newsroom) {
            $("#newsroom_listview_news").empty();
        }
        var postData = {};
        var pageCont = $("#newsroom").attr("pageCont");
        if(pageCont == "newsroom"){
            postData['paramKey'] = "news";
        }

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
    var toDetailPage = function(data){
        $("#video_detailed").page();
        var pageId = $("#newsroom").attr("pageId");
        $('#video_detailed_listview').empty();
        $('#video_listview_comments').empty();
        videodetail.from('#newsroom');
        data.pageId = pageId;
        videodetail.showDetailWithNew(data);
        videodetail.showCommentsContent();
        initPageLoading("wrapper_comments");
        $.mobile.newChangePage("#video_detailed",{ transition: "slide",reverse: false,changeHash: false});
    }
    // 展示的时候请求新闻
    var getTagName = function(tagname){
        var html_tags = "";
        if (tagname == 'Communications')
            html_tags = '\<div class="filter_tags" style="background-color: rgb(77, 134, 176);">COMMS</div>';
        if (tagname == 'Corporate Sustainability')
            html_tags = '\<div class="filter_tags" style="background-color: rgb(137, 217, 78);">CS</div>';
        if (tagname == 'Finance')
            html_tags = '\<div class="filter_tags" style="background-color: rgb(219, 218, 0);">FIN</div>';
        if (tagname == 'Trade Union')
            html_tags = '\<div class="filter_tags" style="background-color: rgb(147, 182, 164);">GTU</div>';
        if (tagname == 'Human Resources')
            html_tags = '\<div class="filter_tags" style="background-color: rgb(230, 170, 0);">HR</div>';
        if (tagname == 'Q&P')
            html_tags = '\<div class="filter_tags" style="background-color: rgb(76, 176, 170);">Q&P</div>';
        if (tagname == 'Center Operations')
            html_tags = '\<div class="filter_tags" style="background-color: rgb(138, 116, 122)">OPS</div>';
        if (tagname == 'Technical Development')
            html_tags = '\<div class="filter_tags" style="background-color: rgb(121, 110, 172);">TD</div>';
        if (tagname == 'NOW')
            html_tags = '\<div class="filter_tags" style="background-color: #db0011;">NOW</div>';
        if (tagname == 'Talent Show')
            html_tags = '\<div class="filter_tags" style="background-color: #a3bdad;">TALENT SHOW</div>';
        if (tagname == '#red')
            html_tags = '\<div class="filter_tags" style="background-color: #f26647;">#red</div>';
        if (tagname == 'GSC')
            html_tags += '\<div class="filter_tags" style="background-color: #e6b012;">GSC</div>  ';
        if (tagname == 'Annual Party')
            html_tags += '\<div class="filter_tags" style="background-color: #e6b012;">AP</div>  ';
        return html_tags;
    }
    var getFiterInfo = function(filterList){
        var filterArr = [];
        $.each(filterList,function(index,filterInfo){

            var filterHtml = '\<li data-selectTag="'+ filterInfo.name +'" class="ui-li-static ui-body-inherit"><div class="ui-grid-b">\
            <div class="ui-block-a" style="width: 17%;height: auto;margin-top: 13px;overflow: auto">\
            '+getTagName(filterInfo.name)+'\</div><div class="ui-block-b" style="width: 70%;height: auto;margin: auto;">\
            <div style="font-family: Arial;font-size: 14px;margin-left: 10px">'+filterInfo.name+'\</div></div><div class="ui-block-c fRight" style="width: 13%;height: auto;margin-top: 0px;">\
            <i class="checkbox"></i></div></div></li>';
            filterArr.push(filterHtml);
        });
        $("#tag-listview").html('\<li data-selectTag="all" class="selectAll" class="selectAll ui-li-static ui-body-inherit" style="padding: 0px;height: 40px;"><div class="ui-grid-a" style="height: 40px;line-height: 40px">' +
            '\<div class="ui-block-a" style="font-family: Arial;font-size: 14px;width: 87%;height: auto;margin: auto;padding-left: 18%">All' +
            '\</div><div class="ui-block-b" style="width: 13%;height: auto;margin-top: 0px;"><i class="checkbox"></i>' +
            '\</div></div></div></li>'+filterArr.join(""));
    };

    function pageInitShow(){
        if($("#newsroom").hasClass("newsroom")){
            $("#newsroom_header_title").html("Newsroom");
            //$("#activities_calendar").hide();
            $("#newsroom_btn_filter").show();
            $("#new_search").show();
        }
    }
    function tagInitShow(){
        var postData = {};
        postData['userId'] = "8C947AEFEDDDFA44810335D1AE9D6DD2";

        // 获取tag
        net.post('user/getTagsByDeptId', postData, function (error) {
            },
            function (response) {
                if (response.code != 0) {
                }
                else {
                    getFiterInfo(response.data.list);
                }
            },{loading:false});

        // 获取国家
        net.post('hotline/getCountries', postData, function(error){

        },function(response){
            if(response.code != 0){

            }else{
                var country_list = response.data.countries;
                var country_html = '<li data-selectCountry="all" class="selectAll ui-li-static ui-body-inherit"><p>All</p><i class="checkbox"></i></li>';

                $.each(country_list, function(index,val){
                    /*country_html += '<li class="country-list"><dl><dt id="'+val.id+'" data-countryId="'+ val.id +'">'+ val.name +'</dt></dl></li>';*/
                    country_html += '<li class="ui-li-static ui-body-inherit" data-selectCountry="'+ val.id +'"><p>'+ val.name +'</p><i class="checkbox"></i></li>';
                });

                $("#country-listview").html(country_html);
            }
        });

        localStorage['selected_tags']='';
        $('#newsroom_btn_filter').removeClass('filterOn').addClass('filter');
    }


    $("#newsroom").on( "pageshow", function( event ) {
        disableClickEvent(true);
        window.setBodyOverflow($(document.body));
        $('#news_footer').show();
        $('#news_content').css('height',($(window).height()-44-44-20));
        $('#news_content_info').css('height',($(window).height()-44-44-10));
        $('#filter_content').css('height',($(window).height()-44-44));
        displayFilter();
        if (window.shouldPageRefresh.newsroom) {
            newsMsgShow();
            if($("#newsFilter_ul li").size() == 0){
                tagInitShow();
            }
            displayFilter();
        }
        window.historyView = [];

    });
    $("#newsroom").on( "pagehide", function( event ) {
        $('#news_footer').hide();
    });

    function stopEventPropagation(event) {
        event.stopPropagation();
    }

    function initPageLoading(wrapper) {
        var $wrapper = $("#" + wrapper),
            $pullDownEl = $wrapper.find("#pullDown"),
            $pullUpEl = $wrapper.find("#pullUp");
        $pullUpEl.hide();
        var $pullDownLabel = $pullDownEl.find(".pullDownLabel");
        $wrapper.find(".scroller").css(window.getVendorStyle("transform"), "translate(0, 0)");
        $pullDownEl.css("margin-top","10px").attr("class", "loading");
        $pullDownLabel.text("Loading...");
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
    //新闻搜索
    $('#new_search').off('click').on('click', function() {
        // 隐藏菜单和过滤，展示搜索
        $('#newsroom_header_title,.entrance-content,#newsroom_header_entrance').hide();
        $('#newsroom_header_search').show();
        $('#newsroom_header_searchbar').focus();
    });

    $('#newsroom_header_cancel').off('click').on('click', function() {
        $('#newsroom_header_searchbar').val('');
        $('#newsroom_header_search').hide();
        $('#newsroom_header_title,#newsroom_header_entrance').show();
        newsMsgShow();
    });

    $('#newsroom_header_searchbar').off('keyup').on('keyup', function(evt) {
        if (evt.keyCode == 13) {
            $('#newsroom_header_searchbar').blur();
            newsMsgShow();
        }
    });

    function newsMsgShow(){
        initPageLoading("news_wrapper");
        getNews(true);
    }

    $('#newsroom_header_entrance').on('tap',function(){
        $('.entrance-content').toggle();
    });


    function compatibility() {
        /* Logon */
        $('#newsroom_header_title').parent().css({
            'display': 'block',
            'postion': 'relative'
        });

        $('#newsroom_header_title').css({
            'postion': 'absulute',
            'width': '180px',
            'height':'20px',
            'margin': '8px auto auto auto'
        });
    }

    $(document).ready(function() {
        // 兼容其他浏览器
        compatibility();

        $('div[id=newsroom_top]').on('click',function() {
            $('div[id=newsroom_top]').fadeOut();
            $("#news_wrapper").find(".scroller").css("-webkit-transform", "translate(0px, -50px)");
        });
    });
    return {
        templateNews : function() {
            getNews(true, 'pageInit');
        }
    }
});
