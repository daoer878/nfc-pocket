/**
 * Created by fannie on 16/12/19.
 */
define(['jquery', 'jquerymobile', 'net', 'dialogs','panle'], function($, m, net, dia,panle) {

    $('#lineShow-menu,#lineShow-back').off('click')
        .on('click', function() {

            //清空浏览记录
            // $("#pop_list").html("");
            // $("#lines_list").html("");
            $('#history_rul_show').html("");
            $('#country_rul_show').html("");
            $('#city_rul_show').html("");
            $('#city_show').html("");

            $(".chevron_down").removeClass("exo");
            $(".chevron_down_two").removeClass("exo");
            $(".chevron_down_three").removeClass("exo");
            $('#country_rul_show').hide();
            $('#city_rul_show').hide();
            $('#lines-back').show();
            $('#lines_btn_menu').show();
            $('#lines-moom').show();
            $('.loadingShow').hide();//遮罩层隐藏
            $('#search_lineList').hide();
            $.mobile.backChangePage("#lines",{ transition: "slide",reverse: true,changeHash: false});
        });

    $("#lineShow").on( "pagecreate", function() {
        $( "body > [data-role='panel']" ).panel();
        $( "body > [data-role='panel'] [data-role='listview']" ).listview();
    });
    //changePassword页面 设置内容高度是Header剩下的高度
    $("#lineShow").on( "pagebeforeshow", function( event ) {
        window.shouldPageRefresh.newsroom = true;
        $('#lineShow-content').css('height', ($(window).height()-44-20));
        $('#lineShow-content-info').css('min-height', ($(window).height()-44));
        // window.historyView = [];
    });
    function compatibility() {
        /* Logon */
        $('#title_lineshow').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_lineshow').css('postion', 'absulute')
            .css('width', '230px')
            .css('height','20px')
            .css('margin', '8px auto auto auto');
    }
    $(document).ready(function () {
        setTimeout(function() {
            // 兼容其他浏览器
            compatibility();
        },1000);
    });
});

