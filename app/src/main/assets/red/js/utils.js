/**
 * Created by levon on 2017/7/26.
 */
define(function (require) {
    var $ = require('jquery'),
        iscroll = require('../libs/iscroll-4.2.5/iscroll');

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
                // pullDownOffset = $pullDownEl[0].offsetHeight,
                pullDownOffset = 50,
                $pullUpEl = $wrapper.find('.js-pullUp'),
                $pullUpLabel = $pullUpEl.find('.pullUpLabel'),
                $pullUpIcon = $pullUpEl.find('.pullUpIcon'),
                // pullUpOffset = $pullUpEl[0].offsetHeight;
                pullUpOffset = 50;

            iScrollRefresh.myScroll = new iScroll(wrapper, {
                hScrollbar: false,
                vScrollbar: false,
                fixedScrollbar: true,
                useTransition: false,
                checkDOMChanges: false,
                topOffset: pullDownOffset,
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
                        $('#newsroom_top').fadeOut();
                    } else {
                        $('#newsroom_top').fadeIn();
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
                        $('#newsroom_top').fadeOut();
                    } else {
                        $('#newsroom_top').fadeIn();
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

    function dateString(date, isShowTime) {
        var date = new Date(date);
        var month = getMonthString(date.getMonth());
        var time = '';

        if (isShowTime) {
            time = pad(date.getHours(), 2) + ':' + pad(date.getMinutes(), 2) + ', ' + pad(date.getDate(), 2) + " " + month + " " + date.getFullYear();
        } else {
            time = pad(date.getDate(), 2) + " " + month + " " + date.getFullYear();
        }
        return time;
    }

    function pad(num, width) {
        num = num + '';
        return (num.length >= width) ? num : ('0' + num);
    }

    function getMonthString(month) {
        month = month + 1;
        switch (month) {
            case 1:
                return 'Jan';
            case 2:
                return 'Feb';
            case 3:
                return 'Mar';
            case 4:
                return 'Apr';
            case 5:
                return 'May';
            case 6:
                return 'June';
            case 7:
                return 'July';
            case 8:
                return 'Aug';
            case 9:
                return 'Sept';
            case 10:
                return 'Oct';
            case 11:
                return 'Nov';
            case 12:
                return 'Dec';
            default:
                console.log('month有误');
        }
    }

    return {
        iScrollRefresh: iScrollRefresh,
        dateString: dateString,
        getMonthString:getMonthString
    };
});
