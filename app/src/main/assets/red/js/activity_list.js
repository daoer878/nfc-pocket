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
        activityDetails = require('./activity_details'),
        iscroll = require('../libs/iscroll-4.2.5/iscroll'),
        club_activeList = require('text!club_activeList'),
        club_activeDetails = require('text!club_activeDetails');

    var currentPageNum = 1,
        currentUrl = '';

    var load = {
        init: function (pageFrom, url, headerTitle) {
            currentUrl = url;
            this.render(headerTitle);
            this.bind(pageFrom);
        },
        render: function (headerTitle) {
            $('#lastActive .header-title').html(headerTitle);
            if (iScrollRefresh.myScroll === null) {
                iScrollRefresh.loaded('activityList');
                iScrollRefresh.pullDownAction = getActivityList;
                iScrollRefresh.pullUpAction = getActivityList;
            }
        },
        bind: function (pageFrom) {
            $('#lastActive_back').off('click').on('click', function (event) {
                $.mobile.changePage(pageFrom, {transition: 'slide',reverse: true,changeHash: false,allowSamePageTransition:true});
            });
            $('#lastActive').off('pagebeforeshow').on('pagebeforeshow', function () {
                if (window.shouldPageRefresh.clubActivity) {
                    $('#lastActive-list li').html('');
                    initPageLoading('activityList');
                    getActivityList(true);
                }
            });
            $('.js-scrollTop').off('tap').on('tap', function (event) {
                event.stopPropagation();
                $(this).fadeOut();
                $(this).siblings('.scroller').css({'-webkit-transform': 'translate(0, -50px)', 'transform': 'translate(0, -50px)'});
            });
        }
    };

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

    function getActivityList(isRefresh) {
        var url = currentUrl,
            pageSize = 5,
            param = {};

        if (isRefresh) {
            currentPageNum = 1;
            $('#activityList').find('.js-pullUp').hide();
        }
        param['userId'] = q['user'].userId;
        param['pager.pageNo'] = currentPageNum;
        param['pager.pageSize'] = pageSize;

        if (url === 'activity/getActiveByType') {
            param['type'] = localStorage.getItem('type');
        }
        net.post(url, param, function (error) {}, function (response) {
            if (response.code !== 0) {

            } else {
                var responseLength = response.data.length;
                var $pullUpEl = $('#activityList').find('.js-pullUp'),
                    $pullUpLabel = $pullUpEl.find('.pullUpLabel'),
                    $pullUpIcon = $pullUpEl.find('.pullUpIcon');
                if (responseLength > 0) {
                    window.shouldPageRefresh.clubActivity = false;
                    $.each(response.data, function (index, item) {
                        if (url === 'activity/getActiveByType') {
                            item.deadlines = 'Deadline : ' + utils.dateString(item.deadline);
                        } else if (url === 'activity/lastActive') {
                            item.showEndTime = 'End time : ' + utils.dateString(item.end_time);
                        }

                        item.brief_content = (item.brief_content).length > 40 ? (item.brief_content).substring(0, 40) + '...' : (item.brief_content);
                     });
                }

                if (isRefresh) {
                    $('#lastActive-list li').html(mustache.render(club_activeList, response));
                    if (iScrollRefresh.myScroll && iScrollRefresh.myScroll.y !== 0) {
                        iScrollRefresh.myScroll.y = 0;
                    }
                } else {
                    $('#lastActive-list li').append(mustache.render(club_activeList, response));
                }

                setTimeout(function () {
                    if (responseLength < pageSize) {
                        $pullUpEl.show();
                        $pullUpIcon.hide();
                        $pullUpLabel.text('No more articles available!');
                        iScrollRefresh.allowGetMore = false;
                    } else {
                        $pullUpEl.show();
                        $pullUpIcon.show();
                        $pullUpLabel.text('Pull up to load more...');
                        iScrollRefresh.allowGetMore = true;
                        currentPageNum ++;
                    }
                    iScrollRefresh.myScroll.refresh();
                }, 500);
            }
        });
    }

    var iScrollRefresh = {
        myScroll: null,
        allowGetMore: true,
        pullDownAction: function() {

        },
        pullUpAction: function() {

        },
        loaded: function(wrapper) {
            var $wrapper = $('#' + wrapper),
                $pullDownEl = $wrapper.find('.js-pullDown'),
                $pullDownLabel = $pullDownEl.find('.pullDownLabel'),
                pullDownOffset = $pullDownEl[0].offsetHeight,
                $pullUpEl = $wrapper.find('.js-pullUp'),
                $pullUpLabel = $pullUpEl.find('.pullUpLabel'),
                $pullUpIcon = $pullUpEl.find('.pullUpIcon'),
                pullUpOffset = $pullUpEl[0].offsetHeight;

            iScrollRefresh.myScroll = new iScroll(wrapper, {
                hScrollbar: false,
                vScrollbar: false,
                fixedScrollbar: true,
                useTransition: false,
                checkDOMChanges: false,
                topOffset: 50,
                onRefresh: function () {
                    console.log('onRefresh');
                    if ($pullDownEl.hasClass('loading')) {
                        $pullDownEl.removeClass('loading');
                        $pullDownLabel.text('Pull down to refresh...');
                    }
                    if ($pullUpEl.hasClass('loading')) {
                        $pullUpEl.removeClass('loading');
                        if (iScrollRefresh.allowGetMore) {
                            $pullUpIcon.show();
                            $pullUpLabel.text('Pull up to load more...');
                        } else {
                            $pullUpIcon.hide();
                            $pullUpLabel.text('No more articles available!');
                        }
                    }
                },
                onScrollMove: function () {
                    if (this.y >= -50){
                        $('.js-scrollTop').fadeOut();
                    } else {
                        $('.js-scrollTop').fadeIn();
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
                        if (iScrollRefresh.allowGetMore) {
                            $pullUpEl.addClass('flip');
                            $pullUpLabel.text('Release to load more...');
                            this.maxScrollY = this.maxScrollY;
                        }
                    } else if (this.y > (this.maxScrollY + 5) && $pullUpEl.hasClass('flip')) {
                        if (iScrollRefresh.allowGetMore) {
                            $pullUpEl.removeClass('flip');
                            $pullUpLabel.text('Pull up to load more...');
                            this.maxScrollY = pullUpOffset;
                        }
                    }
                },
                onScrollEnd: function () {
                    console.log('onScrollEnd'+this.y);
                    if (this.y >= -50) {
                        $('.js-scrollTop').fadeOut();
                    } else {
                        $('.js-scrollTop').fadeIn();
                    }
                    if ($pullDownEl.hasClass('flip')) {
                        $pullDownEl.removeClass('flip').addClass('loading');
                        $pullDownLabel.text('Loading...');
                        iScrollRefresh.pullDownAction(true);
                    }
                    if ($pullUpEl.hasClass('flip')) {
                        if (iScrollRefresh.allowGetMore) {
                            iScrollRefresh.allowGetMore = false;
                            $pullUpEl.removeClass('flip').addClass('loading');
                            $pullUpLabel.text('Loading...');
                            iScrollRefresh.pullUpAction();
                        }
                    }
                }
            });
        }
    };

    return {
        load: load
    };
});
