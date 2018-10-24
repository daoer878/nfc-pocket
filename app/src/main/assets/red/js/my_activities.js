/**
 * Created by Aboo on 17-7-26.
 */
define(function (require) {
    var $ = require('jquery'),
        jqm = require('jquerymobile'),
        net = require('net'),
        config = require('config'),
        mustache = require('mustache'),
        text = require('text'),
        utils = require('utils'),
        club_activeList = require('text!club_activeList');


    var currentPageNum = 1;

    var load = {
        init: function () {
            this.render();
            this.bind();
        },
        render: function () {
            if ($('#my-activities-nav li.ui-btn-active a').attr('id') === 'myJoined') {
                $('#joined-activities-list').show();
                $('#attention-activities-list, #attention-activities-list .js-scrollTop').hide();
            } else {
                $('#attention-activities-list').show();
                $('#joined-activities-list, #joined-activities-list .js-scrollTop').hide();
            }
            if (iScroll_joined.myScroll === null) {
                iScroll_joined.loaded('joined-activities-list');
            }
            if (iScroll_attention.myScroll === null) {
                iScroll_attention.loaded('attention-activities-list');
            }
        },
        bind: function () {
            $('#my-activities-nav li').off('tap').on('tap', function (event) {
                var $tabId = $(this).find('a').attr('id');
                $(this).siblings('li').removeClass('ui-btn-active').end().addClass('ui-btn-active');
                if ($tabId === 'myJoined') {
                    $('#joined-activities-list').show();
                    $('#attention-activities-list, #attention-activities-list .js-scrollTop').hide();
                } else {
                    $('#attention-activities-list').show();
                    $('#joined-activities-list, #joined-activities-list .js-scrollTop').hide();
                }
            });

            $('#club-me-back-btn').off('click').on('click', function (event) {
                $.mobile.changePage('#club', {transition: 'slide',reverse: true,changeHash: false,allowSamePageTransition:true});
            });

            $('#club_mine').off('pagebeforeshow').on('pagebeforeshow', function () {
                if (window.shouldPageRefresh.clubActivity) {
                    $('#my-activities-nav li:first-child').siblings('li').removeClass('ui-btn-active').end().addClass('ui-btn-active');
                    $('#joined-activities-list').show();
                    $('#attention-activities-list, #attention-activities-list .js-scrollTop').hide();
                    initPageLoading('joined-activities-list');
                    getJoinedList(true);

                    initPageLoading('attention-activities-list');
                    getAttentionList(true);
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

    function getJoinedList(isRefresh) {
        var url = 'activity/getMyJoing',
            pageSize = 5,
            param = {};

        if (isRefresh) {
            currentPageNum = 1;
            $('#joined-activities-list').find('.js-pullUp').hide();
        }
        param['userId'] = q['user'].userId;
        param['pager.pageNo'] = currentPageNum;
        param['pager.pageSize'] = pageSize;

        net.post(url, param, function (error) {}, function (response) {
            if (response.code !== 0) {

            } else {
                var responseLength = response.data.length;
                var $pullUpEl = $('#joined-activities-list').find('.js-pullUp'),
                    $pullUpLabel = $pullUpEl.find('.pullUpLabel'),
                    $pullUpIcon = $pullUpEl.find('.pullUpIcon');
                if (responseLength > 0) {
                    $.each(response.data, function (index, item) {
                        item.showStartTime = 'Start time : ' + utils.dateString(item.start_time);

                        item.brief_content = (item.brief_content).length > 40 ? (item.brief_content).substring(0, 40) + '...' : (item.brief_content);
                    });
                }

                if (isRefresh) {
                    $('#joined-list li').html(mustache.render(club_activeList, response));
                    if (iScroll_joined.myScroll && iScroll_joined.myScroll.y !== 0) {
                        iScroll_joined.myScroll.y = 0;
                    }
                } else {
                    $('#joined-list li').append(mustache.render(club_activeList, response));
                }

                setTimeout(function () {
                    if (responseLength < pageSize) {
                        $pullUpEl.show();
                        $pullUpIcon.hide();
                        $pullUpLabel.text('No more articles available!');
                        iScroll_joined.allowGetMore = false;
                    } else {
                        $pullUpEl.show();
                        $pullUpIcon.show();
                        $pullUpLabel.text('Pull up to load more...');
                        iScroll_joined.allowGetMore = true;
                        currentPageNum ++;
                    }
                    iScroll_joined.myScroll.refresh();
                }, 500);
            }
        });
    }

    function getAttentionList(isRefresh) {
        var url = 'activity/getMyAttention',
            pageSize = 5,
            param = {};

        if (isRefresh) {
            currentPageNum = 1;
            $('#attention-activities-list').find('.js-pullUp').hide();
        }
        param['userId'] = q['user'].userId;
        param['pager.pageNo'] = currentPageNum;
        param['pager.pageSize'] = pageSize;
        param['type'] = 'activity';

        net.post(url, param, function (error) {}, function (response) {
            if (response.code !== 0) {

            } else {
                window.shouldPageRefresh.clubActivity = false;
                var responseLength = response.data.length;
                var $pullUpEl = $('#attention-activities-list').find('.js-pullUp'),
                    $pullUpLabel = $pullUpEl.find('.pullUpLabel'),
                    $pullUpIcon = $pullUpEl.find('.pullUpIcon');
                if (responseLength > 0) {
                    $.each(response.data, function (index, item) {
                        item.deadlines = 'Deadline : ' + utils.dateString(item.deadline);

                        item.brief_content = (item.brief_content).length > 40 ? (item.brief_content).substring(0, 40) + '...' : (item.brief_content);
                    });
                }

                if (isRefresh) {
                    $('#attention-list li').html(mustache.render(club_activeList, response));
                    if (iScroll_attention.myScroll && iScroll_attention.myScroll.y !== 0) {
                        iScroll_attention.myScroll.y = 0;
                    }
                } else {
                    $('#attention-list li').append(mustache.render(club_activeList, response));
                }

                setTimeout(function () {
                    if (responseLength < pageSize) {
                        $pullUpEl.show();
                        $pullUpIcon.hide();
                        $pullUpLabel.text('No more articles available!');
                        iScroll_attention.allowGetMore = false;
                    } else {
                        $pullUpEl.show();
                        $pullUpIcon.show();
                        $pullUpLabel.text('Pull up to load more...');
                        iScroll_attention.allowGetMore = true;
                        currentPageNum ++;
                    }
                    iScroll_attention.myScroll.refresh();
                }, 500);
            }
        });
    }

    var iScroll_joined = {
            myScroll: null,
            allowGetMore: true,
            pullDownAction: function() {
                getJoinedList(true);
            },
            pullUpAction: function() {
                getJoinedList();
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

                iScroll_joined.myScroll = new iScroll(wrapper, {
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
                            if (iScroll_joined.allowGetMore) {
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
                            if (iScroll_joined.allowGetMore) {
                                $pullUpEl.addClass('flip');
                                $pullUpLabel.text('Release to load more...');
                                this.maxScrollY = this.maxScrollY;
                            }
                        } else if (this.y > (this.maxScrollY + 5) && $pullUpEl.hasClass('flip')) {
                            if (iScroll_joined.allowGetMore) {
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
                            iScroll_joined.pullDownAction(true);
                        }
                        if ($pullUpEl.hasClass('flip')) {
                            if (iScroll_joined.allowGetMore) {
                                iScroll_joined.allowGetMore = false;
                                $pullUpEl.removeClass('flip').addClass('loading');
                                $pullUpLabel.text('Loading...');
                                iScroll_joined.pullUpAction();
                            }
                        }
                    }
                });
            }
        },
        iScroll_attention = {
            myScroll: null,
            allowGetMore: true,
            pullDownAction: function() {
                getAttentionList(true);
            },
            pullUpAction: function() {
                getAttentionList();
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

                this.myScroll = new iScroll(wrapper, {
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
                            if (iScroll_attention.allowGetMore) {
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
                            if (iScroll_attention.allowGetMore) {
                                $pullUpEl.addClass('flip');
                                $pullUpLabel.text('Release to load more...');
                                this.maxScrollY = this.maxScrollY;
                            }
                        } else if (this.y > (this.maxScrollY + 5) && $pullUpEl.hasClass('flip')) {
                            if (iScroll_attention.allowGetMore) {
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
                            iScroll_attention.pullDownAction();
                        }
                        if ($pullUpEl.hasClass('flip')) {
                            if (iScroll_attention.allowGetMore) {
                                iScroll_attention.allowGetMore = false;
                                $pullUpEl.removeClass('flip').addClass('loading');
                                $pullUpLabel.text('Loading...');
                                iScroll_attention.pullUpAction();
                            }
                        }
                    }
                });
            }
        };

    return {
        load: load
    };
    /*//参加活动的当前页
    var joinedCurrPage = 1;
    //关注活动的当前页
    var attentionCurrPage = 1;

    //每页显示条数
    var varPageSize = 5;

    //加载开关：判断是否有更多数据
    var hasMoreJoined = true;
    var hasMoreAttention = true;

    //no more 字符开关
    var join_hasStr = false;
    var atten_hasStr = false;

    var NoMoreStr = "<div class='no_more_act'>No More Activities!</div>";
    //活动简介最大显示值
    var maxStr = 40;

    var MyAcitivities = {

        /!**
         * 初始化方法（入口方法）
         *!/
        initEvents:function () {

            $("#club_me_btn").off('tap').on('tap',function(){
                $.mobile.newChangePage("#club_mine",{ transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
                // $("#my-joined-act-btn").addClass("ui-btn-active");
                // $("#joined-activities-list").css('display','').addClass("showing");
                // $("#attention-activities-list").css('display','none');
                // //下载我参加的活动和我关注的活动
                // MyAcitivities.loadMyJoined(1,varPageSize);
                // MyAcitivities.loadMyAttention(1,varPageSize);

            });

            $("#my-joined-act-btn").off('tap').on('tap',function () {
                console.log("clicked joined");
                $("#attention-activities-list").css('display','none').removeClass("showing");
                $("#joined-activities-list").css('display','').addClass("showing");
                //
                MyAcitivities.iScrollRefresh.myScroll.refresh();

                setTimeout(function () {
                    $('#my-activities-content').find('.scroller').css({'-webkit-transform': 'translate(0, -50px)', 'transform': 'translate(0, -50px)'});
                },250)
            });

            $("#my-tracked-act-btn").off('tap').on('tap',function () {
                console.log("clicked attention");
                $("#joined-activities-list").css('display','none').removeClass("showing");
                $("#attention-activities-list").css('display','').addClass("showing");
                //
                MyAcitivities.iScrollRefresh.myScroll.refresh();

                setTimeout(function () {
                    $('#my-activities-content').find('.scroller').css({'-webkit-transform': 'translate(0, -50px)', 'transform': 'translate(0, -50px)'});
                },250)
            });



            $("#club-me-back-btn").off('tap').on('tap',function () {
                $.mobile.backChangePage("#club", { transition: "slide", reverse: true, changeHash:false});

            });
            1
            //设置内容高度是Header剩下的高度
            $("#club_mine").off('pageshow').on("pageshow", function(event) {
                window.setBodyOverflow($(document.body));
                var navbar_height = $("#my-activities-nav").outerHeight();
                $('#my-activities-content').css('height', ($(window).height() - 20 - 44 - navbar_height));

            });
            $("#club_mine").off('pagebeforeshow').on("pagebeforeshow", function(event) {

                //初始化其高度
                $('#my-activities-content').find('.scroller').css({'-webkit-transform': 'translate(0, -50px)', 'transform': 'translate(0, -50px)'});
                //当前页复位
                joinedCurrPage = 1;
                attentionCurrPage = 1;
                //加载开关复位
                hasMoreJoined = true;
                hasMoreAttention = true;

                join_hasStr = false;
                atten_hasStr = false;

                //===== 不论从哪里回到此页面，页面都会重新加载 =============
                $("#my-joined-act-btn").addClass("ui-btn-active");
                $("#joined-activities-list").css('display','').addClass("showing");
                $("#attention-activities-list").css('display','none');
                //下载我参加的活动和我关注的活动
                MyAcitivities.loadMyJoined(1,varPageSize);
                MyAcitivities.loadMyAttention(1,varPageSize);
                //====================================================

                MyAcitivities.iScrollRefresh.myScroll = null;

                if (MyAcitivities.iScrollRefresh.myScroll === null) {
                    MyAcitivities.iScrollRefresh.loaded('my-activities-content');
                }

            });

        },

        /!**
         * 获取我参加的活动
         * @param pageNo
         * @param pageSize
         *!/
        loadMyJoined : function (pageNo,pageSize) {
            var joinedActUrl = "activity/getMyJoing";
            var userId = q['user'].userId;
            var requestParam = {'userId':userId,'pager.pageNo':pageNo,'pager.pageSize':pageSize};

            net.post(joinedActUrl,requestParam,function (error) {},function (response) {
                if(response.code==0){
                    console.log(response);
                    MyAcitivities.cutMoreThanMaxStr(response);
                    MyAcitivities.deadlineParse(response);

                    $("#joined-activities-list .joined_Activities").html(mustache.render(club_activeList, response));
                }
            });
        },

        /!**
         * load more joined
         * @param pageNo
         * @param pageSize
         *!/
        loadMoreJoined : function (pageNo,pageSize) {
            var joinedActUrl = "activity/getMyJoing";
            var userId = q['user'].userId;
            var requestParam = {'userId':userId,'pager.pageNo':pageNo,'pager.pageSize':pageSize};

            net.post(joinedActUrl,requestParam,function (error) {},function (response) {
                MyAcitivities.cutMoreThanMaxStr(response);
                MyAcitivities.deadlineParse(response);

                if(response.code == 0 && response.data.length == 0 && !join_hasStr){
                    hasMoreJoined = false;
                    $("#joined-activities-list .joined_Activities").append(NoMoreStr);
                    join_hasStr = true;
                }else{
                    $("#joined-activities-list .joined_Activities").append(mustache.render(club_activeList, response));
                }
            });
        },

        /!**
         * 获取我关注的活动
         * @param pageNo
         * @param pageSize
         *!/
        loadMyAttention : function (pageNo,pageSize) {
            var joinedActUrl = "activity/getMyAttention";
            var userId = q['user'].userId;
            var requestParam = {'userId':userId,'pager.pageNo':pageNo,'pager.pageSize':pageSize,'type':'activity'};

            net.post(joinedActUrl,requestParam,function (error) {},function (response) {
                if(response.code == 0){
                    MyAcitivities.cutMoreThanMaxStr(response);
                    MyAcitivities.deadlineParse(response);
                    $("#attention-activities-list .attention_Activities").html(mustache.render(club_activeList, response));

                }
            });
        },

        /!**
         * load more attention
         * @param pageNo
         * @param pageSize
         *!/
        loadMoreAttention : function (pageNo,pageSize) {
            var joinedActUrl = "activity/getMyAttention";
            var userId = q['user'].userId;
            var requestParam = {'userId':userId,'pager.pageNo':pageNo,'pager.pageSize':pageSize,'type':'activity'};

            net.post(joinedActUrl,requestParam,function (error) {},function (response) {
                MyAcitivities.cutMoreThanMaxStr(response);
                MyAcitivities.deadlineParse(response);
                if(response.code == 0 && response.data.length == 0 && !atten_hasStr){
                    hasMoreAttention = false;
                    $("#attention-activities-list .attention_Activities").append(NoMoreStr);
                    atten_hasStr = true;
                }else{
                    $("#attention-activities-list .attention_Activities").append(mustache.render(club_activeList, response));
                }

            });
        },

        //砍掉多余60字的内容(最大字数限制自定义)
        cutMoreThanMaxStr : function(response){
            $.each(response.data, function(index, item) {
                if (item.brief_content.length > maxStr) {
                    item.brief_content = item.brief_content.substring(0, maxStr) + '...';
                }
            });
        },
        //deadline的格式化
        deadlineParse : function (response) {
            $.each(response.data,function (index,item) {
                var date = new Date(item.deadline);
                var month = utils.getMonthString(date.getMonth());
                item.deadlines = 'Deadline :' + date.getDate() + " " + month + " " + date.getFullYear();
            })
        },


        iScrollRefresh : {
            myScroll: null,
            allowGetMore: true,
            pullDownAction: function() {
                setTimeout(function() {
                    if(MyAcitivities.iScrollRefresh.myScroll){
                        MyAcitivities.iScrollRefresh.myScroll.refresh();
                    }
                }, 800);
                console.log("pull Down Action Happening ...");
                if($("#joined-activities-list").hasClass("showing")){
                    console.log("joined 刷新中...")
                    MyAcitivities.loadMyJoined(1,varPageSize*joinedCurrPage);

                }else if($("#attention-activities-list").hasClass("showing")){
                    console.log("attention 刷新中...");
                    MyAcitivities.loadMyAttention(1,varPageSize*attentionCurrPage);

                }

            },
            pullUpAction: function() {
                setTimeout(function() {
                    if(MyAcitivities.iScrollRefresh.myScroll){
                        MyAcitivities.iScrollRefresh.myScroll.refresh();
                    }
                }, 800);
                console.log("pull Up Action Happening ...");
                if($("#joined-activities-list").hasClass("showing")){
                    console.log("joined loading more..."+joinedCurrPage)
                    if(hasMoreJoined) {
                        joinedCurrPage++;
                        MyAcitivities.loadMoreJoined(joinedCurrPage, varPageSize);
                    }
                }else if($("#attention-activities-list").hasClass("showing")){
                    console.log("attention loading more..."+attentionCurrPage);
                    if(hasMoreAttention) {
                        attentionCurrPage++;
                        MyAcitivities.loadMoreAttention(attentionCurrPage, varPageSize);
                    }
                }

            },

            loaded: function(wrapper) {
                var $wrapper = $('#' + wrapper),
                    $pullDownEl = $wrapper.find('.js-pullDown'),
                    $pullDownLabel = $pullDownEl.find('.pullDownLabel'),
                    pullDownOffset = 50,
                    $pullUpEl = $wrapper.find('.js-pullUp'),
                    $pullUpLabel = $pullUpEl.find('.pullUpLabel'),
                    $pullUpIcon = $pullUpEl.find('.pullUpIcon'),
                    pullUpOffset = this.maxScrollY;

                MyAcitivities.iScrollRefresh.myScroll = new iScroll(wrapper, {
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
                            $pullUpIcon.show();
                            $pullUpEl.show();
                            $pullUpLabel.text('Pull up to load more...');
                        }
                    },
                    onScrollMove: function () {
                        if (this.y > 5 && !$pullDownEl.hasClass('flip')) {
                            $pullDownEl.addClass('flip');
                            $pullDownLabel.text('Release to refresh...');
                            this.minScrollY = 0;
                        } else if (this.y < 5 && $pullDownEl.hasClass('flip')) {
                            $pullDownEl.removeClass('flip');
                            $pullDownLabel.text('Pull down to refresh...');
                            this.minScrollY = -pullDownOffset;
                        } else if (this.y < (this.maxScrollY - 5) && !$pullUpEl.hasClass('flip')) {
                            if (MyAcitivities.iScrollRefresh.allowGetMore) {
                                $pullUpEl.addClass('flip');
                                $pullUpLabel.text('Release to load more...');
                                this.maxScrollY = this.maxScrollY;
                                $pullUpEl.show();
                            }
                        } else if (this.y > (this.maxScrollY + 5) && $pullUpEl.hasClass('flip')) {
                            if (MyAcitivities.iScrollRefresh.allowGetMore) {
                                $pullUpEl.removeClass('flip');
                                $pullUpLabel.text('Pull up to load more...');
                                this.maxScrollY = pullUpOffset;
                                $pullUpEl.show();

                            }
                        }
                    },
                    onScrollEnd: function () {
                        console.log("onScrollEnd:"+this.y+"min:"+this.minScrollY+"max:"+this.maxScrollY);
                        if ($pullDownEl.hasClass('flip')) {
                            $pullDownEl.removeClass('flip').addClass('loading');
                            $pullDownLabel.text('Loading...');
                            MyAcitivities.iScrollRefresh.pullDownAction(true);

                        }
                        if ($pullUpEl.hasClass('flip') ) {
                            if (MyAcitivities.iScrollRefresh.allowGetMore) {
                                $pullUpEl.removeClass('flip').addClass('loading');
                                $pullUpLabel.text('Loading...');
                                MyAcitivities.iScrollRefresh.pullUpAction();
                            }
                        }
                    }
                });
            }
        },




    };
    MyAcitivities.initEvents();*/
});
