/**
 * Created by yk on 16/11/16.
 */
define(['jquery', 'jquerymobile', 'net', 'md5','dialogs'], function($, m, net, md5, dia) {


    $('#canteen-super-btn-menu,#canteen-super-btn-back, #header-white > .back-black').off('click')
        .on('click', function() {
            $.mobile.backChangePage("#canteen",{ transition: "slide",reverse: true,changeHash: false});
        });

    $('#canteen_super').find('.more').off('click').on('click', function(){
        //
    });

    $('#canteen_super').find('.swiper-menu').find('a').off('click').on('click', function(){
        var index = $(this).index();

        if(index < 0){
            return false;
        } else {
            mySwiper.ins.slideTo(index, 300, true);
        }
    });

    $('#canteen_super').find('.more').off('tap').on('tap', function(){
        if($(this).hasClass('expand')){
            $(this).removeClass('expand');
            $('.fm_canteen_show').css("padding","0 0");
            $(mySwiper.ins.slides[0]).children('div').first().addClass('line-5');

            myScroll.ins.scrollTo(0, 0);
        } else {
            $(this).addClass('expand');
            //$('.fm_canteen_show').css("padding","15px 0");
            $(mySwiper.ins.slides[0]).children('div').first().removeClass('line-5');
        }
    });

    $('#canteen-preview-image').off('tap').on('tap', function(event){
        $(this).stop().animate({
            'margin-left': $(window).width()
        }, 300, 'linear', function(){
            $(this).hide();
        });

        event.stopPropagation();
        event.preventDefault();
    });

    var mySwiper = {
        ins : null,
        init: function(){
            if(this.ins !== null){
                $('#canteen_super').find('.swiper-slide').eq(1).css('max-height', '100px');
                this.ins.slideTo(0, 300, true);
                $('#canteen_super').find('.swiper-menu').children('a').removeClass('active').first().addClass('active');
                return true;
            }

            this.ins = new Swiper('.canteen-super-swiper', {
                autoplay: 0,
                speed: 300,
                direction: 'horizontal',

                touchMoveStopPropagation: true, // 阻止Swiper touchMove事件冒泡至上层iScroll

                followFinger: false,
                resistanceRatio: 0,

                preventClicks: true,
                preventClicksPropagation: true,

                observer: true,
                observeParents: true,

                onTap: function(swiper, event){
                    if(swiper.realIndex !== 1){
                        return false;
                    }

                    if(event.target.tagName.toLowerCase() !== 'img'){
                        return false;
                    }

                    var image = event.target;

                    $('#canteen-preview-image').find('img').attr('src', image.src);
                    $('#canteen-preview-image').css({
                        'display': 'block',
                        'margin-left': $(window).width()
                    });
                    $('#canteen-preview-image').stop().animate({
                        'margin-left': '0px'
                    }, 300);
                },

                onSlideChangeStart: function(swiper){
                    if(swiper.realIndex === 0){
                        $('#canteen_super').find('.swiper-menu').children('div').children('a').removeClass('active').first().addClass('active');
                        $('#canteen_super').find('.swiper-menu').children('span').stop().animate({
                            'margin-left': '0px'
                        }, 300);

                        $('#canteen_super').find('.more').removeClass('expand');
                        $(mySwiper.ins.slides[0]).children('div').first().addClass('line-5');

                        $('#canteen_super').find('.swiper-slide').eq(1).css('max-height', '100px');

                        myScroll.refresh();
                    } else {
                        $('#canteen_super').find('.swiper-menu').children('div').children('a').removeClass('active').last().addClass('active');
                        $('#canteen_super').find('.swiper-menu').children('span').stop().animate({
                            'margin-left': $(window).width() / 2 + 'px'
                        }, 300);

                        $('#canteen_super').find('.swiper-slide').eq(1).css('max-height', 'none');

                        myScroll.refresh();
                    }
                }
            });
        }
    };

    var myScroll = {
        ins : null,

        init: function(){
            if(this.ins !== null){
                return true;
            }

            var self = this;

            this.ins = new iScroll('canteen-super-content', {
                hScroll: false,
                vScroll: true,
                vScrollbar: false,
                bounce: false,
                bounceLock: false,
                useTransition:false,
                checkDOMChanges:true,
                onScrollMove: function(){
                    /*if(self.ins.y >= -30){
                        $('#canteen_super').children('.ui-header').show();
                    } else {
                        $('#canteen_super').children('.ui-header').hide();
                    }*/
                    if(self.ins.y >= -30){
                        $('#canteen_super').children('.ui-header').show();
                        $('#header-white').stop().fadeOut(50);
                    } else {
                        $('#canteen_super').children('.ui-header').hide();
                        $('#header-white').stop().fadeIn(50);
                    }
                },
                onScrollEnd: function(){
                    if(self.ins.dirY === -1){
                        if(self.ins.y >= -30){
                            $('#canteen_super').children('.ui-header').show();
                            $('#header-white').stop().fadeOut(100);
                        };
                    } else if(self.ins.dirY === 1){
                        $('#canteen_super').children('.ui-header').hide();
                        $('#header-white').stop().fadeIn(100);
                    }
                }
            });
        },

        refresh: function(){
            this.ins.scrollTo(0, 0);

            $('#header-white').hide();
            $('#canteen_super').children('.ui-header').show();

            var self = this;

            setTimeout(function(){
                self.ins.refresh();
            }, 100);
        }
    };

    //设置内容高度是Header剩下的高度
    $("#canteen_super").off('pageshow')
        .on( "pageshow", function( event ) {
            window.setBodyOverflow($(document.body));
            $('#canteen-super-content').css('height',($(window).height()));

            $('#canteen-preview-image').css('height', $(window).height());

            $('#canteen_super').children('.ui-header').show();
            $('#header-white').hide();

            $('#canteen_super').find('.more').removeClass('expand');
            $('#canteen_super').find('.swiper-slide').eq(0).children('div').first().addClass('line-5');

            mySwiper.init();

            myScroll.init();
            myScroll.refresh();

            // 兼容其他浏览器
            compatibility();
            // window.historyView = [];
        });

    function compatibility() {
        /* Logon */
        $('#title_canteen_supplier').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_canteen_supplier').css('postion', 'absulute')
            .css('width', '120px')
            .css('height','20px')
            .css('margin', '8px auto auto auto')
            .css('text-align', 'center');
    }

    $(document).ready(function () {
        setTimeout(function() {
            // 兼容其他浏览器
            compatibility();
        },1000);
    });
});