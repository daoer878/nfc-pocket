/**
 * Created for Redaholic.
 */
define(function (require) {
    var $ = require('jquery'),
        jqm = require('jquerymobile');

    // card页面显示时，隐藏底部的tab标签
    $("#card").on("pagebeforeshow", function( event ) {
        $('#news_footer').hide();
    });

    // 返回assistantHome页面
    $("#card_back_btn").on('click', function(){
        $.mobile.newChangePage("#assistantHome",{ transition: "slide",reverse: true,changeHash: false});
    });

    // Set iframe size
    $("#card [data-role=content]").css('height', $(window).height()-64);
});
