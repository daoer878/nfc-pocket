/**
 * Created by Administrator on 2018/5/31.
 */
/**
 * Created by Administrator on 2018/5/29.
 */
require(['jquery'],
    function($) {
        var IntegralRule = {
            initEvents:function(){
                $('#rule_back').click(function(){
                    $.mobile.newChangePage("#integral_page",{transition:"slide",reverse: true,changeHash: false});
                });
             }
        }
        IntegralRule.initEvents();
    });

