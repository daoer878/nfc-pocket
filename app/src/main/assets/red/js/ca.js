
require(['jquery', 'jquerymobile', 'net', 'dialogs','panle'], function($, m, net, dia,panle) {
    //点击进入添加CA页面
    $('#new_registration').off('click').on('click',function(evt){
        $("#add_registration").attr("frompage","ca");
        $.mobile.newChangePage("#add_registration",{ transition: "slide",reverse: false,changeHash: false});
    });
    //点击进入CA信息列表
    $('#registration_records').off('click').on('click',function(evt){
        $("#registration_record").attr("frompage","ca");
        $.mobile.newChangePage("#registration_record",{ transition: "slide",reverse: false,changeHash: false});
    });
    //点击进入help页面
    $('#ca_help,#ca_help1,#ca_help2,#ca_help3,#ca_help4').off('click').on('click',function(evt){
        //$("#registration_record").attr("frompage","ca");
        $.mobile.newChangePage("#ca_helpShow",{ transition: "slide",reverse: false,changeHash: false});
    });
    //进入ca_help页面
    $('#help_pages').off('click').on('click',function(evt){
        //$("#registration_record").attr("frompage","ca");
        $.mobile.newChangePage("#ca_helpShow",{ transition: "slide",reverse: false,changeHash: false});
    });
    //点击进入CA规则说明页面
    $('#registration_rules').off('click').on('click',function(evt){
        $('#registration_rule').attr("frompage","ca");  
        $.mobile.newChangePage("#registration_rule",{ transition: "slide",reverse: false,changeHash: false}); 
    }); 
    $("#ca").on( "pagecreate", function() {
        $( "body > [data-role='panel']" ).panel();
        $( "body > [data-role='panel'] [data-role='listview']" ).listview();
    });
    //changePassword页面 设置内容高度是Header剩下的高度
    $("#ca").on( "pagebeforeshow", function( event ) {
        $('#news_footer').hide();
        window.shouldPageRefresh.newsroom = true; 
        $('#ca_content').css('height', ($(window).height()-44-20));
        $('#ca_content_info').css('min-height', ($(window).height()-44-20));  
        // window.historyView = [];
    });  
    function compatibility() {
        /* Logon */
        $('#title_ca').parent()
            .css('display', 'block')
            .css('postion', 'relative');

        $('#title_ca').css('postion', 'absulute')
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

