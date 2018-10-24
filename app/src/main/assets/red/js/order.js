/**
 * Created by kiki on 2017/2/28.
 */

define(['jquery', 'jquerymobile', 'net', 'dialogs','panle'], function($, m, net, dia,panle) {
    $("#myorder-menu,#myorder-back").on('click',function(){
        $.mobile.newChangePage("#myCornerHome",{ transition: "slide",reverse: true,changeHash: false});
    })

    $("#myOrders").on( "pagecreate", function() {
        $( "body > [data-role='panel']" ).panel();
        $( "body > [data-role='panel'] [data-role='listview']" ).listview();
    });
    //changePassword页面 设置内容高度是Header剩下的高度
    $("#myOrders").on( "pagebeforeshow", function( event ) {
        window.shouldPageRefresh.newsroom = true;
        $('#orders_content').css('height', ($(window).height()-44-20-10-10));
        $('#orders_content_info').css('height', ($(window).height()-44-20));
        // window.historyView = [];
    });






});