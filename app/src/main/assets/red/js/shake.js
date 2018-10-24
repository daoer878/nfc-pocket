/**
 * Created by Linda on 12/02/2018.
 * It developed for 2018 New Year.
 */
require(['jquery', 'jquerymobile', 'net', 'dialogs'], function ($, m, net, dia) {
    var ShakeLaisee = {
        roomNumber: null,  //当前房间号
        initEvents: function () {
            this.toShakePage();
            this.backToAssistant();
            this.getLuckyPerson();
            this.startShake();
            this.enterRoom();
            this.cancelEntering();
            this.returnToShake();
        },
        toShakePage: function () {
            $("#shake-menu").off('touchend').on('touchend', function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                if(!$("#shake-menu").hasClass('game_started')){//未开始
                    dia.alert('Tips',"Coming soon!",['OK'],function () {

                    });
                }else if($(this).hasClass('game_off')){ //已结束
                    dia.alert('Tips','This game is out of date! Thanks for your supporting .',['OK'],function () {
                    });
                }else{
                    $("#news_footer").hide();
                    $("#shakeBossPage").css('height',"100%");
                    window.setBodyOverflow($(document.body));
                    $('#shake-content').css('height', ($(window).height()));
                    //弹框让输入房间号
                    $(".alert-box").show();
                    $(".alert-loading").hide();
                    $(".alert-room-input-background").show();
                }
            });
        },
        backToAssistant: function () {
            $(".shake-close-btn").off('touchend').on('touchend', function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $("#news_footer").show();
                $(".alert-room-input-background").hide();
                $(".hidden-room-input").empty();
                this.roomNumber = null;
                $.mobile.backChangePage("#assistantHome", {transition: "slide", reverse: true, changeHash: false});
            })
        },
        getLuckyPerson: function () {
            var that = this;
            $(".getPrizeIcon").off('tap').on('tap', function ($event) {
                $event.stopPropagation();
                $(".shakeWrapper").hide();
                $(".shake-lucky-wrapper").show();
                $("#luck-ul").empty();
                //获得所有中奖人名单
                 var url = "giftWinner/getGifttWinner";
                 var param = {
                     roomNo:that.roomNumber
                 }
                 net.get(url,param,function (error) {

                 },function (response) {
                     if(response.code == 0){
                         that.renderLucyPerson(response.data);
                     }
                 });
            })
        },
        startShake: function () {
            //按钮是动态加载的，所以此处要用事件委托
            $(".shake-btn-ul").on('touchend', '.shake-btn-li',function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                var btnId = $(this).attr('id');
                //开始摇奖
                var $this = $(this);
                var url = "gift/startGames";
                var param = {
                    gid:btnId
                }
                net.get(url, param, function (error) {
                }, function (response) {
                    if(response.code == 0){
                        $this.find("div").removeClass("shake-btn").addClass("shake-btn-no");
                        $this.find("div").text("已摇过奖");
                    }
                });

            })
        },
        enterRoom: function () {
            var that = this;
            $("#enter-room-btn").off('touchend').on('touchend', function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $(".alert-box").hide();
                $(".alert-loading").show();
                var room_number = $('.input-room').val();
                that.roomNumber = room_number;
                var url = "gift/getGift";
                var param = {
                    staffId: q['user'].staffId,
                    roomNo: room_number
                }
                net.get(url, param, function (error) {
                    console.log("timeout");
                    $(".alert-loading").hide();
                }, function (response) {
                    //根据的返回的结果判断进入BOSS端还是Staff端
                    if (response.code == 0) {
                        if (response.data) {
                            if (response.data.whiteList && response.data.isBoss) {
                                that.initShakePage(response.data.list);
                                $.mobile.changePage("#shakeBossPage", {
                                    transition: "slide",
                                    reverse: false,
                                    changeHash: false,
                                    allowSamePageTransition: true
                                 });
                            } else {
                                $("#news_footer").show();
                                $(".alert-room-input-background").hide();
                                $(".hidden-room-input").empty();
                                that.roomNumber = null;
                                param['whiteList'] = response.data.whiteList == true ? "1":"0";
                                //调native
                                shakeLaisee.goToStaffPage(param, function () {//success
                                  }, function () {//fail
                                });
                            }
                        } else {
                            dia.alert('Tips', '您输入的房间号不存在', ['OK'], function () {
                                $(".alert-box").show();
                                $(".alert-loading").hide();
                            });
                        }

                    } else {
                        dia.alert('Error', response.msg, ['OK'], function () {
                            $(".alert-box").show();
                            $(".alert-loading").hide();
                        });
                    }
                });
            })
        },
        cancelEntering: function () {
            $("#room-cancel-btn").off('touchend').on('touchend', function ($event) {
                $event.preventDefault();
                $("#news_footer").show();
                $('.input-room').val('');
                $(".alert-room-input-background").hide();
            });
        },
        initShakePage: function (btnList) {
            var that = this;
            $("#shakeBossPage").off('pagebeforeshow').on("pagebeforeshow", function () {
                $(".shakeWrapper").show();
                $(".shake-lucky-wrapper").hide();
                $(".shake-room-number").text(that.roomNumber ? that.roomNumber : "0000");
                //根据当前房间的类型创建不同个数的摇奖按钮
                var html = "";
                if(btnList && btnList.length > 0){
                    for(var i = 0;i < btnList.length;i++){
                        //如果超过三个按钮，显示前三个
                        if(i > 2){
                            break;
                        }
                        var text = "";
                        var temp = "";
                        var idName = btnList[i].gid ? btnList[i].gid:'eid';
                        if(btnList[i].status == 0){
                            text = "开始第"+(i+1)+"轮摇奖";
                            temp = "<li class='shake-btn-li' id='"+idName+"'><div class='shake-btn'>"+text+"</div></li>";
                        } else {
                            text = "已摇过奖";
                            temp = "<li class='shake-btn-li' id='"+idName+"'><div class='shake-btn-no'>"+text+"</div></li>";
                        }
                        html+=temp;
                    }
                }else {
                    html += "<div class='no-shake-btn'>游戏时间还没有开始，过会儿再来吧。</div>";
                }


                $(".shake-btn-ul >ul").empty().append(html);
            });
        },
        returnToShake: function () {
            $(".shake-prize-close").off('touchend').on('touchend', function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $(".shakeWrapper").show();
                $(".shake-lucky-wrapper").hide();
            })
        },
        renderLucyPerson:function(list){
            var temp = "";
            if(list && list.length < 1){
                temp = "<div class='no-luck-person'>暂时还没有人中奖，请稍后再来查看</div>"
            }else{
                temp = "<li>" +
                    "<span class='slide-tips'>*您可以试试滑动滚动条查看更多中奖人员哦</span>"+
                    "</li>" +
                    "<li>" +
                    "<span class='luck-staffId theader'>StaffId</span>" +
                    "<span class='luck-staffId theader'>StaffName</span>" +
                    "<span class='luck-staffId theader'>Money</span>" +
                    "</li>";
                for(var i = 0;i< list.length; i++){
                    var staffId = list[i].staffId ? list[i].staffId : "E0000";
                    var staffName = list[i].staffName ? list[i].staffName : "E0000";
                    var money = list[i].money ? '￥'+list[i].money :"￥0";
                    temp += "<li class='luck-person-li'>" +
                        "<span class='luck-staffId'>"+staffId +"</span>" +
                        "<span class='luck-person'>"+staffName+"</span>" +
                        "<span class='luck-money'>"+money+"</span>" +
                        "</li>";
                }
            }

            $("#luck-ul").append(temp);
        }

    }
    ShakeLaisee.initEvents();
})
