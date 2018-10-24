/**
 * init  hotClub  banner  and clubItems
 * @Param {String} param
 * @Returns {List<club>}
 * @Author bruce
 *@Date 07/21/17.
 */
define(function (require) {
    var $ = require('jquery'),
        jqm = require('jquerymobile'),
        net = require('net'),
        dialogs = require('dialogs'),
        config = require('config'),
        Swiper = require('swiper'),
        mustache = require('mustache'),
        text = require('text'),
        utils = require('utils'),
        activeSurvey = require('./activity_survey'),
        activityList = require('./activity_list'),
        activityDetails = require('./activity_details'),
        myActivity = require('./my_activities'),
        iscroll = require('../libs/iscroll-4.2.5/iscroll'),
        club_firstBanner = require('text!club_firstBanner'),
        club_secondBanner = require('text!club_secondBanner'),
        club_activeList = require('text!club_activeList');



    function initPageLoading(wrapper) {
        var $wrapper = $('#' + wrapper),
            $pullDownEl = $wrapper.find('.js-pullDown'),
            $pullUpEl = $wrapper.find('.js-pullUp');
        $pullUpEl.hide();
        var $pullDownLabel = $pullDownEl.find('.pullDownLabel');
        $wrapper.find('.scroller').css(window.getVendorStyle('transform'), 'translate(0, 0)');
        $pullDownEl.addClass('loading');
        $pullDownLabel.text('Loading...');
    }

    var Club = {
        currentPageNumer: 1,
        bannerFlagConfig : true,
        tempPostData :null,
        initEvents:function(){


            //发请求的后部分url
            // 兼容其他浏览器
            $('#club_top').on('click',function() {
                $('#club_top').fadeOut();
                $('#club_content_wrapper').find('.scroller').css({'-webkit-transform': 'translate(0, -68px)', 'transform': 'translate(0, -68px)'});
            });
            $("#club").on("pagebeforeshow", function(event) {

                if (window.shouldPageRefresh.clubActivity) {
                    Club.getAllActiveTypes();
                    Club.ongoingActive('openPageFlag');
                    // initPageLoading('club_content_wrapper');
                    Club.iScrollRefresh.allowGetMore = true;
                    setTimeout(function() {
                        if(Club.iScrollRefresh.myScroll){
                            Club.iScrollRefresh.myScroll.refresh();
                        }
                    }, 800);
                    $('#club_content_wrapper').find('.scroller').css({'-webkit-transform': 'translate(0, -50px)', 'transform': 'translate(0, -50px)'});
                }
                if(Club.bannerFlagConfig == true){
                    Club.getTopActive();
                }
                $('#news_footer').hide();
                //$(".clubItems_listview_li .ongoingActive").html('');
                if(Club.iScrollRefresh.myScroll === null){
                    Club.iScrollRefresh.loaded('club_content_wrapper');
                }
            });
            $('.js-activityList').off('tap').on('tap', 'dl', function (event) {
                if(Club.iScrollRefresh.myScroll.isReady()&&!$(this).hasClass('survey')){
                    var $target = '',
                        pagefrom = '',
                        url = net.url_base + 'activity/getActiveById',
                        param = {};
                    if (event.target.tagName === 'DL') {
                        $target = $(event.target);
                    } else {
                        $target = $(event.target).closest('DL');
                    }
                    pagefrom = $(event.target).closest('[data-role="page"]').prop('id');
                    param.activityId = $target.data('activityid');
                    param['userId'] = q['user'].userId;

                    $.ajax(url, {
                        'type': 'post',
                        'data': param,
                        'beforeSend': function () {
                            $('#ajaxLoading').show();
                        }
                    }).done(function (response) {
                        if (response.code === 0) {
                            window.shouldPageRefresh.clubActivity = false;
                            activityDetails.load.init(response, pagefrom);
                            $.mobile.changePage("#clubActiveDetails", {transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
                        } else {
                            dialogs.alert('Oops', 'Sorry, request was aborted', ['Ok'], function () {

                            });
                        }
                    }).fail(function (xhr, stateText) {
                        dialogs.alert('Oops', stateText, ['Ok'], function () {

                        });
                    }).always(function () {
                        $('#ajaxLoading').hide();
                    });
                }else{
                    var surveyId = $(this).attr('data-surveyid');
                    activeSurvey.ActiveSurvey.getSurveyNewsDetailbyId(surveyId);
                }
            });
            $("#clubPage_back_btn").on('click', function(){
                Club.currentPageBackEvent();
            });
            $('.js-lastActive').off('touchend').on('touchend', function (event) {
                event.preventDefault();
                if (Club.iScrollRefresh.myScroll.isReady()) {
                    activityList.load.init('#club', 'activity/lastActive', 'Past Activity');
                    window.shouldPageRefresh.clubActivity = true;
                    $("#activityListSurvey").hide();
                    $("#activityList").show();
                    $.mobile.changePage("#lastActive", {transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
                }
            });
            $('#club_me_btn').off('touchend').on('touchend', function (event) {
                event.preventDefault();
                if (Club.iScrollRefresh.myScroll.isReady()) {
                    myActivity.load.init();
                    window.shouldPageRefresh.clubActivity = true;
                    $.mobile.changePage("#club_mine", {transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
                }
            });

            //设置内容高度是Header剩下的高度
            $("#club").off('pageshow').on("pageshow", function(event) {
                $('#club').css('height', '100%');
                window.setBodyOverflow($(document.body));
                var $top = $(".club_items").offset().top - 64;
                var club_items_height = $(".club_items").outerHeight();
            });

        },
        iScrollRefresh : {
            myScroll: null,
            allowGetMore: true,
            pullDownAction: function() {
                Club.ongoingActive('openPageFlag');
                //console.log(666);
                // setTimeout(function() {
                //     if(Club.iScrollRefresh.myScroll){
                //         Club.iScrollRefresh.myScroll.refresh();
                //     }
                // }, 800);
            },
            pullUpAction: function() {
                //上拉动作标记
                Club.ongoingActive("pullUpFlag");
            },
            loaded: function(wrapper) {
                $wrapper = $('#' + wrapper),
                    $pullDownEl = $wrapper.find('.js-pullDown'),
                    $pullDownLabel = $pullDownEl.find('.pullDownLabel'),
                    pullDownOffset = 68,
                    $pullUpEl = $wrapper.find('.js-pullUp'),
                    $pullUpLabel = $pullUpEl.find('.pullUpLabel'),
                    $pullUpIcon = $pullUpEl.find('.pullUpIcon'),
                    pullUpOffset = 50;
                Club.iScrollRefresh.myScroll = new iScroll(wrapper, {
                    hScrollbar: false,
                    vScrollbar: false,
                    fixedScrollbar: true,
                    useTransition: false,
                    checkDOMChanges: false,
                    topOffset: 68,
                    onRefresh: function () {
                        // console.log('onRefresh');
                        if ($pullDownEl.hasClass('loading')) {
                            $pullDownEl.removeClass('loading');
                            $pullDownLabel.text('Pull down to refresh...');
                        }
                        if ($pullUpEl.hasClass('loading')) {
                            $pullUpEl.removeClass('loading');
                            if (Club.iScrollRefresh.allowGetMore) {
                                $pullUpIcon.show();
                                $pullUpLabel.text('Pull up to load more...');
                            } else {
                                $pullUpIcon.hide();
                                $pullUpLabel.text('No more articles available!');
                            }
                        }
                    },
                    onScrollMove: function () {
                        console.log(this.y + ": y=====scrollY :" + this.maxScrollY);
                        if (this.y >= -70){
                            $('#club_top').fadeOut();
                        } else {
                            $('#club_top').fadeIn();
                        }
                        if (this.y > 5 && !$pullDownEl.hasClass('flip')) {
                            $pullDownEl.addClass('flip');
                            $pullDownLabel.text('Release to refresh...');
                            this.minScrollY = 0;
                        } else if (this.y < 5 && $pullDownEl.hasClass('flip')) {
                            $pullDownEl.removeClass('flip');
                            $pullDownLabel.text('Pull down to refresh...');
                            this.minScrollY = -pullDownOffset;
                        } else if (this.y < (this.maxScrollY - 5) && !$pullUpEl.hasClass('flip')) {
                            if (Club.iScrollRefresh.allowGetMore) {
                                $pullUpEl.addClass('flip');
                                $pullUpLabel.text('Release to load more...');
                                this.maxScrollY = this.maxScrollY;
                                $pullUpEl.show();
                                $pullUpIcon.show();
                            }
                        } else if (this.y > (this.maxScrollY + 5) && $pullUpEl.hasClass('flip')) {
                            if (Club.iScrollRefresh.allowGetMore) {
                                $pullUpEl.removeClass('flip');
                                $pullUpLabel.text('Pull up to load more...');
                                this.maxScrollY = pullUpOffset;
                                $pullUpEl.show();
                                $pullUpIcon.hide();
                            }
                        }
                    },
                    onScrollEnd: function () {
                        // console.log('onScrollEnd: '+this.y);
                        if (this.y >= -70) {
                            $('#club_top').fadeOut();
                        } else {
                            $('#club_top').fadeIn();
                        }
                        if ($pullDownEl.hasClass('flip')) {
                            $pullDownEl.removeClass('flip').addClass('loading');
                            $pullDownLabel.text('Loading...');
                            Club.iScrollRefresh.pullDownAction(true);
                            window.event.preventDefault();
                        }
                        if ($pullUpEl.hasClass('flip')) {
                            if (Club.iScrollRefresh.allowGetMore) {
                                $pullUpEl.removeClass('flip').addClass('loading');
                                $pullUpLabel.text('Loading...');
                                Club.iScrollRefresh.pullUpAction();
                                window.event.preventDefault();
                            }
                        }
                    }
                });
            }
        },
        firstBannerConfig:function(){
            mySwiper_banner = new Swiper('.swiper-container_banner', {
                pagination: '.swiper-container_banner .swiper-pagination',
                paginationClickable: true,
                loop: true,
                speed: 400,
                spaceBetween: 0,
                observer: true,
                observeParents: true,
                autoplayDisableOnInteraction: false,
                touchMoveStopPropagation: true,
                autoplay: 4000,
                onTouchEnd: function(){
                },
                onTap:function(swiper,event){
                    var $target = '';
                    if (event.target.tagName === 'LI') {
                        $target = $(event.target);
                    } else {
                        $target = $(event.target).closest('LI');
                    }
                    var surveyId=$target.data('bannerid');
                    var surveyType = $target.find(".surveyType").val();
                    if(surveyType=='survey'){
                        activeSurvey.ActiveSurvey.getSurveyNewsDetailbyId(surveyId,'club');
                        //$('#clubSurveyDetails_back').off('click');
                        //$('#clubSurveyDetails_back').off('click').on('click', function () {
                        //$.mobile.changePage('#club', {transition: 'slide',reverse: true,changeHash: false,allowSamePageTransition:true});
                        //});
                    }else{
                        //topbanner details
                        //  var $target = '',
                        pagefrom = '',
                            url = 'activity/getActiveById',
                            param = {};
                        //if (event.target.tagName === 'LI') {
                        //    $target = $(event.target);
                        //} else {
                        //    $target = $(event.target).closest('LI');
                        //}
                        pagefrom = $(event.target).closest('[data-role="page"]').prop('id');
                        param.activityId = $target.data('bannerid');
                        net.post(url, param, function (error) {}, function (response) {
                            if (response.code === 0) {
                                activityDetails.load.init(response, pagefrom);
                                $.mobile.changePage("#clubActiveDetails", {transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
                            }
                        });
                    }

                }
            });
        },
        secondBannerConfig:function(){
            // clubItems
            var mySwiper_clubItems = new Swiper('.swiper-container_clubItems', {
                initialSlide: 0,
                paginationClickable: true,
                preventLinksPropagation : true,
                loop: false,
                spaceBetween: 0,
                observer: true,
                observeParents: true,
                autoplayDisableOnInteraction: false,
                touchMoveStopPropagation: false,
                slidesPerView: 2,
                autoplay: false,
                onTouchEnd: function(){
                }
            });
            $("#club").on("pagehide",function(){
                //页面关闭时候恢复默认位置banner_items
                mySwiper_clubItems._slideTo(0);
            });
        },
        currentPageBackEvent:function(){
            Club.bannerFlagConfig = true;
            mySwiper_banner.destroy();
            $pullUpIcon.show();
            $pullUpEl.addClass('loading');
            $.mobile.newChangePage("#assistantHome",{ transition: "slide",reverse: true,changeHash: false});
            $("#club_content_wrapper").scrollTop(0);
        },
        getTopActive:function(){
            var postData = {};
            postData['userId'] = q['user'].userId;

            net.post('activity/getTopActive', postData, Club.getTopActivefail,
                Club.getTopActiveCallback, null);
        },
        getTopActivefail:function(){
            //Todo
        },
        getTopActiveCallback:function(data){
            if(data.code==0){
                //设置swiper特性仅一次初始化
                if(Club.bannerFlagConfig ==true){
                    $('.swiper-container_banner ul').html(mustache.render(club_firstBanner, data));
                    Club.firstBannerConfig();
                }else{
                    $('.swiper-container_banner ul').html(mustache.render(club_firstBanner, data));
                }
                Club.bannerFlagConfig = false;
            }
        },
        getAllActiveTypes:function(){
            var postData = {};
            postData['userId'] = q['user'].userId;
            var userId = postData['userId'];
            postData = {"userId": userId};
            net.post('activity/getAllActiveTypes', postData, Club.getAllActiveTypesfail,
                Club.getAllActiveTypesCallback, null);
        },
        getAllActiveTypesfail:function(){
            //Todo
        },
        getAllActiveTypesCallback:function(data){
            if(data.code==0){
                $(".club_items_center ul").html(mustache.render(club_secondBanner, data));
                $(".club_items_center ul").append("<li class='swiper-slide li_survey ' id='li_survey'> <dl> <dt><img src='./images/image/clubPage/surveys.png'></dt> <dd>Survey</dd> </dl> </li>");
                Club.secondBannerConfig();
                $(".club_items_center ul li").off('touchend').on('touchend', function (event) {
                    event.preventDefault();
                    if (Club.iScrollRefresh.myScroll.isReady()) {
                        var clubType =  $(this).find("dd").text();
                        localStorage.setItem('type',clubType);
                        if(!$(this).hasClass('li_survey')){
                            $("#activityList").show();
                            $("#activityListSurvey").hide();
                            activityList.load.init('#club', 'activity/getActiveByType', clubType);
                            window.shouldPageRefresh.clubActivity = true;

                        } else{
                            $("#activityList").hide();
                            $("#activityListSurvey").show();
                            $("#lastActive").unbind("pagebeforeshow");
                            // $("#lastActive").onScrollMove()
                            activeSurvey.ActiveSurvey.currentPageNum = 1;
                            activeSurvey.ActiveSurvey.getSurveyList(true);
                        }
                        $.mobile.changePage("#lastActive", {transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
                    }
                });
            }else if(data.code === 1){
                var clubType = data.title;
                localStorage.setItem('type',clubType);
                $("#activityList").show();
                $("#activityListSurvey").hide();
                activityList.load.init('#assistantHome', 'activity/getActiveByType', clubType);
                window.shouldPageRefresh.clubActivity = true;
                $.mobile.changePage("#lastActive", {transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
            }

        },
        ongoingActive:function(Flag){
            wicthFlag =  Flag;
            var postData = {};
            var userId = postData['userId'];
            if(wicthFlag == "openPageFlag"){
                Club.currentPageNumer = 1;
            }
            //分页设置
            postData['pager.pageNo'] = Club.currentPageNumer;
            postData['pager.pageSize'] = 5;
            postData['userId'] = q['user'].userId;
            Club.tempPostData = postData;
            net.post('activity/ongoingActive', postData, Club.ongoingActivefail,
                Club.ongoingActiveCallback, null);
        },
        ongoingActivefail:function(){
            //todo
        },
        ongoingActiveCallback:function(data){
            if(Club.currentPageNumer ==1 && data.data.length==0){
                $('.clubItems_listview').html('There is no OnGoing Activities...')
                $('.clubItems_listview').css({
                    'text-align':'center',
                    'font-size':'1em',
                    'margin-top':'30px',
                    'color':'#888'
                })
            }
            if(data.code==0 && data.data.length >0){
                (Club.currentPageNumer)++;
                $.each(data.data, function(index, item){
                    if(item.brief_content.length > 40){
                        item.brief_content = item.brief_content.substring(0, 40)+'...';
                    }
                    var date = new Date(item.deadline);
                    var month = utils.getMonthString(date.getMonth());
                    item.deadlines = 'Deadline :' + date.getDate() + " " + month + " " + date.getFullYear();
                    //console.log(item.deadlines);
                });

                if(wicthFlag =="openPageFlag"){
                    $(".clubItems_listview_li .ongoingActive").html(mustache.render(club_activeList, data));
                    if (Club.iScrollRefresh.myScroll && Club.iScrollRefresh.myScroll.y !== 0) {
                        initPageLoading('club_content_wrapper');
                        Club.iScrollRefresh.myScroll.y = 0;
                    }
                }else if(wicthFlag =="pullUpFlag"){
                    if(Club.tempPostData["pager.pageNo"] == 1){
                        $(".clubItems_listview_li .ongoingActive").html(mustache.render(club_activeList, data));
                    }else{
                        $(".clubItems_listview_li .ongoingActive").append(mustache.render(club_activeList, data));
                    }
                }
                setTimeout(function() {
                    if(Club.iScrollRefresh.myScroll){
                        Club.iScrollRefresh.myScroll.refresh();
                    }
                }, 800);
            }else if(data.code==0 && data.data.length ==0){
                Club.iScrollRefresh.allowGetMore = false;
                $pullUpEl.addClass('loading');
                setTimeout(function() {
                    if(Club.iScrollRefresh.myScroll){
                        Club.iScrollRefresh.myScroll.refresh();
                    }
                }, 800);
            }
        }
    };
    Club.initEvents();
    /*
     * export the via to let other Modules use it.
     * */
    return Club;
});
