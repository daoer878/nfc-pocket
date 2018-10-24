/**
 * Created by Aboo on 17-7-25.
 */
require(['jquery', 'jquerymobile', 'net'], function($, m, net) {


    var Introduction = {
        /**
         * 两个button的事件绑定
         */
        initEvents:function () {

            $("#btn_club_introduction").off('tap').on('tap',function(){

                $.mobile.newChangePage("#club_intro",{ transition: "slide",reverse: false,changeHash: false,allowSamePageTransition:true});
                //获取数据&加载到页面
                Introduction.getIntro();
            });

            //返回按钮
            $("#club-intro-back-btn").off('click').on('click', function () {
                $.mobile.backChangePage("#club", { transition: "slide", reverse: true, changeHash:false});
            });


            //设置内容高度是Header剩下的高度
            $("#club_intro").off('pageshow').on("pageshow", function(event) {
                window.setBodyOverflow($(document.body));
                $('#club-intro-content').css('height', ($(window).height() - 20 - 44));
            });

        },


        /**
         * 获取Club Introduction并加载到页面
         */
        getIntro:function () {
            var getClubIntroUrl = "param/getParamByKey";
            net.post(getClubIntroUrl,{"paramKey": "club_desc"},
                function (error) {
                },
                function (response) {
                    if(response.code == 0){
                        window.shouldPageRefresh.clubActivity = false;
                        var intro = response.data.param.memo;
                        $("#add-club-intro-to-me").html(intro);
                    }else{
                        $("#add-club-intro-to-me").html("Could not load the Introduction");
                    }
                    // 页面再次进入回到顶部
                    $('#club-intro-content').scrollTop(0);
                });
        }
    };

    Introduction.initEvents();

});
