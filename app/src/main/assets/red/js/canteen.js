/**
 * Created by yk on 16/11/11.
 */
define(['jquery', 'jquerymobile', 'net', 'md5','dialogs','swiper'], function($, m, net, md5, dia, Swiper) {
    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    var m_form_page;
    var weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var calendar = {
        $dom: $('#canteen-calendar'),
        _swiper: null,
        _lastSlideIndex: 0,
        _lastIndex: 0,

        height: 0,

        init: function(){
            // 初始化日期列表
            this._createDateDOMs();

            this.updateInfo(new Date());

            this.height = this.$dom.height();

            this.initSwiper();

            // 调用数据获取接口
            //queryDate(new Date());
        },

        _createDateDOMs: function(){
            var today = new Date(),
                todayWeek = today.getDay(), // 0 - 6
                firstDay = new Date(today.getTime() - 24 * 60 * 60 * 1000 * todayWeek),
                item = null,
                span = null;

            var firstWeek = document.createElement('div'),
                twoWeek = document.createElement('div');

            firstWeek.className = 'swiper-slide';
            twoWeek.className = 'swiper-slide';

            this.items = {};
            this.items.first = [];
            this.items.two = [];

            for(var index = 0; index < 14; index++){
                item = document.createElement('div');
                item.className = 'date-item';
                item.setAttribute('data-index', index < 7 ? index : index - 7);

                if(index == todayWeek){
                    item.className += ' today active';

                    this._lastSlideIndex = 0;
                    this._lastIndex = index;
                }

                item.setAttribute('data-timestamp', firstDay.getTime());

                span = document.createElement('span');
                span.innerHTML = firstDay.getDate();

                item.appendChild(span);

                firstDay = new Date(firstDay.getTime() + 24 * 60 * 60 * 1000);

                if(index < 7){
                    this.items.first.push(item);
                    firstWeek.appendChild(item);
                } else {
                    this.items.two.push(item);
                    twoWeek.appendChild(item);
                }
            }

            this.$dom.find('.swiper-wrapper').empty();

            this.$dom.find('.swiper-wrapper').append(firstWeek);
            this.$dom.find('.swiper-wrapper').append(twoWeek);

            $(this.items.first[0]).addClass('weekend');
            $(this.items.first[6]).addClass('weekend');
            $(this.items.two[0]).addClass('weekend');
            $(this.items.two[6]).addClass('weekend');
        },

        initSwiper: function () {
            if(this._swiper !== null){
                this._swiper.update();
                return this;
            }

            var self = this;

            this._swiper = new Swiper('.canteen-swiper-calendar', {
                autoplay: 0,
                speed: 300,
                direction: 'horizontal',

                touchMoveStopPropagation: true, // 阻止Swiper touchMove事件冒泡至上层iScroll

                initialSlide: 0, // 无效；此参数在slidesPerGroup不为1时无效，一直是默认值1（Plug bug? ）

                //slidesPerView: 7, // 一屏显示7个item
                //slidesPerGroup: 7, // 7个为一组

                //spaceBetween:15,

                // touchRatio: 0.5,
                followFinger: false,
                resistanceRatio: 0,

                observer: true,
                observeParents: true,

                onTap: function(swiper, event){
                    var target = null;

                    if(event.target.tagName.toLowerCase() == 'span'){
                        target = $(event.target).parent('.date-item').get(0);
                    } else if(event.target.tagName.toLowerCase() == 'div' && event.target.className.indexOf('date-item') != -1){
                        target = event.target;
                    } else {
                        return false;
                    }

                    if($(target).hasClass('active') || !target || !target.nodeType){
                        return false;
                    }

                    $(swiper.slides).find('.active').removeClass('active');
                    $(target).addClass('active');

                    self._lastSlideIndex = swiper.realIndex;
                    self._lastIndex = parseInt(target.getAttribute('data-index'));

                    var date = new Date(parseInt(target.getAttribute('data-timestamp')));

                    self.updateInfo(date);
                    //// 调用数据获取接口
                    queryDate(date)
                }
            });
        },

        bindSwiperHandle: function(){
            var self = this,
                swiper = this._swiper;

            swiper.off('SlideChangeEnd');

            // 此事件必须在swiper-container元素及其父元素可见状态下绑定，否则出错。。。。因此不能初始化时绑定
            swiper.on('SlideChangeEnd', function(swiper){
                var date = '',
                    nextIndex = 0;

                $(swiper.slides).find('.active').removeClass('active');

                if(self._lastSlideIndex < swiper.realIndex){
                    $(self.items.two[self._lastIndex]).addClass('active');

                    date = self.items.two[self._lastIndex].getAttribute('data-timestamp');
                } else {
                    $(self.items.first[self._lastIndex]).addClass('active');

                    date = self.items.first[self._lastIndex].getAttribute('data-timestamp');
                }

                self._lastSlideIndex = swiper.realIndex;

                date = new Date(parseInt(date));

                self.updateInfo(date);

                // 调用数据获取接口
                queryDate(date);
            });
        },

        updateInfo: function(date){
            var str = weeks[date.getDay()] + '&nbsp;&nbsp;' + months[date.getMonth()] + '&nbsp;' + date.getDate() + ',&nbsp;' + date.getFullYear();

            this.$dom.find('.week-date-info').html(str);
        },

        refresh: function(){
            var swiper = this._swiper;

            swiper.slideTo(0, 200, false);
            $(swiper.slides).find('.active').removeClass('active');
            $(swiper.slides).find('.today').addClass('active');

            this._lastSlideIndex = 0;
            this._lastIndex = parseInt($(swiper.slides).find('.today').attr('data-index'));


            var timestamp = $(swiper.slides).find('.today').attr('data-timestamp');

            this.updateInfo(new Date(parseInt(timestamp)));

            queryDate(new Date(parseInt(timestamp)));
        }
    };

    function initPageLoading(wrapper) {
        var $wrapper = $("#" + wrapper),
            $pullDownEl = $wrapper.find("#pullDown_canteen");

        $("#pullDown_canteen").css("visibility","visible");

        var $pullDownLabel = $pullDownEl.find(".pullDownLabel");
        $wrapper.find(".scroller").css(window.getVendorStyle("transform"), "translate(0, 10px)");
        $pullDownEl.attr("class", "loading");
        $pullDownLabel.text("Loading...");
    }

    var isQueryData = false;

    function queryDate(date){
        //date = new Date(1475452800000);
        initPageLoading("canteen_wrapper");
        isQueryData = true;

        mySwiper.slideTo(1, 200, true);
        // $("#canteen-list-menu").children().removeClass('canteen_sel').eq(0).addClass('canteen_sel');

        var canteen_breakfast = [];//早餐
        var canteen_lunch = [];//午餐
        var canteen_afternoon = [];//晚餐
        var os_canteenHtml = "\<div style='word-wrap:break-word;background-color: #efefef;padding:8px 10px 20px 10px;font-size:10px;line-height: 1.5;font-family: Arial;'>注：餐厅提供的信息不代表#red观点。菜品图片仅供参考，餐厅保留最终解释权 </div>";
        var data = {
            day: date.getTime(),
            canteenId : "1"
        };
        net.post('canteen/queryFoods',data,function(error){
            isQueryData = false;
        },function(response){
            isQueryData = false;
           if(response.code != 0){
               $('#breakfast_id').html('');
               $('#lunch_id').html('');
               $('#afternoon_id').html('');
           }else{
               $("#canteen_wrapper").find('.swiper-container').show();
               $("#pullDown_canteen").css("visibility","hidden");

               var height = $(window).height() - 44 - $('#canteen-calendar').height() - $('#canteen-list-menu').height() + 2;

               $.each(response.data.Breakfast,function(index,val){
                   var value = val.list;
                   var str_typeName = val.typeName;
                   canteen_breakfast.push("\<div class='canteen-list-typename'>"+str_typeName+"\</div><div class='canteen-list'>");
                   $.each(value,function(index,vau){
                       var str_price = vau.price;//价格
                       var str_img = vau.food_img;//图片
                       var str_name = vau.food_name;//食品名称
                       var str_pungency_degree = vau.pungency_degree;//辣度
                       var pungency_html = "";
//                       if(str_pungency_degree == "0"){
//                           pungency_html = "";
//                       }else if(str_pungency_degree == "1"){
//                           pungency_html = "<i class='pepper-icon'></i>";
//                       }else if(str_pungency_degree == "2"){
//                           pungency_html = "<i class='pepper-icon'></i><i class='pepper-icon-2'></i>";
//                       }else if(str_pungency_degree == "3"){
//                           pungency_html = "<i class='pepper-icon'></i><i class='pepper-icon-2'></i><i class='pepper-icon-2'></i>";
//                       }
                       canteen_breakfast.push("<div class='canteen-list-item'>\
                                            <div class='thumb'><img src='"+str_img+"'/><div><div>"+pungency_html+"<div class='Price-val'>￥"+str_price+"</div></div></div></div>\
                                            <div>"+str_name+"</div></div>");
                   });
                   canteen_breakfast.push('</div>');
               });
               $('#breakfast_id').html(canteen_breakfast.join("") + os_canteenHtml);
               if(response.data.Breakfast.length == 0){
                   $('#breakfast_id').html('<div style="font-size:14px;color:#888;text-align: center;min-height:'+ height + '\px;line-height: 144px;background-color: #efefef;">No available items so far.</div>');
               }

               $.each(response.data.Lunch,function(index,val){
                   var value = val.list;
                   var str_typeName = val.typeName;
                   canteen_lunch.push("\<div class='canteen-list-typename'>"+str_typeName+"\</div><div class='canteen-list'>");
                   $.each(value,function(index,vau){
                       var str_price = vau.price;//价格
                       var str_img = vau.food_img;//图片
                       var str_name = vau.food_name;//食品名称
                       var str_pungency_degree = vau.pungency_degree;//辣度
                       var pungency_html = "";
//                       if(str_pungency_degree == "0"){
//                           pungency_html = "";
//                       }else if(str_pungency_degree == "1"){
//                           pungency_html = "<i class='pepper-icon'></i>";
//                       }else if(str_pungency_degree == "2"){
//                           pungency_html = "<i class='pepper-icon'></i><i class='pepper-icon-2'></i>";
//                       }else if(str_pungency_degree == "3"){
//                           pungency_html = "<i class='pepper-icon'></i><i class='pepper-icon-2'></i><i class='pepper-icon-2'></i>";
//                       }
                       canteen_lunch.push("<div class='canteen-list-item'>\
                                            <div class='thumb'><img src='"+str_img+"'/><div><div>"+pungency_html+"<div class='Price-val'>￥"+str_price+"</div></div></div></div>\
                                            <div>"+str_name+"</div></div>");
                   });
                   canteen_lunch.push('</div>');
               });
               $('#lunch_id').html(canteen_lunch.join("") + os_canteenHtml);
               if(response.data.Lunch.length == 0){
                   $('#lunch_id').html('<div style="font-size:14px;color:#888;text-align: center;min-height:'+ height + '\px;line-height: 144px;background-color: #efefef;">No available items so far.</div>');
               }

               $.each(response.data.Afternoon,function(index,val){
                   var value = val.list;
                   var str_typeName = val.typeName;
                   canteen_afternoon.push("\<div class='canteen-list-typename'>"+str_typeName+"\</div><div class='canteen-list'>");
                   $.each(value,function(index,vau){
                       var str_price = vau.price;//价格
                       var str_img = vau.food_img;//图片
                       var str_name = vau.food_name;//食品名称
                       var str_pungency_degree = vau.pungency_degree;//辣度
                       var pungency_html = "";
//                       if(str_pungency_degree == "0"){
//                           pungency_html = "";
//                       }else if(str_pungency_degree == "1"){
//                           pungency_html = "<i class='pepper-icon'></i>";
//                       }else if(str_pungency_degree == "2"){
//                           pungency_html = "<i class='pepper-icon'></i><i class='pepper-icon-2'></i>";
//                       }else if(str_pungency_degree == "3"){
//                           pungency_html = "<i class='pepper-icon'></i><i class='pepper-icon-2'></i><i class='pepper-icon-2'></i>";
//                       }
                       canteen_afternoon.push("<div class='canteen-list-item'>\
                                            <div class='thumb'><img src='"+str_img+"'/><div><div>"+pungency_html+"<div class='Price-val'>￥"+str_price+"</div></div></div></div>\
                                            <div>"+str_name+"</div></div>");
                   });
                   canteen_afternoon.push('</div>');
               });
               $('#afternoon_id').html(canteen_afternoon.join("") + os_canteenHtml);
               if(response.data.Afternoon.length == 0){
                   $('#afternoon_id').html('<div style="font-size:14px;color:#888;text-align: center;min-height:'+ height + '\px;line-height: 144px;background-color: #efefef;">No available items so far.</div>');
               }

        }
            //if(mySwiper.realIndex === 0){
                setTimeout(function(){
                    myScroll.refresh();
                }, 250);
            //}
    });
    }
    var mySwiper = new Swiper('.canteen-swiper-main',{
        initialSlide:0,
        speed: 200,
        direction: 'horizontal',
        autoHeight: true,
        observer:true,
        observeParents:true,
        followFinger: false,
        resistanceRatio: 0,
        touchAngle: 20,
        touchMoveStopPropagation: true, // true 阻止Swiper touchMove事件冒泡至上层iScroll
        onTouchMove: function(swiper, event){
            console.log('swiper touch move %o', swiper);
            event.preventDefault();
        },
        onSlideChangeStart: function(swiper){
        //    console.debug('Swiper slide start');
        //},
        //onSlideChangeEnd:function(swiper){console.log('change Slide %o', swiper)
            var sIndex = swiper.activeIndex;
            if(sIndex == "0"){
                $('#breakfast').addClass('canteen_sel');
                $('#lunch').removeClass('canteen_sel');
                $('#afternoon').removeClass('canteen_sel');
            }else if(sIndex == "1"){
                $('#breakfast').removeClass('canteen_sel');
                $('#lunch').addClass('canteen_sel');
                $('#afternoon').removeClass('canteen_sel');
            }else if(sIndex == "2"){
                $('#breakfast').removeClass('canteen_sel');
                $('#lunch').removeClass('canteen_sel');
                $('#afternoon').addClass('canteen_sel');
            }else{
                console.log('不可能含有其它类型');
            }

            setTimeout(function(){
                myScroll.refresh();
            }, 450);

        }
    });

    $('#breakfast').off('click')
        .on('click',function(){
            mySwiper.slideTo(0, 200, true); // 触发slideEnd回调
        });
    $('#lunch').off('click')
        .on('click',function(){
            mySwiper.slideTo(1, 200, true);
        });
    $('#afternoon').off('click')
        .on('click',function(){
            mySwiper.slideTo(2, 200, true);
        });

    $('#canteen_catalog').off('click').on('click',function(event){
        if($('#canteen_catlog_content').hasClass("showcatlog")){
            $('#canteen_catlog_content').removeClass("showcatlog");
            $('#canteen_catlog_content').slideUp(500);
            setTimeout(function(){
                $('#canteen_title').show();
            },600);

        }else{
            $('#canteen_title').hide();
            $('#canteen_catlog_content').addClass("showcatlog");
            $('#canteen_catlog_content').slideDown(500);

        }
    });
    $('#canteen_catlog_opacity').off('click').on('click',function(evt){
        $('#canteen_catlog_content').removeClass("showcatlog");
        $('#canteen_catlog_content').slideUp(500, function(){
            $('#canteen_title').show();
        });
    });

    $('#canteen_catlog_info div').off('click').on('click',function(evt){
        if($(this).hasClass('current')){
            if($('#canteen_catlog_content').hasClass("showcatlog")){
                $('#canteen_catlog_content').removeClass("showcatlog");
                $('#canteen_catlog_content').slideUp(500);
            }else{
                $('#canteen_catlog_content').addClass("showcatlog");
                $('#canteen_catlog_content').slideDown(500);
            }
        }else{
            var url = $(this).attr('url');
            if(url == "#canteen"){
                $('.canteen_menu').css('background',"yellow");
                $('.canteen_super').css('background',"#f26647");
                $('.canteen_rules').css('background',"#f26647");
                $('#canteen_catlog_content').removeClass("showcatlog");
                $('#canteen_catlog_content').slideUp(500, function(){
                    $('#canteen_title').show();
                });
                //$.mobile.newChangePage(url,{ transition: "slide",reverse: false,changeHash: false});
            }else if(url == "#canteen_super"){
                $('.canteen_menu').css('background',"#f26647");
                $('.canteen_super').css('background',"yellow");
                $('.canteen_rules').css('background',"#f26647");
                $('#canteen_catlog_content').removeClass("showcatlog");
                $('#canteen_catlog_content').slideUp(500);
                $.mobile.newChangePage(url,{ transition: "slide",reverse: false,changeHash: false});
            }else if(url == "#canteen_rules"){
                $('.canteen_menu').css('background',"#f26647");
                $('.canteen_super').css('background',"#f26647");
                $('.canteen_rules').css('background',"yellow");
                $('#canteen_catlog_content').removeClass("showcatlog");
                $('#canteen_catlog_content').slideUp(500);
                $.mobile.newChangePage(url,{ transition: "slide",reverse: false,changeHash: false});
            }

        }
    });

    var lastScrollTop = 0;
    // iscroll
    var myScroll = {
        ins: null,

        init: function(){
            if(this.ins !== null){
                // this.refresh();
                return true;
            }

            this.ins = new iScroll('canteen_wrapper', {
                hScroll: false,
                vScroll: true,
                vScrollbar: false,
                bounce: false,
                bounceLock: false,
                useTransition:false,
                checkDOMChanges:true,
                onScrollMove: function(){console.log('Move %o', this.y);
                    if(this.y > -60){
                        //myScroll.ins.scrollTo(0, -60, 200);
                        // $('#canteen-calendar').removeClass('hasAnimate');
                        //
                        // lastScrollTop = -60;

                    } else {
                        if(lastScrollTop >= this.y){
                            // 上滑
                            if(-this.y >= $('#canteen-calendar').height()){
                                if(!$('#canteen-calendar').hasClass('hasAnimate')){
                                    //$('#canteen-calendar').addClass('hasAnimate').stop().slideUp(500);
                                    $('#canteen-calendar').addClass('hasAnimate');
                                }
                            }
                        } else {
                            // 下滑
                            if($('#canteen-calendar').hasClass('hasAnimate')){
                                //$('#canteen-calendar').removeClass('hasAnimate').stop().slideDown(500);
                                $('#canteen-calendar').removeClass('hasAnimate');
                            }
                        }

                        lastScrollTop = this.y;
                    }
                },

                onScrollEnd: function(){console.log('end %o', this.y);
                    if(isQueryData || hasLeavePage){
                        return false;
                    }
                    if(this.y > -60){
                        $('#canteen-calendar').removeClass('hasAnimate');
                        myScroll.ins.scrollTo(0, -60, 200);
                        lastScrollTop = -60;
                    }
                }
            });
        },

        refresh: function(){
            if(this.ins === null){
                return false;
            }

            var self = this;

            // 停止JS引擎，执行渲染引擎，等渲染完成后再refresh
            setTimeout(function(){
                self.ins.refresh();
            }, 100);

            $('#canteen-calendar').removeClass('hasAnimate');
            //if($('#canteen-calendar').hasClass('hasAnimate')){
            //    myScroll.ins.scrollTo(0, -$('#canteen-calendar').height(), 200);
            //} else {
                myScroll.ins.scrollTo(0, -60, 200);
            //}
        }
    };


    $('#canteen').off('pagebeforeshow').on('pagebeforeshow', function(event){
        $('#news_footer').hide();
        //statusbar.styleDefault();
        //$('#breakfast_id').html("");
        //$('#lunch_id').html("");
        //$('#afternoon_id').html("");
        //$("#canteen-list-menu").children().removeClass('canteen_sel').eq(0).addClass('canteen_sel');
        $('#canteen_catlog_content').removeClass("showcatlog");
        $('#canteen-calendar').removeClass('hasAnimate');

        $('.canteen_menu').css('background',"yellow");
        $('.canteen_super').css('background',"#f26647");
        $('.canteen_rules').css('background',"#f26647");
        //$("#pullDown_canteen").css("visibility","visible");
        //$('#breakfast').addClass('canteen_sel');
        //$('#lunch').removeClass('canteen_sel');
        //$('#afternoon').removeClass('canteen_sel');
    });

    //设置内容高度是Header剩下的高度
    $("#canteen").off('pageshow')
        .on( "pageshow", function( event ) {
            //initPageLoading('canteen_wrapper');
            window.setBodyOverflow($(document.body));
            $('#canteen_show_content').css('height',($(window).height()-44-20));

            $('#canteen_catlog_content').css('height',($(window).height()-44));
            $('#canteen_catlog_opacity').css('height', ($(window).height() - 340 + 52 + 58-4));

            //$('#canteen_show_content_info').css('height',($(window).height()-44));
            $('#canteen_wrapper').css('height',($(window).height()-44));
            $('#canteen_wrapper').children('.scroller').css('padding-top', $('#canteen-calendar').height() + $('#canteen-list-menu').height() + 2);
            $('#canteen_wrapper').children('.scroller').css('min-height', $(window).height() - 44 + 2 + 60);
            $('#canteen_wrapper').find('.swiper-slide').css('min-height', $(window).height() - 44 - $('#canteen-calendar').height() - $('#canteen-list-menu').height() + 2);

            // 兼容其他浏览器
            compatibility();
            // window.historyView = [];

            hasLeavePage = false;

            calendar.init();
            calendar.bindSwiperHandle();
            setTimeout(function(){
                calendar.refresh();
            },200);
        });

    var hasLeavePage = false;

    $('#canteen').off('pagehide').on('pagehide',function(){
        $('#canteen_title').show();
        $('#canteen_catlog_content').hide();

        hasLeavePage = true;
    });
    function compatibility() {
        /* Logon */
        $('#title_registration_term').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_registration_term').css('postion', 'absulute')
            .css('width', '120px')
            .css('height','20px')
            .css('margin', '8px auto auto auto')
            .css('text-align', 'center');
    }

    $(document).ready(function () {
        myScroll.init();
        setTimeout(function() {
            // 兼容其他浏览器
            compatibility();
        },1000);
    });
});
