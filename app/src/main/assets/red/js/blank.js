/**
 * Created for Redaholic.
 */
define(function (require) {
    var $ = require('jquery'),
        jqm = require('jquerymobile');

    // blank页面显示时，隐藏底部的tab标签
    $("#blank").on("pagebeforeshow", function( event ) {
        $('#news_footer').hide();
    });

    // 返回assistantHome页面
    $("#blank_back_btn").on('click', function(){
        $.mobile.newChangePage("#assistantHome",{ transition: "slide",reverse: true,changeHash: false});
    });
});
